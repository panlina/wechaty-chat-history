# wechaty-chat-history

A Wechaty plugin that saves chat history.

## Usage

```js
var { Wechaty } = require('wechaty');
var WechatyChatHistoryPlugin = require('wechaty-chat-history');
var bot = new Wechaty();
bot.use(WechatyChatHistoryPlugin({
	filter: [{ contact: { name: '小红' } }, { room: { topic: /^都是老师/ } }],
	dbDirectory: './chat-history'
}));
```
