const config = require('./config.js');
let rmStatus = config.rmDefault;
const timers = new Map();
let startTime = Date.now();

async function handleCommands(client, msg) {
    const body = msg.body.trim();
    const MIO_NUMERO = config.ownerNumber;

    // Se NON sei tu -> controlla se ti hanno taggato
    if (!msg.fromMe) {
        if (rmStatus && msg.mentionedIds.includes(MIO_NUMERO)) {
            const key = msg.from + msg.author;
            if (timers.has(key)) clearTimeout(timers.get(key));

            const timer = setTimeout(async () => {
                const taggatore = msg.author;
                const numeroPulito = taggatore.split('@')[0];
                try {
                    await client.sendMessage(msg.from, `@${numeroPulito} ${config.messaggioGruppo}`, { mentions: [taggatore] });
                    await client.sendMessage(MIO_NUMERO, `🔔 *Menzione persa*\nGruppo: ${msg.from}\nDa: +${numeroPulito}\nMessaggio: "${msg.body}"\nNumero: wa.me/${numeroPulito}`);
                } catch(e){ console.log(e) }
            }, config.afkTime * 60 * 1000);

            timers.set(key, timer);
        }
        return;
    }

    // Se rispondi tu, annulla timer di quel gruppo
    if (msg.fromMe) {
        for (let [k, t] of timers) {
            if (k.startsWith(msg.from)) clearTimeout(t);
        }
    }

    //.Pi - Pagina iniziale
    if (body === '.Pi') {
        await client.sendMessage(msg.from, `🤖 *${config.botName} - Pagina Iniziale*\n\n*.ping* (controllo latenza e uptime)\n→ Mostra latenza e da quanto è attivo il bot\n\n*.rm on/off* (risposta menzione on/off)\n→ Attiva o disattiva la risposta automatica dopo ${config.afkTime} min\n\n*.Pi* (pagina iniziale)\n→ Questo menu\n\nStato RM: ${rmStatus? '🟢 ON' : '🔴 OFF'}`);
    }

    //.ping
    if (body === '.ping') {
        const latency = Date.now() - (msg.timestamp * 1000);
        const uptimeSec = Math.floor((Date.now() - startTime) / 1000);
        const h = Math.floor(uptimeSec / 3600);
        const m = Math.floor((uptimeSec % 3600) / 60);
        const s = uptimeSec % 60;
        await client.sendMessage(msg.from, `🏓 *Pong!*\nLatenza: ${latency}ms\nUptime: ${h}h ${m}m ${s}s\nRM: ${rmStatus? 'ON' : 'OFF'}`);
    }

    //.rm on/off
    if (body === '.rm on') { rmStatus = true; await client.sendMessage(msg.from, '✅ *RM ON* - Risponderò alle menzioni'); }
    if (body === '.rm off') { rmStatus = false; await client.sendMessage(msg.from, '❌ *RM OFF* - Non risponderò più'); }
}

module.exports = { handleCommands };
