import qrcode from 'qrcode-terminal';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox'] }
});

client.on('qr', qr => qrcode.generate(qr, {small: true}));
client.on('ready', () => console.log('记账机器人已上线'));
client.on('message', async msg => {
    if(msg.body.includes('花了') || msg.body.includes('收入')){
        await msg.reply(`已记：${msg.body}`);
    }
});

client.initialize();
