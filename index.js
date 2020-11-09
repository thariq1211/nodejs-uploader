var express = require("express");
var env = require("dotenv");
var app = express();
var helmet = require("helmet");
var cors = require("cors");
var fs = require("fs");
var { exec } = require("child_process");
var https = require("https");
var http = require("http");
var PORT = process.env.PORT;
var SPORT = process.env.SPORT;
var logger = require("morgan");

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
  try {
    upload(req, res, (err) => {
      if (err) {
        return res.send({ code: 0, message: "error upload" });
      }
      exec(`mv ${req.file.path} ${req.file.destination}/${year}/${month}`);
      return res.send({ code: 1, message: "success" });
    });
    // exec(`mv `)
  } catch (error) {
    return res.send({ code: 0, message: "error" });
  }
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
