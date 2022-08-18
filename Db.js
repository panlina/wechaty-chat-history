const fs = require('fs');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

async function Db(filename) {
	var exists = fs.existsSync(filename);
	var db = await sqlite.open({ filename: filename, driver: sqlite3.Database });
	if (!exists) {
		await db.run("CREATE TABLE message (talker TEXT, type INTEGER, text TEXT, time DATETIME)");
		await db.run("CREATE INDEX message_talker ON message (talker)");
		await db.run("CREATE INDEX message_type ON message (type)");
		await db.run("CREATE INDEX message_time ON message (time)");
	}
	return db;
}

module.exports = Db;
