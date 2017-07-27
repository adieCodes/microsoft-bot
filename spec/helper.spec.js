const {expect} = require('chai');
const returnLastFive = require('../helpers/helpers.js');

describe('#returnLastFive', () => {
  it('is a function', () => {
    expect(returnLastFive).to.be.a('function');
  });
  // TODO: Need to rewrite test as it interacts with live data
  // it('should return the last five elements from an object', () => {
  //   let input = { '-KpyEItme0IDSyXogUtd':
  //  { created: 1501061529298,
  //    lastEditTime: 1501061529298,
  //    text: 'note test typeof makeCard',
  //    title: 'Note created at 1501061529020',
  //    userId: '41ZyBmZ5XIMeVxk8en9LxXf9PWB3' },
  // '-KpyEbacBmK4EvhkYyyw':
  //  { created: 1501061609898,
  //    lastEditTime: 1501061609898,
  //    text: 'note test type of makeCard 2',
  //    title: 'Note created at 1501061609631',
  //    userId: '41ZyBmZ5XIMeVxk8en9LxXf9PWB3' },
  // '-KpyEib54NgQkcCSBm_e':
  //  { created: 1501061638600,
  //    lastEditTime: 1501061638600,
  //    text: 'note test type of makeCard 3',
  //    title: 'Note created at 1501061638400',
  //    userId: '41ZyBmZ5XIMeVxk8en9LxXf9PWB3' },
  // '-KpyEwCNXQ5bcm2GqQro':
  //  { created: 1501061694298,
  //    lastEditTime: 1501061694298,
  //    text: 'note new test',
  //    title: 'Note created at 1501061694023',
  //    userId: '41ZyBmZ5XIMeVxk8en9LxXf9PWB3' },
  // '-KpyFEHyPWr8i8BFywVe':
  //  { created: 1501061772703,
  //    lastEditTime: 1501061772703,
  //    text: 'note try returning card',
  //    title: 'Note created at 1501061772476',
  //    userId: '41ZyBmZ5XIMeVxk8en9LxXf9PWB3' },
  // '-KpyG5379ohyRd-kwGcX':
  //  { created: 1501061997102,
  //    lastEditTime: 1501061997102,
  //    text: 'note test carousel',
  //    title: 'Note created at 1501061996758',
  //    userId: '41ZyBmZ5XIMeVxk8en9LxXf9PWB3' },
  // '-KpyGQbwYS83my0hL2nU':
  //  { created: 1501062085310,
  //    lastEditTime: 1501062085310,
  //    text: 'note test carousel 2',
  //    title: 'Note created at 1501062084966',
  //    userId: '41ZyBmZ5XIMeVxk8en9LxXf9PWB3' },
  // '-KpyGsEnYWD1gcZov0vt':
  //  { created: 1501062202356,
  //    lastEditTime: 1501062202356,
  //    text: 'note test carousel 3',
  //    title: 'Note created at 1501062202110',
  //    userId: '41ZyBmZ5XIMeVxk8en9LxXf9PWB3' },
  // '-KpyJ1iyhsqlE3iA3sK4':
  //  { created: 1501062769599,
  //    lastEditTime: 1501062769599,
  //    text: 'note not sure why this isn\'t seen as a note',
  //    title: 'Note created at 1501062769308',
  //    userId: '41ZyBmZ5XIMeVxk8en9LxXf9PWB3' },
  // '-KpyJliybBMpHW7odS52':
  //  { created: 1501062962399,
  //    lastEditTime: 1501062962399,
  //    text: 'note test carousel 10',
  //    title: 'Note created at 1501062962089',
  //    userId: '41ZyBmZ5XIMeVxk8en9LxXf9PWB3' },
  // '-KpyPR4ZCvonXxdRHm9i':
  //  { created: 1501064446307,
  //    lastEditTime: 1501064446307,
  //    text: 'note test carousel 11',
  //    title: 'Note created at 1501064446011',
  //    userId: '41ZyBmZ5XIMeVxk8en9LxXf9PWB3' },
  // '-KpyQ3PknFdwiNVJwy-z':
  //  { created: 1501064611698,
  //    lastEditTime: 1501064611698,
  //    text: 'note test carousel 12',
  //    title: 'Note created at 1501064611279',
  //    userId: '41ZyBmZ5XIMeVxk8en9LxXf9PWB3' },
  // '-KpybImmTfRo1GWv8tg9':
  //  { created: 1501067820403,
  //    lastEditTime: 1501067820403,
  //    text: 'note test sending note and carousel',
  //    title: 'Note created at 1501067819990',
  //    userId: '41ZyBmZ5XIMeVxk8en9LxXf9PWB3' },
  // '-Kpyc_3vD96FdPYLyd8y':
  //  { created: 1501068153148,
  //    lastEditTime: 1501068153148,
  //    text: 'note test sending message and carousel',
  //    title: 'Note created at 1501068152852',
  //    userId: '41ZyBmZ5XIMeVxk8en9LxXf9PWB3' },
  // '-Kpycnvp099fJWEF9DUx':
  //  { created: 1501068214101,
  //    lastEditTime: 1501068214101,
  //    text: 'note test sending message, card and carousel',
  //    title: 'Note created at 1501068213794',
  //    userId: '41ZyBmZ5XIMeVxk8en9LxXf9PWB3' },
  // '-Kpydc4IsWIhg6DMoNo2':
  //  { created: 1501068427701,
  //    lastEditTime: 1501068427701,
  //    text: 'note test sending message, card and carousel 2',
  //    title: 'Note created at 1501068427393',
  //    userId: '41ZyBmZ5XIMeVxk8en9LxXf9PWB3' },
  // '-KpyePdvIQyrOWoE-Mns':
  //  { created: 1501068634944,
  //    lastEditTime: 1501068634944,
  //    text: 'note test sending message, card and carousel with chat',
  //    title: 'Note created at 1501068634632',
  //    userId: '41ZyBmZ5XIMeVxk8en9LxXf9PWB3' },
  // '-KpyeZrpTFOMrFUS_7PV':
  //  { created: 1501068676794,
  //    lastEditTime: 1501068676794,
  //    text: 'note trying to create a little gap between messages',
  //    title: 'Note created at 1501068676436',
  //    userId: '41ZyBmZ5XIMeVxk8en9LxXf9PWB3' },
  // '-Kpyeh-GOK2TUXdHziQ7':
  //  { created: 1501068710102,
  //    lastEditTime: 1501068710102,
  //    text: 'note trying to create a little gap between messages 2',
  //    title: 'Note created at 1501068709835',
  //    userId: '41ZyBmZ5XIMeVxk8en9LxXf9PWB3' },
  // '-KpyfKwVgjO7eqiVQ8KS':
  //  { created: 1501068877601,
  //    lastEditTime: 1501068877601,
  //    text: 'note showing off',
  //    title: 'Note created at 1501068877334',
  //    userId: '41ZyBmZ5XIMeVxk8en9LxXf9PWB3' } }

  //    let actual = returnLastFive(input);
  //    let expected = [
  //  { created: 1501068427701,
  //    lastEditTime: 1501068427701,
  //    text: 'note test sending message, card and carousel 2',
  //    title: 'Note created at 1501068427393',
  //    userId: '41ZyBmZ5XIMeVxk8en9LxXf9PWB3' },
  //  { created: 1501068634944,
  //    lastEditTime: 1501068634944,
  //    text: 'note test sending message, card and carousel with chat',
  //    title: 'Note created at 1501068634632',
  //    userId: '41ZyBmZ5XIMeVxk8en9LxXf9PWB3' },
  //  { created: 1501068676794,
  //    lastEditTime: 1501068676794,
  //    text: 'note trying to create a little gap between messages',
  //    title: 'Note created at 1501068676436',
  //    userId: '41ZyBmZ5XIMeVxk8en9LxXf9PWB3' },
  //  { created: 1501068710102,
  //    lastEditTime: 1501068710102,
  //    text: 'note trying to create a little gap between messages 2',
  //    title: 'Note created at 1501068709835',
  //    userId: '41ZyBmZ5XIMeVxk8en9LxXf9PWB3' },
  //  { created: 1501068877601,
  //    lastEditTime: 1501068877601,
  //    text: 'note showing off',
  //    title: 'Note created at 1501068877334',
  //    userId: '41ZyBmZ5XIMeVxk8en9LxXf9PWB3' } ];

  //    expect(actual).to.eql(expected);
  // });
});
