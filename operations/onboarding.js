const Constants = require("../lib/constants");
const Database = require("../services/database");
const fire = require("../services/fire");
const environment = process.env.NODE_ENV;
const jwt = require("jsonwebtoken");
const { randomUUID: random_unique_id_generator } = require("crypto");
const Response = require("../services/response");
const stage = require("../config")[environment];
const secret = stage.JWT_SECRET;
//we have to import fire base for read and write
const moment = require("moment");
const {
  collection,
  doc,
  setDoc,
  addDoc,
  query,
  getDocs,
  getDoc,
  deleteDoc,
  where,
} = require("firebase/firestore");
const fireDB = require("../connections/firebase");

let self = (module.exports = {
  //////////////////////////////////for sending otp

  send_otp: (contact_number) => {
    return new Promise(async (resolve, reject) => {
      try {
        let otp = Math.floor(100000 + Math.random() * 900000);

        let response = await Database.send_otp(contact_number, otp, "VEELOR");

        let session_id = response.session_id;

        // let insert_session_id_to_db = `INSERT INTO one_time_password (session_id, otp, contact_number) VALUES ('${session_id}', '${otp}', '${contact_number}')`;

        // let response_db = await Database.insert(insert_session_id_to_db);

        let response_db = await fire.otp_insert(
          contact_number,
          otp,
          session_id
        );

        resolve({
          ...Response.success,
          session_id: session_id,
          message: "SIGNUP",
        });
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  },

  /////////////////////////////////for verifying otp(not neede bec it use sql)

  verify_otp_sql: (session_id, otp) => {
    return new Promise(async (resolve, reject) => {
      try {
        let check_exists = `SELECT * FROM one_time_password where session_id='${session_id}'`;

        try {
          let exist = await Database.is_exist(check_exists);

          if (exist === 1) {
            let data = await Database.fetch_object(check_exists);

            let actual_otp = data[0].otp;

            let contact_number = data[0].contact_number;

            if (parseInt(actual_otp) === parseInt(otp)) {
              let user_type = "reseller";

              let query_to_fetch =
                `select * from ` +
                Constants.TABLES.USER_MAPPING +
                ` where mobile_number = '${contact_number}' and type = '${user_type}'`;

              let reseller = await Database.fetch_object(query_to_fetch);

              if (reseller.length) {
                let user = reseller?.[0];

                let user_id = user?.user_id;

                let data = await zoho.initialize(
                  "Reseller/" + user_id,
                  "fetch",
                  {}
                );

                if (data.length) {
                  const payload = {
                    id: data[0]?.id,
                    mobile_number: data[0]?.Name,
                    role: "reseller",
                  };
                  const options = {};
                  const token = jwt.sign(payload, secret, options);

                  resolve({
                    code: 200,
                    token: token,
                    data: data,
                  });
                } else {
                  resolve({ ...data, code: 400 });
                }
              } else {
                let response = await zoho.initialize("Reseller", "create", {
                  data: [
                    {
                      Mobile_Number: contact_number,
                      Name: contact_number,
                    },
                  ],
                  trigger: ["approval", "workflow", "blueprint"],
                });

                if (response.length && response[0].code === "SUCCESS") {
                  let user_id = response[0].details?.id;

                  let query_insert = await addDoc(
                    collection(fireDB, Constants.collection.USER_MAPPING),
                    {
                      mobile_numbe: mobile_numbe,
                      type: type,
                      user_id: user_id,
                    }
                  );
                  // `insert into ` +
                  // Constants.TABLES.USER_MAPPING +
                  // ` (mobile_number, user_id, type) values ('${contact_number}', '${user_id}', 'reseller')`;

                  let res = await Database.addDoc(query_insert);

                  let reseller = await zoho.initialize(
                    "Reseller/" + user_id,
                    "fetch",
                    {}
                  );

                  const payload = {
                    id: reseller[0]?.id,
                    mobile_number: reseller[0]?.Name,
                    role: "reseller",
                  };
                  const options = {};
                  const token = jwt.sign(payload, secret, options);

                  resolve({
                    code: 200,
                    token: token,
                    data: reseller,
                  });
                } else {
                  resolve({ ...response, code: 400 });
                }
              }
            } else {
              resolve({
                code: 210,
                message: "Invalid OTP",
              });
            }
          } else {
            resolve({
              code: 404,
              message: "Invalid Session Id",
            });
          }
        } catch (e) {
          console.log(e);
          reject(e);
        }
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  },

  /////////////////////////////verify otp in fire

  verify_otp: (session_id, _otp) => {
    return new Promise(async (resolve, reject) => {
      try {
        let otpRef = query(
          collection(fireDB, Constants.collection.OTP),
          where("session_id", "==", session_id)
        );

        let otpSnap = await getDocs(otpRef);

        let exist = otpSnap.docs.length > 0;

        if (exist) {
          let otpData = otpSnap.docs[0].data();

          let { contact_number, otp } = otpData;

          if (otp == _otp) {
            let userRef = query(
              collection(fireDB, Constants.collection.USER_MAPPING),
              where("mobile_number", "==", contact_number)
            );

            let userSnap = await getDocs(userRef);

            if (userSnap.docs.length) {
              let user = userSnap.docs?.[0].data();

              let { user_id } = user;

              let data = await zoho.initialize(
                "Reseller/" + user_id,
                "fetch",
                {}
              );

              // console.log("Reseller --------------------", data);

              if (data.length) {
                const payload = {
                  id: data[0]?.id,
                  mobile_number: data[0]?.Name,
                  role: "reseller",
                };
                const options = {};
                const token = jwt.sign(payload, secret, options);

                resolve({
                  code: 200,
                  token: token,
                  data: data,
                });
              } else {
                resolve({ ...data, code: 400 });
              }
            } else {
              let response = await zoho.initialize("Reseller", "create", {
                data: [
                  {
                    Mobile_Number: contact_number,
                    Name: contact_number,
                  },
                ],
                trigger: ["approval", "workflow", "blueprint"],
              });

              if (response.length && response[0].code === "SUCCESS") {
                let user_id = response[0].details?.id;

                let res = await addDoc(
                  collection(fireDB, Constants.collection.USER_MAPPING),
                  {
                    "mobile_numbe": contact_number,
                    "type": "reseller",
                    "user_id": user_id,
                  }
                );
                // `insert into ` +
                // Constants.TABLES.USER_MAPPING +
                // ` (mobile_number, user_id, type) values ('${contact_number}', '${user_id}', 'reseller')`;

                // let res = await Database.addDoc(query_insert);

                let reseller = await zoho.initialize(
                  "Reseller/" + user_id,
                  "fetch",
                  {}
                );

                const payload = {
                  id: reseller[0]?.id,
                  mobile_number: reseller[0]?.Name,
                  role: "reseller",
                };
                const options = {};
                const token = jwt.sign(payload, secret, options);

                resolve({
                  code: 200,
                  token: token,
                  data: reseller,
                });
              } else {
                resolve({ ...response, code: 400 });
              }
            }
          } else {
            resolve({
              code: 210,
              message: "Invalid OTP",
            });
          }
        } else {
          resolve({
            code: 404,
            message: "Invalid Session Id",
          });
        }
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  },

  ////////////////////////////////////fetching reseller

  fetch: function () {
    return new Promise(async (resolve, reject) => {
      try {
        let reseller = await zoho.initialize(
          "Reseller/452554000000309031",
          "fetch",
          {}
        );

        resolve({
          code: 200,
          data: reseller,
        });
      } catch (e) {
        reject(e);
      }
    });
  },

  /////////////////////fetch reseller by id

  fetch_by_id: function (id) {
    return new Promise(async (resolve, reject) => {
      try {
        let reseller = await zoho.initialize("Reseller/" + id, "fetch", {});

        if (reseller[0].Status === "Rejected") {
          const startTime = reseller[0].Rejected_at;
          const endTime = moment(new Date());
          const duration = endTime.diff(startTime, "months");
          reseller[0]["duration"] = duration;
        } else {
          reseller[0]["duration"] = 0;
        }

        resolve({
          code: 200,
          data: reseller,
        });
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  },
  /////////////////////////////////////////updating for signup page for zoho
  update: function (
    id,
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
    Company_Industry,
    Type,
    Company_size,
    referral_verified,
    is_sponcer
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await zoho.initialize("Reseller/" + id, "update", {
          data: [
            {
              id: id,
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
              Exist: "True",
              Status: referral_verified ? "Approved" : "Pending",
              Company_Industry: Company_Industry,
              Type: Type,
              Company_size: Company_size,
              Sponsor_Bool: is_sponcer ? "True" : "False",
            },
          ],
        });
        if (
          response?.data &&
          response.data.length &&
          response.data[0].code === "SUCCESS"
        ) {
          resolve(Response.success);
        } else {
          resolve({ ...response, code: 400 });
        }
      } catch (e) {
        reject(e);
      }
    });
  },
  //////////////////////////////////////updating status , rejected at,name
  update_status: function (id, Name) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await zoho.initialize("Reseller/" + id, "update", {
          data: [
            {
              Name: Name,
              Status: "Pending",
              Rejected_at: "",
            },
          ],
        });
        console.log("status", JSON.stringify(response));
        if (
          response?.data &&
          response.data.length &&
          response.data[0].code === "SUCCESS"
        ) {
          resolve(Response.success);
        } else {
          resolve({ ...response, code: 400 });
        }
      } catch (e) {
        reject(e);
      }
    });
  },

  /////////////////////////////////////////////////////////////////////

  verify_referral: async function (mobile_number, referral) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = [];
        console.log(mobile_number);
        const docRef = query(
          collection(fireDB, "referral"),
          where("Phone_Number", "==", mobile_number)
        );

        const querySnapshot = await getDocs(docRef);
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });

        if (data.length) {
          let user = data?.[0];
          if (referral === user.Referral_code) {
            resolve({
              code: 200,
              message: "Verified",
            });
          } else {
            resolve({
              code: 210,
              message: "Invalid referral code",
            });
          }
        } else {
          console.log("No such document!");
          resolve(Response.does_not_exist);
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

  create_jwt_token: async (mobile_number) => {
    return new Promise(async (resolve, reject) => {
      try {
        let user_type = "reseller";

        let query_to_fetch =
          `select * from ` +
          Constants.TABLES.USER_MAPPING +
          ` where mobile_number = '${mobile_number}' and type = '${user_type}'`;

        let reseller = await Database.fetch_object(query_to_fetch);

        if (reseller.length) {
          let user = reseller?.[0];

          let user_id = user?.user_id;

          const payload = {
            id: user_id,
            mobile_number: mobile_number,
            role: "reseller",
          };
          console.log(payload);
          const options = {};
          const token = jwt.sign(payload, secret, options);

          resolve({
            code: 200,
            token: token,
          });
        }
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  },
});
