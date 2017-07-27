const _ = require('underscore');

module.exports = function (obj) {
  let sortedArr = _.sortBy(obj, 'lastEditTime');
  let resultArr = _.reduceRight(sortedArr, (arr, ele) => {
    return arr.concat(ele);
  }, []);
  return _.first(resultArr, 5);
};
