const { Client: FNclient, Enums } = require('fnbr');
const express = require('express');
const axios = require('axios');
const app = express();

const clientOptions = {
    defaultStatus: "Launching Rufus21.93",
    auth: {},
    debug: console.log,
    platform: 'WIN',
    xmppDebug: false,
    partyConfig: { chatEnabled: true, maxSize: 16 }
};

const join_users = true;
const addusers = true;

const accounts = [
    {
        accountId: 'fccea2eb2be346cb9ce4518dd4d2faf2',
        deviceId: '06b4b296bca946fdb585cc6740c5d063',
        secret: '6YZPAZOB4M4NKDUVLENP4VAWQTQ2GBST'
    }
];

const accountsObjects = accounts.map(deviceAuth => new FNclient({
    defaultStatus: "Free Vbucks invite",
    auth: { deviceAuth },
    debug: console.log,
    xmppDebug: false,
    platform: 'WIN',
    partyConfig: { chatEnabled: true, maxSize: 16 }
}));

app.get('/', (req, res) => res.send("hello"));
app.get('/ping', (req, res) => res.send("pong")); // Endpoint for UptimeRobot
app.listen(process.env.PORT || 3000, () => console.log("web started"));

(async () => {
    await Promise.all(accountsObjects.map(async client => {
        try {
            await client.login();
            console.log(`[LOGS] Logged in as ${client.user.displayName}`);
            const party = client.party;
            client.setStatus("Free Vbucks invite", "online");

            client.on('friend:message', msg => handleCommand(msg, msg.author));

            client.on('friend:request', async request => {
                if (addusers) await request.accept();
                else await request.decline();
            });

            client.on('party:invite', async request => {
                if (join_users) await request.accept();
                else await request.decline();
            });

            client.on('party:member:joined', async join => {
                client.party.chat.send('Discord server: dsc.gg/iron-web10\n  bot created by: iron web10 and undefined name. on epic');
                if (party.size === 1) {
                    try {
                        client.setStatus("Free Vbucks, invite", "online");
                    } catch (owen) {
                        console.log(`Error: ${owen}`);
                    }
                }
            });
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    }));
})();

