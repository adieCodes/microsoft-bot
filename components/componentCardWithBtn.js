const builder = require('botbuilder');

module.exports = function (session, title, text, url, btnName) {
  return new builder.ThumbnailCard(session)
    .title(title)
    .text(text)
    .buttons([
      builder.CardAction.openUrl(session, url, btnName),
      builder.CardAction.imBack(session, 'viewNotes', 'view notes')
    ]);
};
