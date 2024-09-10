import * as schedule from 'node-schedule';
import logger from './logger';
import { isEqualsRpcState } from './service/rpc.service';
import { compareSubgraphAndRpcByBlock } from './service/subgraph.service';

import * as dotenv from 'dotenv';
import { createMessageAndSend, sendMessage } from './service/telegram.service';

dotenv.config();

// RPC
const RPC_TARGET = (process.env.RPC_TARGET || '').split(',');
const RPC_SOURCE = (process.env.RPC_SOURCE || '').split(',');
const RPC_NAME = (process.env.RPC_NAME || '').split(',');

// Subgraph
const SUBGRAPH_TARGET = (process.env.SUBGRAPH_TARGET || '').split(',');
const SUBGRAPH_SOURCE = (process.env.SUBGRAPH_SOURCE || '').split(',');
const SUBGRAPH_NAME = (process.env.SUBGRAPH_NAME || '').split(',');

const JOB_INTERVAL = process.env.JOB_INTERVAL || '*/1 * * * *';

const job = schedule.scheduleJob(JOB_INTERVAL, async function(){
  try {
    logger.info('Run job');
    let rpcRecord: Record<string, boolean> = {};
    for (let i = 0; i < RPC_TARGET.length; i++) {
      rpcRecord[RPC_NAME[i]] = await isEqualsRpcState(RPC_TARGET[i], RPC_SOURCE[i]);
    }

    let subgraphRecord: Record<string, boolean> = {};
    for (let i = 0; i < SUBGRAPH_TARGET.length; i++) {
      subgraphRecord[SUBGRAPH_NAME[i]] = await compareSubgraphAndRpcByBlock(SUBGRAPH_TARGET[i], SUBGRAPH_SOURCE[i]);
    }
    await createMessageAndSend(rpcRecord, subgraphRecord);
  } catch (error) {
    logger.error(`Error running ${error}`);
  }
});