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
const { all } = require("axios");
let self = (module.exports = {
  /////////might be use in future
  fetch: async function (type = Constant.collection.categories) {
    return new Promise(async (resolve, reject) => {
      try {
        const docRef = doc(fireDB, type, "dJ2egm9XJp3PbxipSPwN", category.id); //query(collection(fireDB, type));

        const docSnap = await getDoc(docRef);
        console.log("Document data:", docRef);
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          resolve({
            code: 200,
            data: docSnap.data(),
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
  /////////////////////////////////////////////fetch collection by params
  fetch_all: async function (type) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = [];
        const docRef = query(collection(fireDB, type));

        const querySnapshot = await getDocs(docRef);
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
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
  /////////////////////////////////////////////fetch category by name

  fetch_category_by_name: async function (name) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = [];
        const docRef = query(
          collection(fireDB, Constant.collection.categories),
          where("name", "==", name)
        );

        const querySnapshot = await getDocs(docRef);

        let category = querySnapshot.docs.map((o) => {
          return { id: o.id, data: o.data() };
        });

        if (category.length) {
          const subColRef = query(
            collection(
              fireDB,
              Constant.collection.categories,
              category[0].id,
              Constant.collection.program
            )
          );
          const qSnap = await getDocs(subColRef);

          let programs = qSnap.docs.map((o) => {
            return { id: o.id, data: o.data() };
          });

          resolve({
            code: 200,
            data: programs,
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

  /////////////////////////////////////////////fetching  all program with category (in program category is there)

  fetch_all_category_with_program: async function () {
    return new Promise(async (resolve, reject) => {
      try {
        let data = [];
        const docRef = query(
          collection(fireDB, Constant.collection.categories)
        );

        const querySnapshot = await getDocs(docRef);

        let categories = querySnapshot.docs;

        if (categories.length) {
          async.eachSeries(categories, async (cat, cb) => {
            const subColRef = query(
              collection(
                fireDB,
                Constant.collection.categories,
                cat.id,
                Constant.collection.program
              )
            );
            let rls = [];

            const qSnap = await getDocs(subColRef);

            const storage = getStorage();

            let v = qSnap.docs.map(async (o) => {
              return new Promise((resolve, reject) => {
                getDownloadURL(ref(storage, o.data().cover_image)).then(
                  (url) => {
                    resolve({
                      id: o.id,
                      ...o.data(),
                      cover_image: url,
                      category: {
                        id: cat.id,
                        ...cat.data(),
                      },
                    });
                  }
                );
              });
            });

            let result = await Promise.all(v);

            data = data.concat(result);

            if (categories.indexOf(cat) === categories.length - 1) {
              resolve({
                code: 200,
                result: data,
              });
            }

            cb;
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

  /////////////////////////////////////////////fetching all faq
  fetch_read_all_faq: async function () {
    return new Promise(async (resolve, reject) => {
      try {
        let data = [];

        const docRef = query(collection(fireDB, Constant.collection.faq));

        const querySnapshot = await getDocs(docRef);
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
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
  /////////////////////////////////////////////for cohort by id
  fetch_cohort: async function (category_id, program_id, cohort_id) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = {};
        const docRef = doc(
          fireDB,
          Constant.collection.categories,
          category_id,
          Constant.collection.program,
          program_id,
          Constant.collection.cohort,
          cohort_id
        );
        const docRef_program_name = doc(
          fireDB,
          Constant.collection.categories,
          category_id,
          Constant.collection.program,
          program_id
        );
        const docSnap = await getDoc(docRef);

        const docSnap_program_name = await getDoc(docRef_program_name);
        let url = "";
        if (docSnap_program_name.data().brochure) {
          const storage = getStorage();
          url = await getDownloadURL(
            ref(storage, docSnap_program_name.data().brochure)
          );
        }

        data = docSnap.data();
        data["program"] = { ...docSnap_program_name.data(), brochure_url: url };
        resolve({
          code: 200,
          data: data,
        });
      } catch (e) {
        console.log(e);
        reject({
          code: 503,
          data: "invalid data",
        });
      }
    });
  },
  /////////////////////////////////////////////for category only
  fetch_read_Category_only: async function () {
    return new Promise(async (resolve, reject) => {
      try {
        let data = [];
        const docRef = query(
          collection(fireDB, Constant.collection.categories)
        );

        const querySnapshot = await getDocs(docRef);
        querySnapshot.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
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

  /////////////////////////////////////////////fetching program by id
  fetch_program_by_id: async function (category, program) {
    return new Promise(async (resolve, reject) => {
      try {
        let catRef = doc(fireDB, Constant.collection.categories, category);

        let catDoc = await getDoc(catRef);
        let catData = {
          id: catDoc.id,
          ...catDoc.data(),
        };

        let pRef = doc(
          fireDB,
          Constant.collection.categories,
          category,
          Constant.collection.program,
          program
        );

        let pData = (await getDoc(pRef)).data();

        let cRef = collection(
          fireDB,
          Constant.collection.categories,
          category,
          Constant.collection.program,
          program,
          Constant.collection.cohort
        );

        let cSnaps = await getDocs(cRef);

        pData[Constant.collection.cohort] = cSnaps.docs.map((o) => {
          return { id: o.id, ...o.data() };
        });

        pData[Constant.collection.categories] = catData;
        pData["id"] = (await getDoc(pRef)).id;

        resolve({
          code: 200,
          data: pData,
        });
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  },
  /////////////////////////////////////////////read program by id(converting img path to url)
  fetch_program_with_all_data: async function (category, program) {
    return new Promise(async (resolve, reject) => {
      try {
        let programRef = doc(
          fireDB,
          Constant.collection.categories,
          category,
          Constant.collection.program,
          program
        );

        const storage = getStorage();
        let programSnap = await getDoc(programRef);
        /////////////////////////////////////////////converting image path to image url)
        let url = await getDownloadURL(
          ref(storage, programSnap.data().cover_image)
        );

        let brochure_url = ""

        if (programSnap.data().brochure) {
          brochure_url = await getDownloadURL(
            ref(storage, programSnap.data().brochure)
          );
        }

        let programData = {
          id: programSnap.id,
          ...programSnap.data(),
          cover_image: url,
          brochure_url: brochure_url,
        };

        let cohortRef = collection(
          fireDB,
          Constant.collection.categories,
          category,
          Constant.collection.program,
          program,
          Constant.collection.cohort
        );

        let cohortSnaps = await getDocs(cohortRef);

        let cohortData = [];

        let cohortCollection = cohortSnaps.docs;

        let result = [];
        let resultbe = [];

        console.log("Cohorts ---------", cohortCollection.length);
        if (cohortSnaps.docs.length) {
          async.eachSeries(cohortSnaps.docs, async (o, cb) => {
            cohortData.push({ id: o.id, ...o.data() });

            let instructorRef = collection(
              fireDB,
              Constant.collection.categories,
              category,
              Constant.collection.program,
              program,
              Constant.collection.instructors
            );

            let instructorSnap = await getDocs(instructorRef);

            const str = storage;

            let v = instructorSnap.docs.map(async (o, i) => {
              return new Promise((resolve, reject) => {
                console.log(
                  "Image -----------",
                  o.data().image,
                  i,
                  instructorSnap.docs.length
                );
                if (o.data().image != undefined) {
                  getDownloadURL(ref(str, o.data().image))
                    .then((url) => {
                      resolve({
                        id: o.id,
                        ...o.data(),
                        image: url,
                      });
                    })
                    .catch((e) => {
                      resolve({
                        id: o.id,
                        ...o.data(),
                        image: e,
                      });
                    });
                } else {
                  resolve({
                    id: o.id,
                    ...o.data(),
                  });
                }
              });
            });

            let instructorData = await Promise.all(v);

            result = instructorData;

            let cohortbeniRef = collection(
              fireDB,
              Constant.collection.categories,
              category,
              Constant.collection.program,
              program,
              Constant.collection.Program_benefits
            );
            let cohortbeniSnap = await getDocs(cohortbeniRef);
            let cohortbeniCollection = cohortbeniSnap.docs;

            let cohortDataa = cohortbeniSnap.docs.map((b) => {
              return {
                id: b.id,
                ...b.data(),
              };
            });

            resultbe = cohortDataa;

            if (o.id === cohortCollection[cohortCollection.length - 1].id) {
              resolve({
                code: 200,
                data: {
                  ...programData,
                  cohorts: cohortData,
                  instructor: result,
                  Program_benefits: resultbe,
                },
              });
            }

            cb;
          });
        } else {
          resolve({
            code: 200,
            data: { ...programData, cohorts: result },
          });
        }
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  },
  /////////////////////////////////////////////fetching all programs(for home page pagination and filter)

  fetch_all_program: async function (page, count, like, catid) {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log(count, page, like, count * (page - 1));
        let cRef;
        if (page == 1) {
          //////////////////////////////////////////////////////////////////////
          const bulk = query(
            collectionGroup(fireDB, Constant.collection.program),
            where("name", ">=", like),
            where("name", "<", like + "\uf8ff"),
            orderBy("name", "asc")
          );
          let arr = [];

          let bulkSnaps = await getDocs(bulk);

          let bData = [];
          let ca = [];

          bData = bulkSnaps.docs.map(async (o) => {
            const category_id = o.ref.path
              .replace(o.id, "")
              .replace("/programs/", "")
              .replace("Category/", "");

            ca.push(category_id);
          });
          cRef = query(
            collectionGroup(fireDB, Constant.collection.program),
            where("name", ">=", like),
            where("name", "<", like + "\uf8ff"),

            orderBy("name", "asc"),
            limit(count)
          );
        } else if (page > 1) {
          const first = query(
            collectionGroup(fireDB, Constant.collection.program),
            where("name", ">=", like),
            where("name", "<", like + "\uf8ff"),
            orderBy("name", "asc"),
            limit(count * (page - 1))
          );
          const documentSnapshots = await getDocs(first);
          const lastvisible =
            documentSnapshots.docs[documentSnapshots.docs.length - 1];
          cRef = query(
            collectionGroup(fireDB, Constant.collection.program),
            where("name", ">=", like),
            where("name", "<", like + "\uf8ff"),
            orderBy("name", "asc"),
            startAfter(lastvisible.data().name),
            limit(count)
          );
        }
        let arr = [];

        let programSnaps = await getDocs(cRef);

        let pData = [];

        pData = programSnaps.docs.map(async (o) => {
          const category_id = o.ref.path
            .replace(o.id, "")
            .replace("/programs/", "")
            .replace("Category/", "");

          const catsnaps = query(
            doc(fireDB, Constant.collection.categories, category_id)
          );

          let querySnapshot = await getDoc(catsnaps);

          const category = querySnapshot.data();
          return {
            id: o.id,
            ...o.data(),

            category_data: {
              category_id: category_id
                .replace(o.id, "")
                .replace("/programs/", "")
                .replace("Category/", ""),
              ...category,
            },
          };
        });

        let r = await Promise.all(pData);
        console.log(r);
        resolve({
          code: 200,
          data: r,
        });
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  },
  fetch_all_program_based_filter: async function (catid, page, count, like) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!catid) {
          let cRef;
          if (page == 1) {
            //////////////////////////////////////////////////////////////////////
            const bulk = query(
              collectionGroup(fireDB, Constant.collection.program),
              where("name", ">=", like),
              where("name", "<", like + "\uf8ff"),
              orderBy("name", "asc")
            );
            let arr = [];

            let bulkSnaps = await getDocs(bulk);

            let bData = [];
            let ca = [];

            bData = bulkSnaps.docs.map(async (o) => {
              const category_id = o.ref.path
                .replace(o.id, "")
                .replace("/programs/", "")
                .replace("Category/", "");

              // console.log("here console", category_id);
              ca.push(category_id);
            });
            console.log("ca_______________", ca);
            //////////////////////////////////////
            cRef = query(
              // console.log("cREf here____________________",ca),
              collectionGroup(fireDB, Constant.collection.program),
              // where("category_id","==",ca),
              where("name", ">=", like),
              where("name", "<", like + "\uf8ff"),

              orderBy("name", "asc"),
              limit(count)
            );
          } else if (page > 1) {
            const first = query(
              collectionGroup(fireDB, Constant.collection.program),
              where("name", ">=", like),
              where("name", "<", like + "\uf8ff"),
              orderBy("name", "asc"),
              limit(count * (page - 1))
            );
            const documentSnapshots = await getDocs(first);
            console.log(
              "__________snapshot_____here",
              documentSnapshots.docs.map(parent)
            );
            const lastvisible =
              documentSnapshots.docs[documentSnapshots.docs.length - 1];
            cRef = query(
              collectionGroup(fireDB, Constant.collection.program),
              where("name", ">=", like),
              where("name", "<", like + "\uf8ff"),
              orderBy("name", "asc"),
              startAfter(lastvisible.data().name),
              limit(count)
            );
          }
          let arr = [];

          let programSnaps = await getDocs(cRef);

          let pData = [];

          pData = programSnaps.docs.map(async (o) => {
            const category_id = o.ref.path
              .replace(o.id, "")
              .replace("/programs/", "")
              .replace("Category/", "");

            // console.log("here console", category_id);
            const catsnaps = query(
              doc(fireDB, Constant.collection.categories, category_id)
              // where(documentId(), "=", category_id)
            );

            let querySnapshot = await getDoc(catsnaps);

            const category = querySnapshot.data();
            return {
              id: o.id,
              ...o.data(),

              category_data: {
                category_id: category_id
                  .replace(o.id, "")
                  .replace("/programs/", "")
                  .replace("Category/", ""),
                ...category,
              },
            };
          });

          let r = await Promise.all(pData);
          console.log(r);
          resolve({
            code: 200,
            data: r,
          });
        } else {
          if (page == 1) {
            let data = [];
            console.log(typeof catid);
            async.eachSeries(catid, async (o, cb) => {
              let docRef = query(
                collection(
                  fireDB,
                  Constant.collection.categories,
                  o,
                  Constant.collection.program
                ),
                where("name", ">=", like),
                where("name", "<", like + "\uf8ff"),
                orderBy("name", "asc")
              );
              console.log("_____ss______", o);
              const querySnapshot = await getDocs(docRef);
              let categories = querySnapshot.docs;
              const pd = querySnapshot.docs.map(async (o) => {
                return o.data();
              });
              let v = await all(pd);
              data.push(...v);
              console.log(data);
              console.log(catid.indexOf(o));
              if (catid.indexOf(o) === catid.length - 1) {
                resolve({
                  code: 200,
                  data: data,
                });
              } else {
                cb;
              }
            });
          }
        }
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  },
  /////////////////////////////////////////////fetch_all_(for test purpose)

  fetch_all_cohort_by_program: async function (category, program) {
    return new Promise(async (resolve, reject) => {
      try {
        let programRef = doc(
          fireDB,
          Constant.collection.categories,
          category,
          Constant.collection.program,
          program
        );
        let programSnap = await getDoc(programRef);
        let programData = { id: programSnap.id, ...programSnap.data() };

        let cohortRef = collection(
          fireDB,
          Constant.collection.categories,
          category,
          Constant.collection.program,
          program,
          Constant.collection.cohort
        );

        let cohortSnaps = await getDocs(cohortRef);

        let cohortData = [];

        let cohortCollection = cohortSnaps.docs;

        let result = [];

        console.log("Cohorts ---------", cohortCollection.length);
        if (cohortSnaps.docs.length) {
          async.eachSeries(cohortSnaps.docs, async (o, cb) => {
            cohortData.push({
              id: o.id,
              ...o.data(),
              brochure: programData.brochure,
            });

            if (o.id === cohortCollection[cohortCollection.length - 1].id) {
              resolve({
                code: 200,
                data: {
                  cohorts: cohortData,
                },
              });
            }

            cb;
          });
        } else {
          resolve({
            code: 200,
            data: { ...programData, cohorts: result },
          });
        }
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  },

  /////////////////////////////////////////////fetching organization
  fetch_all_organization: async function () {
    return new Promise(async (resolve, reject) => {
      try {
        let data = [];
        const docRef = query(
          collection(fireDB, Constant.collection.organization)
        );

        const querySnapshot = await getDocs(docRef);
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
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
  /////////////////////////////////////////////fetching  program by keyword
  fetch_program_by_KEYWORD: async function (key = "") {
    return new Promise(async (resolve, reject) => {
      try {
        let programRef = query(
          collectionGroup(fireDB, Constant.collection.program),
          where("name", ">=", key),
          where("name", "<", key + "\uf8ff")
        );

        let programSnaps = await getDocs(programRef);

        let pData = [];

        pData = programSnaps.docs.map((o) => {
          return { id: o.id, ...o.data() };
        });
        resolve({
          code: 200,
          data: pData,
        });
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  },
});
