require('dotenv-extended').load();

const builder = require('botbuilder');
const restify = require('restify');

const addNote = require('./requests/requestAddNote');
const addExpense = require('./requests/requestAddExpense');
const getNotes = require('./queries/queryGetLatestNotes');
const makeCard = require('./components/componentCard');
const makeCardWithButton = require('./components/componentCardWithBtn');
const returnLastFive = require('./helpers/helpers');

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

const recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);

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
  (session, args) => {
    session.dialogData.text = args.intent.entity || session.message.text;
    session.dialogData.tags = [];
    addNote(session.dialogData);
    const noteCompletion = makeCardWithButton(
      session,
      'Added note',
      'You can view/edit all your notes via the button below',
      'https://google.com',
      'View/edit notes'
    );
    const noteConfirmationMessage = new builder.Message(session);
    noteConfirmationMessage.addAttachment(noteCompletion);
    session.send(noteConfirmationMessage);
    getNotes()
      .then((notes) => {
        let cards = returnLastFive(notes);
        cards.unshift(makeCard(session, 'note'));
        const reply = new builder.Message(session);
        reply.attachmentLayout(builder.AttachmentLayout.carousel);
        reply.attachments(cards);
        session.send('Seems like a good time to review some of your most recent notes');
        session.send(reply);
        session.endConversation();
      });
  }
]).triggerAction({
  matches: 'AddNote'
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
      next({response: amount});
    } else {
      builder.Prompts.number(session, 'How much was the item?');
    }
  },
  (session, results) => {
    addExpense({
        amount: results.response,
        description: session.dialogData.description,
        chargeTo: session.dialogData.chargeTo
    });
    if (session.dialogData.chargeTo !== '') {
      session.endConversation(
        `${session.dialogData.description} saved as an expense
        with a cost of £${results.response}
        against ${session.dialogData.chargeTo}`
      );
    }
    else {
      session.endConversation(`${session.dialogData.description} saved as an expense with a cost of £${results.response}`);
    }
  }
]).triggerAction({
  matches: 'AddExpense'
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
