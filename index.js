require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const bodyParser = require('body-parser');

const token = process.env.BOT_TOKEN;
const url = process.env.APP_URL; // es: https://tuo-nome-app.cloudprovider.com
const port = process.env.PORT || 3000;

if (!token || !url) {
  console.error('BOT_TOKEN o APP_URL mancante');
  process.exit(1);
}

const app = express();
app.use(bodyParser.json());

// Inizializza il bot in modalità "webhook"
const bot = new TelegramBot(token);
bot.setWebHook(`${url}/webhook`);

// Endpoint che riceve gli aggiornamenti da Telegram
app.post('/webhook', (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Comandi bot
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Ciao! Sono il tuo bot via webhook!');
});

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, `
Comandi disponibili:
/start - Avvia il bot
/help - Mostra aiuto
/info - Info sul bot
`);
});

bot.onText(/\/info/, (msg) => {
  bot.sendMessage(msg.chat.id, `
Bot attivo via Webhook.
Versione: 1.0.0
Ambiente: ${process.env.NODE_ENV || 'development'}
`);
});

bot.on('message', (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  if (!['/start', '/help', '/info'].includes(text)) {
    bot.sendMessage(chatId, 'Comando non riconosciuto. Usa /help.');
  }
});

// Avvia il server web
app.listen(port, () => {
  console.log(`Bot in ascolto su porta ${port}`);
});
