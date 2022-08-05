const fs = require('fs');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

async function Db(filename) {
	var exists = fs.existsSync(filename);
	var db = await sqlite.open({ filename: filename, driver: sqlite3.Database });
	if (!exists)
		await db.run("CREATE TABLE message (talker TEXT, text TEXT, time DATETIME)");
	return db;
}

module.exports = Db;
