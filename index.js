/** @typedef { import("wechaty").Wechaty } Wechaty */
/** @typedef { import("wechaty").Message } Message */
/** @typedef { import("wechaty").Sayable } Sayable */
/** @typedef { import("wechaty-puppet").ContactQueryFilter } ContactQueryFilter */
/** @typedef { import("wechaty-puppet").RoomQueryFilter } RoomQueryFilter */
/** @typedef {{ contact: ContactQueryFilter } | { room: RoomQueryFilter }} SayableQueryFilter */
/** @typedef { import("sqlite").Database } Database */
var SQL = require('sql-template-strings');
var Db = require('./Db');

/**
 * @param {Object} config
 * @param {SayableQueryFilter[]} [config.filter] the filter of contacts and rooms to enable this plugin
 */
module.exports = function WechatyChatHistoryPlugin(config) {
	return function (/** @type {Wechaty} */bot) {
		/** @type {{[key: string]: Database}} */
		var dbs = {};
		bot.on("message", async (/** @type {Message} */message) => {
			if (config.filter && !await (
				async conversation => (
					await Promise.all(
						config.filter.map(
							filter => sayableQueryFilterFactory(filter)(conversation)
						)
					)
				).some(Boolean)
			)(
				message.talker().self() ?
					message.room() || message.to() :
					message.conversation()
			))
				return;
			if (message.type() != bot.Message.Type.Text) return;
			var conversation =
				message.talker().self() ?
					message.room() || message.to() :
					message.conversation();
			if (!dbs[conversation.id])
				dbs[conversation.id] = await Db(`./${conversation.id}.db`);
			var db = dbs[conversation.id];
			await db.run(SQL`INSERT INTO message VALUES (${message.talker().id}, ${message.text()}, ${message.date()})`);
		});
		function sayableQueryFilterFactory(/** @type {SayableQueryFilter} */filter) {
			return async function (/** @type {Sayable} */sayable) {
				if (filter.contact)
					return bot.puppet.contactQueryFilterFactory(filter.contact)(
						await bot.puppet.contactPayload(sayable.id)
					);
				if (filter.room)
					return bot.puppet.roomQueryFilterFactory(filter.room)(
						await bot.puppet.roomPayload(sayable.id)
					);
				return false;
			};
		}
	};
};
