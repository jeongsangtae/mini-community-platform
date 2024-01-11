const expressSession = require("express-session");
const mongoDbStore = require("connect-mongodb-session");
const dotenv = require("dotenv");

dotenv.config();

const secretKey = process.env.SECRET_KEY;

let mongodbUrl = "mongodb://127.0.0.1:27017";

if (process.env.MONGODB_URL) {
  mongodbUrl = process.env.MONGODB_URL;
}

const createSessionStore = () => {
  const MongoDBStore = mongoDbStore(expressSession);

  const sessionStore = new MongoDBStore({
    uri: mongodbUrl,
    databaseName: "mini-community-platform",
    collection: "sessions",
  });
  return sessionStore;
};

const createSessionConfig = () => {
  return {
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
  };
};

module.exports = createSessionConfig;
