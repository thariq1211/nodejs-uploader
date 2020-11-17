const multer = require("multer");

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => {
    callback(null, `${process.env.PATHVIDEO}`);
  },
  filename: (_request, _file, callback) => {
    callback(null, _file.originalname);
  },
});
const upload = multer({ storage: storage }).single("videoFile");

module.exports = upload;
