var multer = require("multer");

// console.log(process.env.PATHVIDEO);
// /data/webrtc/videocall
const storage = multer.diskStorage({
  destination: (_request, _file, callback) => {
    callback(null, process.env.PATHVIDEO);
  },
  filename: (_request, _file, callback) => {
    // console.log(_file)
    callback(null, _file.originalname);
  },
});
var upload = multer({ storage: storage }).single("videoFile");

module.exports = upload;
