// const db = require("../connections/db");

// const { firestore } = require("firebase-admin/lib/firestore");

// const async = require("async");
// const Constant = require("../lib/constants");

// let self = (module.exports = {
//   fetch_program_test: async function (from, quantity, filters) {
//     return new Promise(async (resolve, reject) => {
//       try {
//         let { category, last = "", order_by } = filters;

//         let categorySnaps = await db
//           .collection(Constant.collection.categories)
//           .get();

//         const collectionRefs = categorySnaps.docs.map((o) =>
//            db.collection(
//             `${Constant.collection.categories}/${o.id}/${Constant.collection.program}`
//           )
//         );
        
//         collectionRefs[0].get()

//         const queries = collectionRefs.map((ref) => ref.orderBy(order_by));

//         // console.log(queries)
//         const combinedQuery = collectionRefs.reduce((acc, cur) => {
//             console.log("==============================cdsncd", acc)
//             console.log("==============================cknd", cur)
//             return acc.assign(cur)
//         });

//         console.log(combinedQuery)

//         let r = await combinedQuery.limit(quantity);

//         let programGC = (await getDocs(r)).docs.map((o) => {
//           return new Promise((resolve, reject) => {
//             getDownloadURL(ref(storage, o.data().cover_image)).then((url) => {
//               resolve({
//                 id: o.id,
//                 ...o.data(),
//                 cover_image: url,
//                 category: o.ref.parent.parent.id,
//               });
//             });
//           });
//         });

//         let result = await Promise.all(programGC);
//         console.log(
//           "/////////////////////////////////////////////////////////",
//           result
//         );

//         resolve({
//           code: 200,
//           data: result,
//         });
//       } catch (e) {
//         console.log(e);
//         reject(e);
//       }
//     });
//   },
// });
