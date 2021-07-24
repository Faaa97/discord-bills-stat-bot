let index = require('./index.js');
const fs = require('fs');


const Bill = index.Bill;
const Historial = index.Historial;

function readArrayFromFile() {
  const data = fs.readFileSync('data/input.txt', {encoding:'utf8', flag:'r'});
  
  let array = data.split(/\r?\n/);
  array = array.filter((item) => {
    return item.length > 0;
  });
  array = array.map((entry) => {
    return new Bill(parseFloat(entry), new Date);
  });
  return array;
};

function main() {
  const bills = readArrayFromFile();

  console.log(bills);

  let hist = new Historial();
  hist.load();
  
  bills.forEach((bill) => {
    hist.addBill(bill);
  });

  hist.save();

  console.log('Added ' + bills.length + ' entries to historial.');

};

main();


