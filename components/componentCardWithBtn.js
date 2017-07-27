const builder = require('botbuilder');

module.exports = function (session, type, text, url) {
  return new builder.ThumbnailCard(session)
    .title(`Added ${type}`)
    .text(text)
    .buttons([
      builder.CardAction.openUrl(session, url, `edit ${type}s`),
      builder.CardAction.imBack(session, `view${type}s`, `recent ${type}s`)
    ]);
};
