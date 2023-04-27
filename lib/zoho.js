const fire = require("../services/fire");
const {
  collection,
  doc,
  setDoc,
  query,
  addDoc,
  getDocs,
  getDoc,
  where,
  collectionGroup,
  startAt,
  orderBy,
  endAt,
  limit,
  startAfter,
  documentId,
  updateDoc,
  serverTimestamp,
} = require("firebase/firestore");
const { getStorage, ref, getDownloadURL } = require("firebase/storage");
const fireDB = require("../connections/firebase");
// const db = require("../connections/db");

const async = require("async");
const Constant = require("../lib/constants");
const { firestore } = require("firebase-admin");
const Admin = require("mongodb/lib/admin");
const e = require("express");
//   const docRef = query(collec
try {
  const Database = require("../services/database");
  const Response = require("../services/response");

  let CONSTANTS = require("../lib/constants");

  const Initializer = require("zcrmsdk/routes/initializer").Initializer;
  const {
    OAuthToken,
    TokenType,
  } = require("zcrmsdk/models/authenticator/oauth_token");
  const UserSignature = require("zcrmsdk/routes/user_signature").UserSignature;
  const { Logger, Levels } = require("zcrmsdk/routes/logger/logger");
  const INDataCenter = require("zcrmsdk/routes/dc/in_data_center").INDataCenter;
  const DBStore =
    require("zcrmsdk/models/authenticator/store/db_store").DBStore;

  const SDKConfigBuilder =
    require("zcrmsdk/routes/sdk_config_builder").MasterModel;
  const {
    ModulesOperations,
    GetModulesHeader,
  } = require("zcrmsdk/core/com/zoho/crm/api/modules/modules_operations");
  const axios = require("axios");
  const FormData = require("form-data");

  const environment = process.env.NODE_ENV;
  const stage = require("./../config")[environment];

  module.exports = {
    async initialize(type, action = "fetch", data = {}) {
      return new Promise(async (resolve, reject) => {
        try {
          console.log("Here");
          const client_id = "1000.3VAPF92IYUGJ0AYGNR1CQV8UDSHQFL";
          const client_secret = "46f6a1d373f9fb487f3073ff4a5d44576b83ddea39";
          const grant_type = "refresh_token";
          const code =
            "1000.9bdc9bf884a4fa5d6e630c063ff781b7.399ea17dcdfa72e3980d1456c73b254a"; // Optained from db(refresh token);
          const scope =
            "ZohoCRM.settings.fields.ALL,ZohoCRM.modules.ALL,ZohoCRM.coql.READ";
          const redirect_uri = "https://www.zohoapis.in/";

          const logger = Logger.getInstance(Levels.VERBOSE, "../../logger");
          const user = new UserSignature("lochan@ofexperiences.com");
          const environment = INDataCenter.PRODUCTION();
          const sdkConfig = new SDKConfigBuilder()
            .setPickListValidation(false)
            .setAutoRefreshFields(true)
            .build();
          const resourcePath = "../../";

          let token = new OAuthToken(
            client_id,
            client_secret,
            code,
            TokenType.REFRESH,
            redirect_uri
          );
          // let tokenstore = new DBStore("localhost", "ofex", "root", "", "3306");
          let tokenstore = new DBStore(
            stage.mysql_connection_host,
            stage.mysql_user,
            stage.mysql_password,
            stage.mysql_database,
            stage.mysql_port
          );

          await Initializer.initialize(
            user,
            environment,
            token,
            tokenstore,
            sdkConfig,
            resourcePath,
            logger
          );
          let initializer = await Initializer.getInitializer();

          let connectionData = new FormData();
          connectionData.append("grant_type", grant_type);
          connectionData.append("client_id", client_id);
          connectionData.append("client_secret", client_secret);
          connectionData.append("code", code);
          connectionData.append("redirect_uri", redirect_uri);

          var config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://accounts.zoho.in/oauth/v2/token",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              ...connectionData.getHeaders(),
            },
            data: connectionData,
          };

          try {
            let tokenResponse = await axios(config);
            const tokenAPIResponse = tokenResponse?.data;
            let access_token = tokenAPIResponse?.access_token;
            let refresh_token = tokenAPIResponse?.refresh_token;
            if (access_token || refresh_token) {
              let insert = await addDoc(
                collection(fireDB, Constant.collection.zoho_tokens),
                {
                  access_token: access_token,
                  refresh_token: refresh_token,
                  inserted_at: serverTimestamp(),
                }
              );
            }
            if (action === "fetch") {
              let responseLeads = await fetchData(type);
              resolve(responseLeads?.data);
            } else if (action === "create") {
              let responseLeads = await postData(type, data);
              resolve(responseLeads?.data);
              // Save Daya
              // let responseLeads = await fetchData(type);
              // resolve(responseLeads?.data);
            } else if (action === "update") {
              let responseLeads = await updateData(type, data);
              resolve(responseLeads);
            } else if (action === "filter") {
              let responseLeads = await filterData(type, data);
              resolve(responseLeads);
            }
          } catch (e) {
            console.log(e);
            resolve([]);
          }
        } catch (e) {
          console.log(e);
          resolve([]);
        }
      });
    },
  };

  function fetchData(type) {
    return new Promise(async (resolve, reject) => {
      try {
        // let q_fetch_access_token = orderby();
        let zoho_tokens = await fire.fetch();
        if (
          zoho_tokens.code === 200 &&
          zoho_tokens.result?.length > 0 &&
          zoho_tokens.result?.[0]?.access_token
        ) {
          let access_token = zoho_tokens.result?.[0]?.access_token;
          const leadsRecordConfig = {
            method: "get",
            maxBodyLength: Infinity,
            url: "https://www.zohoapis.in/crm/v2/" + type,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: "Bearer " + access_token,
            },
          };

          // console.log(Leads)
          let leadsRecord = await axios(leadsRecordConfig);
          resolve(leadsRecord.data);
        } else {
          console.log("No Tokens fetch data");
          resolve([]);
        }
      } catch (e) {
        console.log("Fetch Data Error", e);
        resolve([]);
      }
    });
  }

  function postData(type, data) {
    return new Promise(async (resolve, reject) => {
      try {
        // let q_fetch_access_token = `select access_token, refresh_token from zoho_tokens order by id desc limit 1`;
        zoho_tokens = await fire.fetch();
        if (
          zoho_tokens.code === 200 &&
          zoho_tokens.result?.length > 0 &&
          zoho_tokens.result?.[0]?.access_token
        ) {
          let access_token = zoho_tokens.result?.[0]?.access_token;
          const leadsRecordConfig = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://www.zohoapis.in/crm/v2/" + type,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: "Bearer " + access_token,
            },
            data: JSON.stringify(data),
          };
          let leadsRecord = await axios(leadsRecordConfig);
          resolve(leadsRecord.data);
        } else {
          console.log("No Tokens post data");
          resolve([]);
        }
      } catch (e) {
        console.log("post Data Error", e);
        resolve([]);
      }
    });
  }

  function updateData(type, data) {
    return new Promise(async (resolve, reject) => {
      try {
        // let q_fetch_access_token = `select access_token, refresh_token from zoho_tokens order by id desc limit 1`;
        zoho_tokens = await fire.fetch();
        if (
          zoho_tokens.code === 200 &&
          zoho_tokens.result?.length > 0 &&
          zoho_tokens.result?.[0]?.access_token
        ) {
          let access_token = zoho_tokens.result?.[0]?.access_token;
          const leadsRecordConfig = {
            method: "put",
            maxBodyLength: Infinity,
            url: "https://www.zohoapis.in/crm/v2/" + type,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: "Bearer " + access_token,
            },
            data: JSON.stringify(data),
          };
          let leadsRecord = await axios(leadsRecordConfig);
          resolve(leadsRecord.data);
        } else {
          console.log("No Tokens update data");
          resolve([]);
        }
      } catch (e) {
        console.log("post Data Error", e);
        resolve([]);
      }
    });
  }

  function filterData(type, data) {
    return new Promise(async (resolve, reject) => {
      try {
        zoho_tokens = await fire.fetch();
        if (
          zoho_tokens.code === 200 &&
          zoho_tokens.result?.length > 0 &&
          zoho_tokens.result?.[0]?.access_token
        ) {
          let access_token = zoho_tokens.result?.[0]?.access_token;
          const leadsRecordConfig = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://www.zohoapis.in/crm/v2/" + type,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: "Bearer " + access_token,
            },
            data: JSON.stringify(data),
          };

          console.log("Here ---1");
          let leadsRecord = await axios(leadsRecordConfig);
          resolve(leadsRecord.data);
        } else {
          console.log("No Tokens post data");
          resolve([]);
        }
      } catch (e) {
        console.log("post Data Error", e);
        resolve([]);
      }
    });
  }

  async function generateAccessToken(
    refresh_token,
    client_id,
    client_secret,
    grant_type
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let url = " https://accounts.zoho.in/oauth/v2/token";

        let parameter = {
          refresh_token: refresh_token,
          client_id: client_id,
          client_secret: client_secret,
          grant_type: grant_type,
        };

        let queryString = Object.keys(parameter)
          .map((key) => key + "=" + parameter[key])
          .join("&");

        console.log(url + "?" + queryString);

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: url + "?" + queryString,
          headers: {},
        };

        let response = await axios(config);

        console.log(response?.data);

        let access_token = response?.data?.access_token;
        if (access_token || refresh_token) {
          let insert = await addDoc(
            collection(fireDB, Constant.collection.zoho_tokens),
            {
              access_token: access_token,
              refresh_token: refresh_token,
              inserted_at: serverTimestamp(),
            }
          );
        }

        resolve(response?.data);
      } catch (e) {
        // console.log(e)
        reject(e);
      }
    });
  }
} catch (e) {
  console.log(e);
}
