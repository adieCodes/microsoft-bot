const {ADDEXPENSEURL} = require('../config');
const axios = require('axios');

function addExpense (data) {
    const expense = {
        amount: data.amount,
        description: data.description,
        chargeTo: data.chargeTo,
        lastEditTime: Date.now(),
        // TODO: Enable authentication
        // userId: firebase.auth().currentUser.uid
        userId: '41ZyBmZ5XIMeVxk8en9LxXf9PWB3'
    };
return axios.post(`${ADDEXPENSEURL}`, expense)
  .then((response) => {
      expense.key = response.key;
    })
  .catch((error) => {
    console.log(error);
  });
}

module.exports = addExpense;
