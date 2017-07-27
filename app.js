require('dotenv-extended').load();

const builder = require('botbuilder');
const restify = require('restify');

const addNote = require('./requests/requestAddNote');
const addExpense = require('./requests/requestAddExpense');
const getNotes = require('./queries/queryGetLatestNotes');
const getExpenses = require('./queries/queryGetLatestExpenses');
// const makeCard = require('./components/componentCard');
const makeCardWithButton = require('./components/componentCardWithBtn');
const {returnLastFiveNotes,
  returnLastFiveExpense} = require('./helpers/helpers');

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
    session.send('Hi, I can help you store and review your expenses and notes.');
    session.send('All you need to do is send me a message that includes the word "expense", "note" or a synonym. Give it a try...');
  }
);

const recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);

bot.dialog('options', [
  (session) => {
    session.send('Hi, I can help you store and review your expenses and notes.');
    session.send('All you need to do is send me a message that includes the word "expense", "note" or a synonym. Give it a try...');
  }
]).triggerAction({
  matches: 'Help'
});

bot.dialog('Add a note', [
  (session, args) => {
    session.dialogData.text = args.intent.entity || session.message.text;
    session.dialogData.tags = [];
    addNote(session.dialogData);
    const noteCompletion = makeCardWithButton(
      session,
      'note',
      'You can view/edit all your notes via the button below',
      'https://google.com'
    );
    const noteConfirmationMessage = new builder.Message(session);
    noteConfirmationMessage.addAttachment(noteCompletion);
    session.send(noteConfirmationMessage);
  }
]).triggerAction({
  matches: 'AddNote'
});

bot.dialog('View notes', [
  (session) => {
    getNotes()
      .then((notes) => {
        let cards = returnLastFiveNotes(notes);
        const reply = new builder.Message(session);
        reply.attachmentLayout(builder.AttachmentLayout.carousel);
        reply.attachments(cards);
        session.send(reply);
        session.endConversation();
      });
  }
]).triggerAction({
  matches: /^viewnotes$/i
});

bot.dialog('Add an expense', [
  (session, args, next) => {
    const description = builder.EntityRecognizer.findEntity(args.intent.entities, 'textInput');
    const amount = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.number');
    const chargeTo = builder.EntityRecognizer.findEntity(args.intent.entities, 'name');
    if (description) {
      session.dialogData.description = description.entity;
    } else {
      session.dialogData.description = session.message.text;
    }
    if (chargeTo) {
      session.dialogData.chargeTo = chargeTo.entity;
    } else {
      session.dialogData.chargeTo = '';
    }
    if (amount) {
      session.dialogData.amount = amount.entity;
      next({response: amount.entity});
    } else {
      builder.Prompts.number(session, 'How much was the item?');
    }
  },
  (session, results) => {
    session.dialogData.amount = results.response;
    addExpense({
        amount: results.response,
        description: session.dialogData.description,
        chargeTo: session.dialogData.chargeTo
    });
    const expenseCompletion = makeCardWithButton(
      session,
      'expense',
      'You can view/edit all your expenses via the button below',
      'https://google.com'
    );
    const noteConfirmationMessage = new builder.Message(session);
    noteConfirmationMessage.addAttachment(expenseCompletion);
    session.send(noteConfirmationMessage);
  }
]).triggerAction({
  matches: 'AddExpense'
});

bot.dialog('View expense', [
  (session) => {
    getExpenses()
      .then ((expense) => {
        let cards = returnLastFiveExpense(expense);
        const reply = new builder.Message(session);
        reply.attachmentLayout(builder.AttachmentLayout.carousel);
        reply.attachments(cards);
        session.send('Seems like a good time to review some of your most recent expenses');
        session.send(reply);
      });
    session.endConversation();
  }
]).triggerAction({
  matches: /^viewexpenses$/i
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
