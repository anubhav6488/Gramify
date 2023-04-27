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
const DBStore = require("zcrmsdk/models/authenticator/store/db_store").DBStore;
const FileStore =
  require("zcrmsdk/models/authenticator/store/file_store").FileStore;
const RequestProxy = require("zcrmsdk/routes/request_proxy").RequestProxy;
const SDKConfigBuilder =
  require("zcrmsdk/routes/sdk_config_builder").MasterModel;
const HeaderMap = require("zcrmsdk/routes/header_map").HeaderMap;
const ParameterMap = require("zcrmsdk/routes/parameter_map").ParameterMap;
const ResponseWrapper =
  require("zcrmsdk/core/com/zoho/crm/api/record/response_wrapper").ResponseWrapper;
const {
  ModulesOperations,
  GetModulesHeader,
} = require("zcrmsdk/core/com/zoho/crm/api/modules/modules_operations");
const axios = require("axios");
const { Constants } = require("zcrmsdk/utils/util/constants");
const FormData = require("form-data");
const { post } = require("superagent");
const { Mobile } = require("aws-sdk");
const fire = require("../services/fire");
const zoho = require("../lib/zoho");

class SDKInitializer {
  static async initialize(type, action = "fetch", data = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        const client_id = "1000.6RDP00PRT8606FO3IRVETNECZ4RKEK";
        const client_secret = "96c0139afe26bb7341597d7108eb0ad8e9212b636d";
        const grant_type = "authorization_code";
        const code =
          "1000.7713d0ebfdf098c52234ee14fb516062.c962ee4a682f019da99eb188ca96652c"; //"1000.a21c782434cc3cd99ed1110482ec3bf1.6387cec35478529fb57455e69d15b271"; // Optained from db(refresh token);
        const scope = "ZohoCRM.settings.fields.ALL,ZohoCRM.modules.ALL,ZohoCRM.coql.READ";
        const redirect_uri = "https://www.zohoapis.in/";

        const logger = Logger.getInstance(Levels.VERBOSE, "A:\\imp\\logger");
        const user = new UserSignature("aanubhav6488@gmail.com");
        const environment = INDataCenter.PRODUCTION();
        const sdkConfig = new SDKConfigBuilder()
          .setPickListValidation(false)
          .setAutoRefreshFields(true)
          .build();
        const resourcePath = "A:\\imp\\";

        let token = new OAuthToken(
          client_id,
          client_secret,
          code,
          TokenType.REFRESH,
          redirect_uri
        );
        let tokenstore = new DBStore("localhost", "ofex", "root", "", "3306");
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
          console.log(tokenResponse);
          let access_token = tokenAPIResponse?.access_token;
          let refresh_token = tokenAPIResponse?.refresh_token;
          if (access_token || refresh_token) {
            let q_insert_zoho_tokens = `insert into zoho_tokens (access_token, refresh_token) values ('${access_token}', '${refresh_token}')`;
            let response = await Database.insert(q_insert_zoho_tokens);
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
  }
}

function fetchData(type) {
  return new Promise(async (resolve, reject) => {
    try {
      let q_fetch_access_token = `select access_token, refresh_token from zoho_tokens order by id desc limit 1`;
      zoho_tokens = await fire.fetch(q_fetch_access_token);
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
        let leadsRecord = await axios(leadsRecordConfig);
        resolve(leadsRecord.data);
      } else {
        console.log("No Tokens");
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
      let q_fetch_access_token = `select access_token, refresh_token from zoho_tokens order by id desc limit 1`;
      zoho_tokens = await fire.fetch(q_fetch_access_token);
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
        console.log("No Tokens");
        resolve([]);
      }
    } catch (e) {
      console.log("post Data Error", e);
      resolve([]);
    }
  });
}

let self = (module.exports = {
  fetch: async function (type) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = await zoho.initialize(type);
        resolve({
          code: 200,
          data: data,
        });
      } catch (e) {
        console.log(e);
        resolve({
          code: 200,
          data: [],
        });
      }
    });
  },
  post: async function (type, mobile_number) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = await zoho.initialize(type, "create", {
          data: [
            {
              Mobile_Number: mobile_number,
              Name: mobile_number,
            },
          ],
          trigger: ["approval", "workflow", "blueprint"],
        });
        resolve({
          code: 200,
          data: data,
        });
      } catch (e) {
        console.log(e);
        resolve({
          code: 200,
          data: [],
        });
      }
    });
  },

  put: async function (
    type,
    mobile_number,
    is_sponcer,
    Name,
    Full_Name,
    Email_ID,
    Designation,
    Experience,
    Social_URL,
    Referral_Code1,
    Company_Name,
    Website_URL,
    Why_Reseller,
    rejected_at
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = await SDKInitializer.initialize(type, "update", {
          data: [
            { id: user?.user_id },
            {
              $set: {
                Name: Name,
                Full_Name: Full_Name,
                Email_ID: Email_ID,
                Designation: Designation,
                Experience: Experience,
                Social_URL: Social_URL,
                Referral_Code1: Referral_Code1,
                Company_Name: Company_Name,
                Website_URL: Website_URL,
                Why_Reseller: Why_Reseller,
                is_sponcer: is_sponcer,
              },
            },
          ],
          trigger: ["approval", "workflow", "blueprint"],
        });
        resolve({
          code: 200,
          data: data,
        });
      } catch (e) {
        console.log(e);
        resolve({
          code: 200,
          data: [],
        });
      }
    });
  },
  // app.post("/create", async (req, res) => {
  //   const data = req.body;

  //  let response= await User.add({
  //   "name":"zano",
  //   "age":22,
  //   "collage":"icc" });
  //   res.send({ msg: "User Added" });

  // });
});
