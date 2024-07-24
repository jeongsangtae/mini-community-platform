const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let mongodbUri = "mongodb://127.0.0.1:27017";

let database;

const connectToDatabase = async () => {
  const client = await MongoClient.connect(mongodbUri);
  database = client.db("mini-community-platform");
};

const getDb = () => {
  if (!database) {
    throw { message: "데이터베이스 연결이 설정되지 않았습니다" };
  }
  return database;
};

module.exports = {
  connectToDatabase,
  getDb,
};
