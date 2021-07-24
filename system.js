let index = require('./index.js');
const fs = require('fs');

const Bill = index.Bill;
const Historial = index.Historial;
const Analytics = index.Analytics;

class System { 

  constructor(logger) {
    this._historial = new Historial();
    this._historial.load();

    this._stats = new Analytics(this._historial);
    this._stats.init();

    this._logger = logger;
  }

  addNewBill(bill) {
    this._historial.addBill(bill);
    this._historial.save();
    this._logger.replyMessage('Bill added');
  }

  reportStats() {
    let mean = this._stats.getMean();
    let spentToday = this._stats.spentToday();
    let spentMonth = this._stats.spentThisMonth();
    let matrix = this._stats.getGroupedByConcept(30);

    let date = new Date();

    let message = "```" + 
    "Date: " + date.toDateString() + "\n" + 
    "Spent today: " + spentToday.toFixed(2) + "€\n" +
    "Spent this month: " + spentMonth.toFixed(2) + "€\n" +
    "Mean ammount spent: " + mean.toFixed(2) + "€\n" +
    "------\n";

    let keys = Object.keys(matrix);
    keys.sort(function(a, b) { return matrix[b] - matrix[a] });
    keys.forEach((key) => {
        message += key + ": " + matrix[key].toFixed(2) + "€\n";
    })

    message += "```";

    this._logger.replyMessage(message);
  }

};

module.exports = System;