/** @typedef { import("wechaty").Wechaty } Wechaty */
/** @typedef { import("wechaty").Message } Message */

module.exports = function WechatyChatHistoryPlugin() {
	return function (/** @type {Wechaty} */bot) {
		bot.on("message", async (/** @type {Message} */message) => {
			// save message
		});
	};
};
