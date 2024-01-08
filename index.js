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
    defaultStatus: "Free Chat-GPT 4",
    auth: { deviceAuth },
    debug: console.log,
    xmppDebug: false,
    platform: 'WIN',
    partyConfig: { chatEnabled: true, maxSize: 16 }
}));

app.get('/', (req, res) => res.send("hello"));
app.listen(3000, () => console.log("web started"));

(async () => {
    await Promise.all(accountsObjects.map(async client => {
        try {
            await client.login();
            console.log(`[LOGS] Logged in as ${client.user.displayName}`);
            const party = client.party;
            client.setStatus("Free Chat-GPT 4, invite", "online");

            try {
                await client.party.setPrivacy(Enums.PartyPrivacy.PRIVATE);
            } catch (owen) {
                console.log(`Error: ${owen}`);
            }

            const handleCommand = async (message, sender) => {
                console.log(`${sender.displayName}: ${message.content}`);
                const [command, query] = message.content.slice(1).split(' ');
                const content = query.toLowerCase();

                if (command === 'ai' && query) {
                    try {
                        const apiUrl = `https://api.popcat.xyz/chatbot?msg=${encodeURIComponent(content)}`;
                        const response = await axios.get(apiUrl);

                        // Check if the response has the expected structure
                        if (response.data && response.data.response) {
                            const apiResponse = response.data.response;
                            console.log('API Response:', apiResponse);
                            message.reply(apiResponse || 'API response is empty or undefined.');
                        } else {
                            console.error('Unexpected API response structure:', response.data);
                            message.reply('Unexpected API response structure. Please try again later.');
                        }
                    } catch (apiError) {
                        console.error('API Error:', apiError);
                        message.reply('Failed to fetch response from the API.');
                    }
                }
            };

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
                client.party.chat.send('Discord server: dsc.gg/iron-web10\n  bot created by: iron web10');
                if (party.size === 1) {
                    try {
                        client.setStatus("Free Chat-GPT 4, invite", "online");
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
