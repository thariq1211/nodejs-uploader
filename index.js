var express = require("express");
var app = express();
var helmet = require("helmet");
var cors = require("cors");
var fs = require("fs");
var { exec } = require("child_process");
var cluster = require("cluster");
var https = require("https");
var http = require("http");
var PORT = 5000;
var SPORT = 5443;
var numCpus = require("os").cpus().length;
var logger = require("morgan");
var pool = require("./db");

const upload = require("./helpers/multer");
const forkingProcces = require("./helpers/forkFunction");
/**
 * Middleware
 */
// app.use(logger("common"));
app.use(helmet());
app.use(cors());
app.use(express.json());

const monthArr = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

/**
 * Endpoints
 */
app.get("/", async (req, res) => {
  res.sendStatus(202);
});

app.post("/inbound/getUniqueID", async (req, res) => {
  try {
    const { src, dst } = req.body;
    const getUniqueID = await pool.query(
      "SELECT id, caller_id, connected, datetime FROM public.callhistory WHERE caller_id=$1 AND connected=$2 ORDER BY datetime DESC limit 1",
      [src, dst]
    );
    if (getUniqueID.rows[0]) {
      res.json({
        code: 1,
        message: "success",
        content: {
          uniqueid: getUniqueID.rows[0].id,
          src: getUniqueID.rows[0].caller_id,
          dst: getUniqueID.rows[0].connected,
          start: getUniqueID.rows[0].datetime,
        },
      });
    } else {
      res.json({
        code: 0,
        message: "data not found",
      });
    }
  } catch (error) {
    res.send({
      code: 0,
      message: error.message,
    });
  }
});

app.post(
  "/system/upload/agent/:agent/nik/:nik/date/:date/time/:time/dstHost/:host/dstServ/:server/:uniqueId",
  async (req, res) => {
    forkingProcces(() => {
      const month = monthArr[new Date().getMonth()];
      const year = new Date().getFullYear();
      const { agent, nik, date, time, host, server, uniqueId } = req.params;
      if (!agent && !nik && !date && !time) {
        res.status(500).json({ status: 0, message: "Error occured" });
        return;
      }
      upload(req, res, (err) => {
        if (err) {
          console.error("error occured");
          res.status(500).json({ status: 0, message: "Error occured" });
          return;
        }
        console.log("video uploaded");
        // res.send({ code: 1, status: "Video Uploaded" });
        exec(
          `bash doCombine IN-AGENT${agent}-NIK${nik}-Date${date}-Time${time}-${uniqueId} IN-AGENT*-NIK${nik}-Date${date}-Time*-${uniqueId} IN-AGENT${agent}-NIK${nik}-Date${date}-Time${time}-${uniqueId} ${host}@${server} ${year}/${month}/`,
          (error, stderr, stdout) => {
            console.log("try to combine video and audio");
            if (error) {
              console.log(error);
              res.json({
                status: 0,
                message: "Successful upload, but combine error!!",
                output: error,
              });
              return;
            }
            if (stderr) {
              console.log(stderr);
              res.json({
                status: 1,
                message: "Successful upload, combine with output message!!",
                output: stderr,
              });
              return;
            }
            console.log(stdout);
            res.json({
              status: 1,
              message: "Successful upload, combine success!!",
              output: stdout,
            });
            return;
          }
        );
      });
    });
  }
);

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
//     console.log(`secure server up on ${SPORT}`)
//   });

if (cluster.isMaster) {
  for (let i = 0; i < numCpus; i += 1) {
    cluster.fork();
  }
  console.log(`server up with master pid [${process.pid}]`);
} else {
  // http.createServer(app).listen(PORT, () => {
  //   console.log(`server up with pid [${process.pid}]`);
  // });
  https
    .createServer(
      {
        /** FILE CONFIG CERT */
        key: fs.readFileSync("./cert/privkey.pem"),
        cert: fs.readFileSync("./cert/cert.pem"),
        passphrase: "PASSWORD CERT",
      },
      app
    )
    .listen(SPORT, () => {
      console.log(`server up with pid [${process.pid}]`);
    });
}
