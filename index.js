require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const path = require("path");
const environment = process.env.NODE_ENV;
const stage = require("./config")[environment];
const morgan = require("morgan");
const compression = require("compression");

app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

// Constant Page Path
app.use(express.static(__dirname + stage.client));
const html = stage.client;

app.use(compression());

const allowedExt = [
  ".js",
  ".ico",
  ".css",
  ".png",
  ".jpg",
  ".gif",
  ".jpeg",
  ".woff2",
  ".woff",
  ".ttf",
  ".svg",
  ".pdf",
];

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Cross Origin Protection
app.use(cors());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST", "GET");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Accept"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

if (app.get("env") == "production" || app.get("env") == "development") {
  app.use(morgan("dev"));
}

const v1 = require("./api_versions/v1");

// Version 1 of Code
app.use("/v1", v1);

// Server Definition
const server = app.listen(`${stage.port}`, () => {
  console.log(`Server now listening at localhost:${stage.port}`);
});

server.timeout = 1000000;

// For viewing static content inside image folder.
app.get("/images/*", function (req, res, next) {
  if (allowedExt.filter((ext) => req.url.indexOf(ext) > 0).length > 0) {
    res.sendFile(path.resolve(`./${req.url}`));
  } else {
    res.sendFile(path.resolve(`./images/default.png`));
  }
});

// For viewing static pages - mainly frontend
app.get("*", function (req, res, next) {
  if (allowedExt.filter((ext) => req.url.indexOf(ext) > 0).length > 0) {
    res.sendFile(path.resolve(stage.client + `/${req.url}`));
  } else {
    res.sendFile("index.html", {
      root: html,
    });
  }
});

// Socket Connection
const io = require("socket.io").listen(server);
global.io = io;
require("./services/socket")(io);

module.exports = app;
