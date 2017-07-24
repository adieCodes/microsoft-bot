require('dotenv-extended').load();

const builder = require('botbuilder');
const restify = require('restify');
const {addNote} = require('./requests/note');
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

const bot = new builder.UniversalBot(connector,
  (session) => {
    session.send('Hi there! I\'m your personal assistant and can help you save or query your billing items, expenses and notes');
    session.beginDialog('options');
    session.endConversation();
  }
);

bot.dialog('options', [
  (session) => {
    const card = new builder.ThumbnailCard(session);
    card.buttons([
      new builder.CardAction(session).title('Add a note').value('Add a note').type('imBack'),
      new builder.CardAction(session).title('Add an expense').value('Add an expense').type('imBack'),
      new builder.CardAction(session).title('Add a billing item').value('Add a billing item').type('imBack')
    ]).text('Press on one of the options below to start');

    const message = new builder.Message(session);
    message.addAttachment(card);

    const choices = ['Add a note', 'Add an expense', 'Add a billing item'];
    session.send('Hi, I can help you store and review your billing items, expenses and notes.');
    session.send('You can also access these features by typing a sentences that contains the keywords "billing", "expense" or "note".');
    session.send('Or cancel any action during the conversation by sending "cancel" as a message.');
    builder.Prompts.choice(session, message, choices);
  }
]).triggerAction({
  matches: /^help|options|option|show options|get started/i
});

bot.dialog('Add a note', [
  (session) => {
    builder.Prompts.text(session, 'What title would you like to give your note?');
  },
  (session, results) => {
    session.dialogData.title = results.response;
    builder.Prompts.text(session, 'What would you like to remember?');
  },
  (session, results) => {
    session.dialogData.text = results.response;
    session.dialogData.tags = [];
    addNote(session.dialogData);
    session.endConversation(`You've saved "${session.dialogData.title}" as a note`);
  }
]).triggerAction({
  matches: /^Add a note|note|Add note/i
}).cancelAction('cancelAction', 'Note deleted', {
  matches: /^cancel$/i,
  confirmPrompt: 'Are you sure? "Yes" will delete the note and "No" will continue where you were'
});

bot.dialog('Add an expense', [
  (session) => {
    builder.Prompts.text(session, 'What\'s the name of the item you\'d like to add?');
  },
  (session, results) => {
    session.dialogData.description = results.response;
    builder.Prompts.number(session, 'How much was the item?');
  },
  (session, results) => {
    session.dialogData.amount = results.response;
    builder.Prompts.text(session, 'Who would you like to charge this to?');
  },
  (session, results) => {
    session.dialogData.chargeTo = results.response;
    session.endConversation(`I've added ${session.dialogData.description}
                            with a value of £${session.dialogData.amount}
                            against ${session.dialogData.chargeTo}`);
  }
]).triggerAction({
  matches: /^Add an expense|expense|Add expense/i
}).cancelAction('cancelAction', 'Expense deleted', {
  matches: /^cancel$/i,
  confirmPrompt: 'Are you sure? "Yes" will delete the note and "No" will continue where you were'
});

bot.dialog('Add a billing item', [
  (session) => {
    builder.Prompts.text(session, 'What\'s the name of the client you\'d like to bill?');
  },
  (session, results) => {
    session.dialogData.client = results.response;
    builder.Prompts.number(session, 'How much do you need to charge the client?');
  },
  (session, results) => {
    session.dialogData.amount = results.response;
    builder.Prompts.time(session, 'When is the bill due?');
  },
  (session, results) => {
    session.dialogData.dueDate = results.response.resolution.start;
    session.endConversation(`I've added an item to ${session.dialogData.client}
                            with a value of £${session.dialogData.amount}
                            which is due ${session.dialogData.dueDate}`);
  }
]).triggerAction({
  matches: /^Add a billing item|billing|Add billing item/i
}).cancelAction('cancelAction', 'Billing item deleted', {
  matches: /^cancel$/i,
  confirmPrompt: 'Are you sure? "Yes" will delete the billing item and "No" will continue where you were'
});
