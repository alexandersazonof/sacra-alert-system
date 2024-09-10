import axios from 'axios';
import logger from '../logger';

export async function createMessageAndSend(rpcRecord: Record<string, boolean>, subgraphRecord: Record<string, boolean>) {
    let shouldPing = false;
    let message = `🔧 *RPC Status*\n`;
    for (const key in rpcRecord) {
        if (!rpcRecord[key]) {
            shouldPing = true;
        }
        message += `${key}: ${rpcRecord[key] ? '✅ Operational' : '❌ Down'}\n`;
    }
    message += `\n📊 *Subgraph Status*\n`;
    for (const key in subgraphRecord) {
        if (!subgraphRecord[key]) {
            shouldPing = true;
        }
        message += `${key}: ${subgraphRecord[key] ? '✅ Synced' : '❌ Out of Sync'}\n`;
    }

    if (shouldPing) {
        message += `\n🚨 *Alert*\nPing @ruby0x`;
    }
    await sendMessage(message);
}

export async function sendMessage(text: string) {
    try {
        const res = await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: text
        });
        return res.data;
    } catch (error) {
      logger.error(`Error while sending message to telegram ${error}`);
    }
}