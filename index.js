require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;
const url = process.env.WEBHOOK_URL; // es: https://tuo-servizio.onrender.com
const port = process.env.PORT || 3000;

if (!token || !url) {
  console.error('BOT_TOKEN o WEBHOOK_URL non trovati nelle variabili d\'ambiente');
  process.exit(1);
}

// Inizializza il bot con webhook
const bot = new TelegramBot(token);
bot.setWebHook(`${url}/bot${token}`);

const app = express();
app.use(express.json());

// Ricevi aggiornamenti dal Webhook di Telegram
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Comandi
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Ciao! Sono il tuo bot Telegram. Usa /help per vedere i comandi disponibili.');
});

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, `
Comandi disponibili:
/start - Avvia il bot
/help - Mostra questo messaggio di aiuto
/info - Informazioni sul bot
`);
});

bot.onText(/\/info/, (msg) => {
  bot.sendMessage(msg.chat.id, `
Bot creato durante il corso di Containerizzazione e Deployment.
Versione: 1.0.0
Ambiente: ${process.env.NODE_ENV || 'development'}
`);
});

// Gestione generica di altri messaggi
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  if (msg.text.startsWith('/start') || msg.text.startsWith('/help') || msg.text.startsWith('/info')) {
    return;
  }
  bot.sendMessage(chatId, 'Non ho capito. Usa /help per vedere i comandi disponibili.');
});

// Avvia il web server
app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});
