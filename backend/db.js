const mysql = require("mysql2");

// ✅ Use connection pool 
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Priti@_30",
    database: "fake_profile_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ✅ Test connection
db.getConnection((err, connection) => {
    if (err) {
        console.error("DB Connection Failed ❌", err);
    } else {
        console.log("MySQL Connected ✅");
        connection.release(); 
    }
});

module.exports = db;