const express = require("express");
const router = express.Router();

const cron = require("node-cron");
const environment = process.env.NODE_ENV;
const stage = require("../config")[environment];
const Constants = require("../lib/constants");
const Database = require("../services/database");
const axios = require("axios");
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
  Timestamp,
} = require("firebase/firestore");
const { getStorage, ref, getDownloadURL } = require("firebase/storage");
const fireDB = require("../connections/firebase");
// const db = require("../connections/db");

const async = require("async");
const Constant = require("../lib/constants");
const { firestore } = require("firebase-admin");
const Admin = require("mongodb/lib/admin");
const e = require("express");

// Scheduled Reports
cron.schedule("0 30 12 * * *", () => {});

cron.schedule("0 */30 * * * *", async () => {
  try {
    let zohoRef = query(
      collection(fireDB, Constant.collection.zoho_tokens),
      orderBy("inserted_at", "desc"),
      limit(1),
    );

    let token_res = await getDocs(zohoRef);
    console.log("mid zohosnap(token_res)___________________________________________",token_res.docs.length)

    let token = token_res?.docs[0].data();

    console.log("here", token);

    let { refresh_token } = token;

    let grant_type = "refresh_token";

    let client_id = stage.client_id;

    let client_secret = stage.client_secret;

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
    console.log("__________________________________________________",response?.data?.access_token);

    let access_token = response?.data?.access_token;
    console.log("access token -----------------------", access_token);
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
  } catch (e) {
    console.log(
      "Cron error refresh token ------------------------------------"
    );
    console.log(e);
  }
});

module.exports = router;
