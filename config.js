cat > index.js << 'EOF'
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('auth');
  const sock = makeWASocket({ auth: state, printQRInTerminal: true });
  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', (u) => {
    if (u.qr) qrcode.generate(u.qr, { small: true });
    if (u.connection === 'open') console.log('COLLEGATO - VOIDBOT PULITO ONLINE');
  });
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    if (!m.message || m.key.fromMe) return;
    const text = m.message.conversation || '';
    if (text.toLowerCase() === '!menu') {
      await sock.sendMessage(m.key.remoteJid, { text: 'Ciao bro, sono online.\nComandi:\n!menu - questo menu\n!ping - ti rispondo pong' });
    }
    if (text.toLowerCase() === '!ping') {
      await sock.sendMessage(m.key.remoteJid, { text: 'pong' });
    }
  });
}
start();
EOF
