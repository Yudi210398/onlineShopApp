// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;
// let _db;
// const mongoKonek = (cb) => {
//   MongoClient.connect(
//     "mongodb+srv://yudirunat:kawasanzombi1998@cluster0.oaqmd.mongodb.net/shopOnline?retryWrites=true&w=majority",
//     { useUnifiedTopology: true }
//   )
//     .then((result) => {
//       console.log("conek");
//       _db = result.db();
//       cb();
//     })
//     .catch((err) => {
//       console.log(err);
//       throw err;
//     });
// };

// const getdb = () => {
//   if (_db) return _db;
//   throw `data tidak ada`;
// };
// exports.mongoKonek = mongoKonek;
// exports.getdb = getdb;
