// process.exit();
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
//   const docRef = query(collection(fireDB, one_time_password));

//   const usersRef = ref.child('users');
// usersRef.set({
//   alanisawesome: {
//     date_of_birth: 'June 23, 1912',
//     full_name: 'Alan Turing'
//   },
//   gracehop: {
//     date_of_birth: 'December 9, 1906',
//     full_name: 'Grace Hopper'
//   }
// });

//   const querySnapshot = await getDocs(docRef);
let self = (module.exports = {
  otp_insert: async function (contact_number, otp, session_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = {
          session_id,
          otp,
          contact_number,
        };
        console.log(data);
        let result = await addDoc(
          collection(fireDB, "one_time_password"),
          data
        );

        resolve({
          message: "Record saved successfuly",
          code: 200,
          data: result.id,
        });
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  },
  zoho_token_insert: async function (access_token, refresh_token, inserted_at) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = {
          access_token,
          refresh_token,
        };
        console.log(data);
        let result = await addDoc(
          collection(fireDB, Constant.collection.zoho_tokens),
          data
        );

        resolve({
          message: "Record saved successfuly",
          code: 200,
          data: result.id,
        });
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  },
  fetch: async function () {
    return new Promise(async (resolve, reject) => {
      try {
        const docRef = query(
          collection(fireDB, Constant.collection.zoho_tokens),
          orderBy("inserted_at", "desc"),
          limit(1)
        ); //query(collection(fireDB, type));

        const docSnap = await getDocs(docRef);
        console.log(
          "docSnap token length_____________________________________________________",
          docSnap.docs.length
        );
        // console.log("Document data:", docRef);
        if (docSnap.docs.length) {
          console.log("________________________________________---out");
          resolve({
            code: 200,
            result: [{ id: docSnap.docs[0].id, ...docSnap.docs[0].data() }],
          });
        } else {
          console.log("No such document!");
          resolve({
            code: 200,
            // data: {},
          });
        }
      } catch (e) {
        console.log(e);
        resolve({
          code: 200,
          data: [],
        });
      }
    });
  },
  otp_sessionid: async function (session_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = {
          session_id,
        };
        console.log(data);
        let result = await addDoc(
          collection(fireDB, "one_time_password"),
          data
        );

        resolve({
          message: "Record saved successfuly",
          code: 200,
          data: result.id,
        });
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  },
  is_exist: async function (session_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = {
          session_id,
        };
        console.log("checkinggg", data.session_id);
        let result = query(
          collection(fireDB, "one_time_password"),
          where(session_id, "==", session_id)
        );
        // console.log("[[[[[[[[[[[[[[[[[[[[[[[[[[[[[asasssssssssssssssssssss]]]]]]]]]]]]]]]]]]]]]]]]]]]]]",session_id)
        if ((session_id = session_id)) {
          console.log(
            "/////////////////////////////////////////////////////////"
          );
          resolve({
            message: "otp verified",
            code: 200,
          });
        }
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  },
  fetch_object: async function () {
    return new Promise(async (resolve, reject) => {
      try {
        const docRef = query(
          collection(fireDB, Constant.collection.USER_MAPPING),
          orderBy("inserted_at", "desc"),
          limit(1)
        ); //query(collection(fireDB, type));

        const docSnap = await getDocs(docRef);
        console.log(
          "docSnap token length_____________________________________________________",
          docSnap.docs.length
        );
        // console.log("Document data:", docRef);
        if (docSnap.docs.length) {
          console.log("________________________________________---out");
          resolve({
            code: 200,
            result: [{ id: docSnap.docs[0].id, ...docSnap.docs[0].data() }],
          });
        } else {
          console.log("No such document!");
          resolve({
            code: 200,
            // data: {},
          });
        }
      } catch (e) {
        console.log(e);
        resolve({
          code: 200,
          data: [],
        });
      }
    });
  },
});
