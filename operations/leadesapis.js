const Response = require("../services/response");
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

const zoho = require("../lib/zoho");

const Database = require("../services/database");
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
  limitToLast,
  limit,
  startAfter,
  documentId,
  updateDoc,
  serverTimestamp,
} = require("firebase/firestore");
const { getStorage, ref, getDownloadURL } = require("firebase/storage");
const fireDB = require("../connections/firebase");

const async = require("async");
const Constant = require("../lib/constants");
const { firestore, database } = require("firebase-admin");
const Admin = require("mongodb/lib/admin");
const response = require("../services/response");
const _ = require("underscore");

let self = (module.exports = {
  creating_leads: async function (
    Name,
    Lead_Type,
    Lead_Email_ID,
    Lead_Designation,
    Lead_Mobile_Number,
    Organization_Name,
    Program_Name,
    Lead_Status1,
    Cohort_List,
    Package,
    Reseller_ID,
    Reseller_name
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = await zoho.initialize("Ofex_Leads", "create", {
          data: [
            {
              Name: Name,
              Lead_Type: Lead_Type,
              Lead_Email_ID: Lead_Email_ID,
              Lead_Designation: Lead_Designation,
              Lead_Mobile_Number: Lead_Mobile_Number,
              Organization_Name: Organization_Name,
              Program_Name: Program_Name,
              Lead_Status1: Lead_Status1,
              Cohort_List: Cohort_List,
              Package: Package,
              Reseller_ID: Reseller_ID,
              Reseller_name: Reseller_name,
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
        reject(e);
      }
    });
  },

  fetching_leads_by_id: async function (id) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = await zoho.initialize("Ofex_Leads/" + id, "fetch", {});
        resolve({
          code: 200,
          data: data,
        });
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  },

  fetch_all_leads_filter: async function (data) {
    return new Promise(async (resolve, reject) => {
      try {
        let bodyData = {
          select_query: `select Name,Lead_Type,Lead_Email_ID,Lead_Designation,Lead_Mobile_Number,Organization_Name,Program_Name,Lead_Status1,Cohort_List,Package,Reseller_ID,Reseller_name,Comments
          from OfEx_Leads `,
        };

        const query = await getquery(data, bodyData.select_query);

        bodyData.select_query = query;
        // console.log(query);
        let res = await zoho.initialize("coql", "filter", bodyData);

        // console.log(res);
        resolve({
          code: 200,
          data: res.data,
        });
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });

    async function getquery(data, new_query) {
      return new Promise((resolve, reject) => {
        try {
          let whereQuery = "";
          let q = "";
          let keys = Object.keys(data);

          let result = keys.map((o, i) => {
            let is_name = o === "Name";
            if (i == 0) {
              whereQuery = " where ";
              q = `(${o}='${is_name ? "like '%" + data[o] + "%'" : data[o]}')`;
            } else {
              if (is_name) {
                q = `(${q} and (${o} like "%${data[o]}%"))`;
              } else if (_.isArray(data[o])) {
                q = `(${q} and (${o} in (${data[o]
                  .map((t) => `'${t}'`)
                  .join()})))`;
              } else {
                q = `(${q} and (${o} = '${data[o]}')`;
              }
            }

            if (i === keys.length - 1) {
              new_query = new_query + whereQuery + q;
              resolve(new_query);
            }

            return q;
          });
        } catch (error) {
          reject(error);
          console.log(error);
        }
      });
    }
  },

  fetching_all_leads: async function (like) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = await zoho.initialize("Ofex_Leads", "fetch", {});
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

  fetch_lead_status: async function () {
    return new Promise(async (resolve, reject) => {
      try {
        // let docRef = query(collection(fireDB,Constant.collection.lead_status));

        let data = ["In-discussion", "Proposal Sent"];

        // const querySnapshot = await getDocs(docRef);

        // querySnapshot.forEach((doc) => {
        //   data.push(...doc.data().status);
        // });

        resolve({
          code: 200,
          data: data,
        });
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  },
  
});
