const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'app_melody',
  connectionLimit: 5,
  supportBigNumbers: true,
  bigIntAsNumber: true,
  decimalAsNumber: true,
  maxAllowedPacket: 64 * 1024 * 1024 // 64MB, tùy bạn tăng lên 128 hay 256MB nếu cần
});

module.exports = pool;
