require("dotenv").config();

const mysql = require('mysql2');
const dbConnect = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '비밀번호(깃허브 업로드 떄문에 비공개 처리했습니다ㅜ!!)', 
    database: 'gachon_db',
    port: 3306
  });

dbConnect.connect();

module.exports = dbConnect; 
