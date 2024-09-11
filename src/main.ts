import * as schedule from 'node-schedule';
import logger from './logger';
import { isEqualsRpcState } from './service/rpc.service';
import { compareSubgraphAndRpcByBlock, getProxyPawnshopItems, getResponseTime } from './service/subgraph.service';

import * as dotenv from 'dotenv';
import { createMessageAndSend, sendMessage } from './service/telegram.service';
import { ApplicationStateEntity } from './entity/application-state.entity';
import { saveApplicationState } from './service/application-state.service';

dotenv.config();

// RPC
const RPC_TARGET = (process.env.RPC_TARGET || '').split(',');
const RPC_SOURCE = (process.env.RPC_SOURCE || '').split(',');
const RPC_NAME = (process.env.RPC_NAME || '').split(',');

// Subgraph
const SUBGRAPH_TARGET = (process.env.SUBGRAPH_TARGET || '').split(',');
const SUBGRAPH_SOURCE = (process.env.SUBGRAPH_SOURCE || '').split(',');
const SUBGRAPH_NAME = (process.env.SUBGRAPH_NAME || '').split(',');

// Proxy subgraph
const PROXY_SUBGRAPH_TARGET = (process.env.PROXY_SUBGRAPH_TARGET || '').split(',');
const PROXY_SUBGRAPH_NAME = (process.env.PROXY_SUBGRAPH_NAME || '').split(',');

const JOB_INTERVAL = process.env.JOB_INTERVAL || '*/1 * * * *';

const job = schedule.scheduleJob(JOB_INTERVAL, async function(){
  try {
    logger.info('Run job');
    let rpcRecord: Record<string, boolean> = {};
    for (let i = 0; i < RPC_TARGET.length; i++) {
      rpcRecord[RPC_NAME[i]] = await isEqualsRpcState(RPC_TARGET[i], RPC_SOURCE[i]);
      await saveApplicationState(createApplicationState(RPC_NAME[i], 'RPC state', RPC_TARGET[i], rpcRecord[RPC_NAME[i]] ? 'OK' : 'ERROR'));
    }

    let subgraphRecord: Record<string, boolean> = {};
    let subgraphDelayRecord: Record<string, number> = {};
    for (let i = 0; i < SUBGRAPH_TARGET.length; i++) {
      subgraphRecord[SUBGRAPH_NAME[i]] = await compareSubgraphAndRpcByBlock(SUBGRAPH_TARGET[i], SUBGRAPH_SOURCE[i]);
      subgraphDelayRecord[SUBGRAPH_NAME[i]] = await getResponseTime(SUBGRAPH_TARGET[i]);
      await saveApplicationState(createApplicationState(SUBGRAPH_NAME[i], 'Subgraph state', SUBGRAPH_TARGET[i], subgraphRecord[SUBGRAPH_NAME[i]] ? 'OK' : 'ERROR'));
      await saveApplicationState(createApplicationState(SUBGRAPH_NAME[i], 'Subgraph delay', SUBGRAPH_TARGET[i], subgraphDelayRecord[SUBGRAPH_NAME[i]].toString()));
    }

    let proxySubgraphRecord: Record<string, number> = {};
    for (let i = 0; i < PROXY_SUBGRAPH_TARGET.length; i++) {
      proxySubgraphRecord[PROXY_SUBGRAPH_NAME[i]] = await getProxyPawnshopItems(PROXY_SUBGRAPH_TARGET[i]);
      await saveApplicationState(createApplicationState(PROXY_SUBGRAPH_NAME[i], 'Proxy subgraph', PROXY_SUBGRAPH_TARGET[i], proxySubgraphRecord[PROXY_SUBGRAPH_NAME[i]].toString()));
    }

    await createMessageAndSend(rpcRecord, subgraphRecord, subgraphDelayRecord, proxySubgraphRecord);
  } catch (error) {
    await sendMessage(`Error running ${error}`);
    logger.error(`Error running ${error}`);
  }
});

function createApplicationState(application: string, metric: string, url: string, result: string): ApplicationStateEntity {
  const applicationState = new ApplicationStateEntity();
  applicationState.applicationName = application;
  applicationState.metric = metric;
  applicationState.url = url;
  applicationState.result = result;
  return applicationState;
}