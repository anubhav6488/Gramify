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

const async = require("async");
const Constant = require("../lib/constants");
const { firestore } = require("firebase-admin");
const Admin = require("mongodb/lib/admin");
let self = (module.exports = {
  create_sponsorship: async function (
    category_id,
    program_id,
    mobile_number,
    name,
    cohorts,
    status,
    is_active,
    created_at,
    // id,
    Reseller_name
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = {
          category_id: category_id,
          program_id: program_id,
          mobile_number: mobile_number + "",
          name: name,
          cohorts: cohorts,
          status: status,
          is_active: "active",
          created_at: serverTimestamp(),
          // reseller_id: id,
          Reseller_name: Reseller_name,
        };
        console.log(data);
        let result = await addDoc(
          collection(fireDB, Constant.collection.sponsorship),
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

  /////////////////////////////////////////////fetching sponsorship
  fetch_all_sponsorship: async function () {
    return new Promise(async (resolve, reject) => {
      try {
        let data = [];
        const docRef = query(
          collection(fireDB, Constant.collection.sponsorship)
        );

        const querySnapshot = await getDocs(docRef);
        querySnapshot.forEach((doc) => {
          const newData = { ...doc.data(), id: doc.id };
          delete newData?.["cohorts"];
          data.push(newData);
        });

        if (data.length) {
          resolve({
            code: 200,
            data: data,
          });
        } else {
          console.log("No such document!");
          resolve({
            code: 200,
            data: {},
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
  /////////////////////////////////////////////updating sponsorship
  update_sponsorship: async function (sponsorship_id, cohorts) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("?????????????//");
        const docRef = doc(
          fireDB,
          Constant.collection.sponsorship,
          sponsorship_id
        );
        const data = {
          cohorts: cohorts,
        };
        updateDoc(docRef, data).then(console.log("error"));

        resolve({ message: "Record saved successfuly", code: 200 });
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  },
  /////////////////////////////////////////////fetching sponsorship by id
  fetch_selected_sponsorship: async function (sponsorship) {
    return new Promise(async (resolve, reject) => {
      try {
        const docRef = doc(
          fireDB,
          Constant.collection.sponsorship,
          sponsorship
        );
        const querySnapshot = await getDoc(docRef);

        let data = querySnapshot.data();
        // console.log(data.program_id)
        const catRef = doc(
          fireDB,
          Constant.collection.categories,
          data.category_id
        );
        const catsnaps = await getDoc(catRef);
        let categoryData = catsnaps.data();
        // console.log(data1);
        const programRef = doc(
          fireDB,
          Constant.collection.categories,
          data.category_id,
          Constant.collection.program,
          data.program_id
        );
        const programSnap = await getDoc(programRef);
        let programData = programSnap.data();

        let cohortsData = [];
        async.eachSeries(data.cohorts, async (o, cb) => {
          let t = doc(
            fireDB,
            Constant.collection.categories,
            data.category_id,
            Constant.collection.program,
            data.program_id,
            Constant.collection.cohort,
            o
          );

          let s = await getDoc(t);
          cohortsData.push({ ...s.data(), id: o });
          if (data.cohorts.indexOf(o) === data.cohorts.length - 1) {
            resolve({
              code: 200,
              data: {
                ...data,
                program: programData,
                category: categoryData,
                cohort: cohortsData,
              },
            });
          } else {
            cb;
          }
        });
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  },
  //////////////////////////////////////////////////////////////////////fetching sponsorship by status(active/inactive)
  fetch_sponsorship_by_status: async function (status, mobile_number) {
    return new Promise(async (resolve, reject) => {
      try {
        const docRefs = query(
          collection(fireDB, Constant.collection.sponsorship),
          where("is_active", "==", status),
          where("mobile_number", "==", mobile_number),
          where("status", "==", "")
        );
        ``;
        const docSnapshots = await getDocs(docRefs);
        let sponserCollection = docSnapshots.docs;
        const sponsorshipData = [];
        if (sponserCollection.length > 0) {
          async.eachSeries(sponserCollection, async (o, cb) => {
            // console.log(o.data())
            let cohorts = await getCohorts(o.data());

            sponsorshipData.push({ ...o.data(), id: o.id, cohorts: cohorts });

            if (o.id === sponserCollection[sponserCollection.length - 1].id) {
              const uniquePrograms = await uniqueFromArray(
                sponsorshipData,
                "program_id"
              );
              const programDetails = await getProgramDetails(uniquePrograms);

              let result = await mapSponsorWithProgram(
                sponsorshipData,
                programDetails
              );

              resolve({
                code: 200,
                data: { result, program_collection: programDetails },
              });
            }
            cb;
          });
        } else {
          resolve({
            code: 200,
            data: sponsorshipData,
          });
        }
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });

    async function uniqueFromArray(array, key) {
      return new Promise((resolve, reject) => {
        let resArr = [];
        array.filter(function (o) {
          let i = resArr.findIndex((x) => x[key] == o[key]);
          if (i <= -1) {
            resArr.push(o);
          }
          resolve(resArr);
        });
      });
    }

    async function getProgramDetails(array) {
      return new Promise(async (resolve, reject) => {
        let data = [];
        async.eachSeries(array, async (o, cb) => {
          let a = doc(
            fireDB,
            Constant.collection.categories,
            o.category_id,
            Constant.collection.program,
            o.program_id
          );
          const programSnap = await getDoc(a);

          data.push({
            id: programSnap.id,
            ...programSnap.data(),
          });
          if (array.indexOf(o) == array.length - 1) {
            resolve(data);
          } else {
            cb;
          }
        });
      });
    }

    async function getCohorts(sponsorship) {
      return new Promise((resolve, reject) => {
        try {
          let { cohorts, program_id, category_id } = sponsorship;
          let cohortsData = [];
          if (cohorts.length) {
            async.eachSeries(cohorts, async (o, cb) => {
              let cRef = doc(
                fireDB,
                Constant.collection.categories,
                category_id,
                Constant.collection.program,
                program_id,
                Constant.collection.cohort,
                o
              );
              let cSnap = await getDoc(cRef);

              cohortsData.push({ id: cSnap.id, ...cSnap.data() });

              if (cohorts.indexOf(o) === cohorts.length - 1) {
                resolve(cohortsData);
              } else {
                cb;
              }
            });
          } else {
            resolve(cohortsData);
          }
        } catch (e) {
          console.log(e);
          reject(e);
        }
      });
    }

    async function mapSponsorWithProgram(sponsors, programs) {
      return new Promise((resolve, reject) => {
        try {
          async.eachSeries(sponsors, async (s, cb) => {
            let p = programs.find((t) => s.program_id == t.id);

            s["program"] = p;

            if (s.id === sponsors[sponsors.length - 1].id) {
              resolve(sponsors);
            }

            cb;
          });
        } catch (e) {
          console.log(e);
          reject(e);
        }
      });
    }
  },
  // /////////////////////////////////////////////updating is_active(active/in_active)
  update_is_active: async function (sponsorship_id, is_active) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("?????????????//");
        const docRef = doc(
          fireDB,
          Constant.collection.sponsorship,
          sponsorship_id
        );
        const data = {
          is_active: is_active,
        };
        updateDoc(docRef, data).then();
        resolve({ message: "Record saved successfuly", code: 200 });
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  },
  /////////////////////////////////////////////updating status(deleted/not deleted)
  update_status: async function (sponsorship_id, status) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("?????????????//");
        const docRef = doc(
          fireDB,
          Constant.collection.sponsorship,
          sponsorship_id
        );
        const data = {
          status: status,
        };
        updateDoc(docRef, data).then(console.log("error"));
        resolve({ message: "Record saved successfuly", code: 200 });
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  },
});
