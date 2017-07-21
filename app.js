require('dotenv-extended').load();

const builder = require('botbuilder');
const restify = require('restify');

// setup restify server

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log('%s listening to %s', server.name, server.url);
});

// create chat connector for communicating with the Bot Framework Service

const connector = new builder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// listen for messages from users
server.post('/api/messages', connector.listen());

const bot = new builder.UniversalBot(connector, (session) => {
  session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});

const recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);

bot.dialog('AddNote', () => {
  console.log('success');
  // console.log('args', args);
}).triggerAction({
  matches: 'AddNote'
});
