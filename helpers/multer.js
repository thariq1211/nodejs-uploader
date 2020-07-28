var multer = require("multer");

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => {
    callback(null, "/var/spool/recording/");
  },
  filename: (_request, _file, callback) => {
    callback(null, _file.originalname);
  },
});
var upload = multer({ storage: storage }).single("videoFile");

module.exports = upload;
