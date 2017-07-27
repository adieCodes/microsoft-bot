const _ = require('underscore');

module.exports.returnLastFiveNotes = function (obj) {
  let sortedArr = _.sortBy(obj, 'lastEditTime');
  let resultArr = _.reduceRight(sortedArr, (arr, ele) => {
    return arr.concat(ele);
  }, []);
  return _.first(resultArr, 5);
};

module.exports.returnLastFiveExpense = function (obj) {
  let sortedArr = _.sortBy(obj, 'lastEditTime');
  let resultArr = _.reduceRight(sortedArr, (arr, ele) => {
    ele.title = ele.description;
    ele.text = `£${ele.amount}`;
    return arr.concat(ele);
  }, []);
  return _.first(resultArr, 5);
};
