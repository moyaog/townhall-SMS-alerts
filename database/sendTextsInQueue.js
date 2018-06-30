#!/usr/bin/env node
const moment = require('moment');
const CronJob = require('cron').CronJob;
const firebasedb = require('../lib/firebaseinit');
// const messaging = require('../lib/response');

const sendFromQueue = () => {
  firebasedb.ref('sms-queue').once('value').then((snapshot) => {
    snapshot.forEach((message) => {
      let messageData = message.val();
      // is the event happening in less than 2 days? rounded to the nearest hour
      if (moment(messageData.dateObj).isSameOrBefore(moment().add(48, 'hours'), 'hour') && !messageData.sent) {
        console.log(messageData.key, moment(messageData.dateObj).format('DD/MM/YY, hh:mm A'));
        // messaging.newMessage(messageData.body, messageData.phoneNumber)
        //   .then((message) => {
        //     console.log(message.sid, moment(messageData.dateObj).format('DD/MM/YY, hh:mm AM'));
        //     firebasedb.ref(`sms-queue/${messageData.key}`).update({sent: true});
        //   });
      } else if (moment(messageData.dateObj).isBefore()) {
        console.log('in the past', moment(messageData.dateObj).format('DD/MM/YY, hh:mm A'));
        firebasedb.ref(`sms-queue/${messageData.key}`).remove();
      }
    });
  });
};

const checkQueue = new CronJob({
  cronTime: '00 * 9-17 * * *',
  onTick: function () {
    console.log('checking');
    sendFromQueue();
  },
  start: false,
  timeZone: 'America/Los_Angeles',
});

module.exports = checkQueue;
