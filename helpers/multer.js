var multer = require("multer");
var homedir = require("os").homedir();

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => {
    callback(null, `${homedir}/Videos`);
  },
  filename: (_request, _file, callback) => {
    // console.log(_file)
    callback(null, _file.originalname);
  },
});
var upload = multer({ storage: storage }).single("videoFile");

module.exports = upload;
