const env = require("./env");
const path = require("path");
const session = require("express-session");
const express = require("express");
const http = require("http");
const cors = require("cors");
const fs = require("fs");
const RateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const axios = require("axios");

const limiter = new RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  delayMs: 0
});

const app = express();
const server = http.createServer(app);

const router = express.Router();

const FigmaClient = require("./figmaClient");

app.enable("trust proxy");
app.use(limiter);

app.use(bodyParser.json());
app.use(express.static("dist"));
app.use("/api", router);

router.get("/files/:key", async (req, res) => {
  const project = await FigmaClient.getDocument(
    req.params.key,
    req.headers["access_token"]
  );
  const images = await FigmaClient.getDocumentImages(
    req.params.key,
    req.headers["access_token"]
  );

  res.send({ project, images });
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../dist/index.html"));
});

app.use((req, res, next) => {
  res.status(404).send({
    message: "Not found"
  });
});

server.listen(process.env.SERVER_PORT, () => {
  console.log(`Listening on ${process.env.SERVER_PORT}`);
});
