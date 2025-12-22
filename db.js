require('dotenv').config();

const config={
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options:{
        //通信を暗号化(TLS/SSL)
        encrypt: true,
        //サーバー証明書をチェックするか
        trustServerCertificate:false
    },
    pool:{
        //接続プールの数
        max:10,
        min:0,
        //解放までの時間(0.001秒単位)
        idleTimeoutMillis:30000
    }
};

module.exports = config;