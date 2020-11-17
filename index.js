const express = require("express");
const env = require("dotenv");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const fs = require("fs");
const { exec } = require("child_process");
const https = require("https");
const http = require("http");
const PORT = process.env.PORT;
const SPORT = process.env.SPORT;
const logger = require("morgan");

const upload = require("./helpers/multer");
const forkingProcces = require("./helpers/forkFunction");
env.config();
/**
 * Middleware
 */
app.use(logger("common"));
app.use(helmet());
app.use(cors());
app.use(express.json());

/**
 * Endpoints
 */
app.get("/", async (req, res) => {
  res.sendStatus(202);
});

app.post("/upload/date/:year-:month", async (req, res) => {
  const { year, month } = req.params;
  forkingProcces(() => {
    try {
      upload(req, res, (err) => {
        if (err) {
          return res.send({ code: 0, message: "error upload" });
        }
        try {
          exec(`mv ${req.file.path} ${req.file.destination}/${year}/${month}`);
          return res.send({ code: 1, message: "success" });
        } catch (error) {
          return res.send({ code: 0, message: "file undefined" });
        }
      });
    } catch (error) {
      return res.send({ code: 0, message: "error" });
    }
  });
});

forkingProcces(() => {
  http.createServer(app).listen(PORT, () => {
    console.log(`[${process.pid}] Server up!`);
  });

  /**Uncomment code ini jika ingin ditambah ssl */
  /**
   * Tambahkan cert ssl jika diperlukan di root dir
   * dengan struktur
   * /cert
   * --privkey.pem
   * --cert.pem
   */

  // https
  //   .createServer(
  //     {
  //       key: fs.readFileSync("./cert/privkey.pem"),
  //       cert: fs.readFileSync("./cert/cert.pem"),
  //       passphrase: "PASSWORD CERT",
  //     },
  //     app
  //   )
  //   .listen(SPORT, () => {
  //     console.log(`[${process.pid}] Server up!`)
  //   });
});
