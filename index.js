var express = require("express");
var app = express();
var helmet = require("helmet");
var cors = require("cors");
var fs = require("fs");
var { exec } = require("child_process");
var multer = require("multer");
var https = require("https");
var http = require("http");
var PORT = 5000;
var SPORT = 5443;
var logger = require("morgan");

/**
 * Middleware
 */
app.use(logger("common"));
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
const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, "/var/spool/recording/");
  },
  filename: (request, file, callback) => {
    callback(null, file.originalname);
  },
});
var upload = multer({ storage: storage }).single("videoFile");

/**
 * Endpoints
 */
app.get("/", async (req, res) => {
  res.sendStatus(202);
});

app.post(
  "/system/upload/agent/:agent/nik/:nik/date/:date/time/:time/dstHost/:host/dstServ/:server",
  async (req, res) => {
    const month = monthArr[new Date().getMonth()];
    const year = new Date().getFullYear();
    const { agent, nik, date, time, host, server } = req.params;
    if (!agent && !nik && !date && !time) {
      res.status(500).json({ code: 0, status: "Error Occured" });
      return;
    }
    upload(req, res, (err) => {
      if (err) {
        console.error("error occured");
        res.status(500).json({ code: 0, status: "Error Occured" });
        return;
      }
      console.log("Video Uploaded");
      exec(
        `bash doCombine IN-AGENT${agent}-NIK:${nik}-Date:${date}-Time:${time} IN-AGENT*-NIK:${nik}-Date:${date}-Time:${time} IN-AGENT${agent}-NIK:${nik}-Date:${date}-Time:${time} ${host}@${server} ${year}/${month}/`,
        (error, stderr, stdout) => {
          console.log("try to combine video and audio");
          if (error) {
            console.log(error);
            res.json({
              status: 0,
              message: "Successful Upload, but combine error!!",
              output: error,
            });
            return;
          }
          if (stderr) {
            res.json({
              status: 1,
              message: "Successful Upload, combine with output message!!",
              output: stderr,
            });
            return;
          }
          res.json({
            status: 1,
            message: "Successful Upload, combine success!!",
            output: stdout,
          });
          return;
        }
      );
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

http.createServer(app).listen(PORT, () => {
  console.log(`server up on ${PORT}`);
});
