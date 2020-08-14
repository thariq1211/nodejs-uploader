var multer = require("multer");

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => {
    console.log({
      type: _file.mimetype,
      file: _file.filename,
      size: _file.size,
      path: _file.path
    })
    callback(null, "/var/spool/recording/");
  },
  filename: (_request, _file, callback) => {
    console.log({
      type: _file.mimetype,
      file: _file.filename,
      size: _file.size,
      path: _file.path
    })
    callback(null, _file.originalname);
  },
});
var upload = multer({ storage: storage }).single("videoFile");

module.exports = upload;
