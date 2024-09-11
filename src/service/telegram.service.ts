import axios from 'axios';
import logger from '../logger';
import * as dotenv from 'dotenv';

dotenv.config();

const PING_USERS = (process.env.PING_USERS || '').split(',');
const DELAY_THRESHOLD = 1000;

export async function createMessageAndSend(
  rpcRecord: Record<string, boolean>,
  subgraphRecord: Record<string, boolean>,
  subgraphDelayRecord: Record<string, number>,
  proxySubgraphRecord: Record<string, number>
  ) {
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

    message += `\n🕒 *Subgraph Response Time*\n`;
    for (const key in subgraphDelayRecord) {
        if (subgraphDelayRecord[key] > DELAY_THRESHOLD) {
            shouldPing = true;
        }
        message += `${key}: ${subgraphDelayRecord[key] < DELAY_THRESHOLD ? '✅ OK' : '❌ Degradation'} ${subgraphDelayRecord[key].toFixed(0)} ms\n`;
    }

    message += `\n📦 *Proxy Subgraph Items*\n`;
    for (const key in proxySubgraphRecord) {
        if (proxySubgraphRecord[key] === 0) {
            shouldPing = true;
        }
        message += `${key}: ${proxySubgraphRecord[key] > 0 ? '✅ Not empty array' : '❌ Empty array'}\n`;
    }

    if (shouldPing && PING_USERS.length > 0) {
        message += `\n🚨 *Alert*\nPing ${PING_USERS.join(' ')}`;
    }
    await sendMessage(message);
}

export async function sendErrorMessage(method: string, error: string) {
    const message = `❌ *Error*\nMethod: ${method}\nError: ${error}`;
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