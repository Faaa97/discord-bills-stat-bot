const fs = require('fs');


class Bill {
  
    constructor(ammount, date, concept) {
      this.ammount = ammount;
      this.date = date;
      this.concept = concept;
    };

    static fromObj(obj) {
        let b = new Bill();
        b.ammount = obj.ammount;
        b.date = obj.date;
        b.concept = obj.concept;
        return b;
    };

    toObj() {
        return {
            ammount: this.ammount,
            date : this.date,
            concept: this.concept,
        };          
    };
  
};

class Historial {
    
    constructor() {
        this.historial = [];
    };
    
    addBill(bill) {
        this.historial.push(bill);
    }

    getList() {
        return this.historial;
    }
    
    save() {
        //write to json
        let converted_list = this.historial.map((entry) => {
            let obj = entry.toObj();
            obj.date = obj.date.valueOf();
            return obj;
        });
        let json = JSON.stringify(converted_list);
        fs.writeFileSync('data/historial.json', json);
    };
    
    load() {
        //load from json
        const json = fs.readFileSync('data/historial.json',
            {encoding:'utf8', flag:'r'});
        if(!json){
            console.error('Historial: could not load data...');
            return;
        }

        let data = JSON.parse(json);

        this.historial = data.map((entry) => {
            entry.date = new Date(entry.date);
            return Bill.fromObj(entry);
        });
        
    };
  
};

class Analytics {

    constructor(historial) {
        this.historial = historial;
    };

    init() {
        //this.historial.load();
        this.list = this.historial.getList();
    }

    close() {
        this.historial.save();
    }

    getMean() {
        let mean = 0;
        this.list.forEach((entry) => {
            mean+= entry.ammount;
        });
        
        mean/= this.list.length;
        return mean;
    };

    getGroupedByConcept(daysAgo) {
      let groups = {};
      let target = Date.now() - new Date(1000 * 60 * 60 * 24 * daysAgo);
      this.list.forEach((entry) => {
        if(entry.date < target){
          return;
        }
        groups[entry.concept] = groups[entry.concept] + entry.ammount || entry.ammount;
      });

      return groups;
    }

    spentToday() {
        return this._spent(1);
    }

    spentThisWeek() {
        return this._spent(7);
    };

    spentThisMonth() {
        return this._spent(30);
    }

    spentThisYear() {
        return this._spent(365);
    }

    _spent(days) {
        const today = Date.now();
        const start = today - new Date(1000 * 60 * 60 * 24 * days);
        let spent = this.list.reduce((acc, curr) => {
            let value = 0;
            if(curr.date > start) {
                value = curr.ammount;
            }
            return acc + value;
        }, 0);
        return spent;

    };

};


function addNewBill(ammount) {
    let b = new Bill(ammount, new Date);
    let historial = new Historial();
    historial.load();
    historial.addBill(b);
    historial.save();
}



function main() {
    /*let bills = [
        new Bill(1, new Date, false),
        new Bill(1, new Date, false),
        new Bill(10, new Date, false)
    ];*/

    /*bills.forEach((bill) => {
      hist.addBill(bill);
    });*/

    let hist = new Historial();
    let stats = new Analytics(hist);

    stats.init();

    console.log(stats.getMean());

    console.log(stats.spentThisWeek());

    stats.close();
};
/*
addNewBill(9.99);
addNewBill(4.99);
addNewBill(23.60);
*/
//main();


module.exports = {
    Bill: Bill,
    Historial: Historial,
    Analytics: Analytics,
};