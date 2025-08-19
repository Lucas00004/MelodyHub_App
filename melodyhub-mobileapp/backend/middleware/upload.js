const multer = require('multer');

const storage = multer.memoryStorage(); // lưu file vào RAM buffer
const upload = multer({ storage });

module.exports = upload;
