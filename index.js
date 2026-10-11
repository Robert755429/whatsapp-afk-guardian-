const { Client, LocalAuth } = require('whatsapp-web.js');
const { handleCommands } = require('./bot.js');
const config = require('./config.js');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

// SOSTITUISCE IL QR CON IL CODICE
client.on('ready', () => console.log('❤️ AFK Guardian è online!'));

client.initialize().then(async () => {
    // Richiedi codice solo se non sei già loggato
    const pairingCode = await client.requestPairingCode(config.ownerNumber.replace('@c.us','').replace('+',''));
    console.log(`\n🔑 IL TUO CODICE DI COLLEGAMENTO: ${pairingCode}`);
    console.log('Vai su WhatsApp > Dispositivi collegati > Collega con numero di telefono > Inserisci questo codice\n');
});

client.on('message', async msg => {
    await handleCommands(client, msg);
});
