/** @typedef { import("wechaty").Wechaty } Wechaty */
/** @typedef { import("wechaty").Message } Message */
/** @typedef { import("sqlite").Database } Database */
var SQL = require('sql-template-strings');
var Db = require('./Db');

module.exports = function WechatyChatHistoryPlugin() {
	return function (/** @type {Wechaty} */bot) {
		/** @type {{[key: string]: Database}} */
		var dbs = {};
		bot.on("message", async (/** @type {Message} */message) => {
			if (message.type() != bot.Message.Type.Text) return;
			var conversation = message.conversation();
			if (!dbs[conversation.id])
				dbs[conversation.id] = await Db(`./${conversation.id}.db`);
			var db = dbs[conversation.id];
			await db.run(SQL`INSERT INTO message VALUES (${conversation.id}, ${message.text()}, ${message.date()})`);
		});
	};
};
