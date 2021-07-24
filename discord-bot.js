const Discord = require('discord.js');
const { Bill } = require('./index.js');
const System = require('./system.js');

require('dotenv').config();
const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

/* Bot config */

class Logger {

  constructor(){
    this._bot = new Discord.Client();
    this._system = new System(this);
    
    this._bot.login(TOKEN);

    this._bot.on('ready', () => {
      console.info(`Logged in as ${this._bot.user.tag}!`);
      this._mainChannel = this._bot.channels.cache.get(CHANNEL_ID);
    });

    this._bot.on('message', msg => {
      this._lastMessage = msg;
      let match;
      if (match = msg.content.match(/!add-bill (\d+\.?\d*) (\w*)/)){

        let ammount = parseFloat(match[1]);
        let concept = match[2];

        if(concept == null){
          concept = "";
        }

        this._system.addNewBill(new Bill(ammount, new Date(), concept));

      } else if(msg.content === '!bill-stats') {

        this._system.reportStats();

      } 
    });

  }

  replyMessage(message) {
    this._lastMessage.reply(message);
  }

};

const logger = new Logger();