import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import http from 'http';

let lastQR = '等待二维码...';
let balance = 0;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  if (lastQR.startsWith('等待')) {
    res.end(`<h2>${lastQR}</h2>`);
  } else {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(lastQR)}`;
    res.end(`<h2>扫码登录</h2><img src="${qrUrl}" style="width:350px"/><h3>当前余额：${balance}</h3>`);
  }
});
server.listen(process.env.PORT || 3000);

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { args: ['--no-sandbox'] }
});

client.on('qr', qr => { lastQR = qr; console.log('新二维码'); });
client.on('ready', () => console.log('已上线'));

client.on('message', async msg => {
  const text = msg.body.trim();
  // 匹配 +100 或 -50 或 + 100.5
  const match = text.match(/^([+-])\s*(\d+(\.\d+)?)/);
  if (match) {
    const sign = match[1];
    const num = parseFloat(match[2]);
    if (sign === '+') balance += num;
    else balance -= num;
    msg.reply(`${sign}${num} 已记\n当前余额：${balance}`);
  }
});

client.initialize();
