const builder = require('botbuilder');

module.exports = function (session, title) {
  return new builder.HeroCard(session)
    .title(`Latest ${title}`)
    .text(session.dialogData.text || session.dialogData.description);
};
