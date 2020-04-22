var express = require("express");
var app = express();
var helmet = require("helmet");
var cors = require("cors");
var fs = require("fs");
var multer = require("multer");
var https = require("https");
var http = require("http");
var PORT = 5000;
var SPORT = 5443;

/**
 * Middleware
 */
app.use(helmet());
app.use(cors());
app.use(express.json());
const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, "/var/spool/recording/");
  },
  filename: (request, file, callback) => {
    console.log(file);
    callback(null, file.originalname);
  },
});
var upload = multer({ storage: storage }).single("videoFile");

/**
 * Endpoints
 */
app.get("/", async (req, res) => {
  res.status(200).send("Hello");
});

app.post("/system/upload", async (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("error occured");
      res.status(500).json({ code: 0, status: "Error Occured" });
      return;
    }
    console.log(req.file);
    console.log("Video Uploaded");
    res.status(200).json({ code: 1, status: "Video Uploaded" });
  });
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
//   .listen(SPORT);

http.createServer(app).listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
