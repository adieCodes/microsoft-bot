const database = require('../firebaseSetup.js');

function getAllNotes () {
  // var userId = firebase.auth().currentUser.uid;
  const userId = 'N3yaIqLPkoQZXgSmb8jmeZqTVw43';
  return database.ref('/notes/' + userId).once('value')
    .then(function (snapshot) {
        return snapshot.val();
    }).catch(function (error) {
        console.log(error);
    });

}

module.exports = getAllNotes;
