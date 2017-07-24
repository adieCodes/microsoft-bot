const firebase = require('firebase');
const CONFIG = require('./../config.js');

firebase.initializeApp(CONFIG);

const auth = firebase.auth();
const facebookProvider = new firebase.auth.FacebookAuthProvider();
// const storage = firebase.storage();
const database = firebase.database();

function addNote(data) {
    const note = {
        created: Date.now(),
        title: data.title,
        text: data.text,
        tags: [...data.tags],
        lastEditTime: Date.now()
    };
    // TODO: Enable authentication
    // const userId = firebase.auth().currentUser.uid;
    const userId = 'ExkVJBLKOthqpycAiAdkAHdvPfA3';
    const notesRef = database.ref(`/notes/${userId}`);
    return notesRef.push(note)
        .then(res => {
            note.key = res.key;
        })
        .catch(err => {
            console.log(err);
        });

}

module.exports = {
  firebase,
  auth,
  facebookProvider,
  database,
  addNote
};
