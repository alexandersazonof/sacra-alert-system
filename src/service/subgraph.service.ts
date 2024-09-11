import axios from 'axios';
import logger from '../logger';
import { getLatestBlock } from './rpc.service';
import { sendErrorMessage } from './telegram.service';


export async function compareSubgraphAndRpcByBlock(subgraph: string, rpc: string) {
  try {
    const subgraphBlock = await getSubgraphBlock(subgraph);
    const rpcBlock = await getLatestBlock(rpc);
    return Math.abs(subgraphBlock - rpcBlock);
  } catch (error) {
    logger.error(`Error comparing the subgraph and RPCs: ${error}`);
    return -1;
  }
}

export async function getResponseTime(url: string): Promise<number> {
  const start = performance.now();
  try {
    await getSubgraphBlock(url);
  } catch (e) {
    logger.error(`Error fetching the response time: ${e}`);
    return -1;
  }
  const end = performance.now();
  return end - start;
}

export async function getProxyPawnshopItems(url: string): Promise<number> {
  try {
    const response = await axios.get(url + 'pawnshop-positions?first=10');

    return (response.data as string[]).length;
  } catch (error) {
    await sendErrorMessage('getProxyPawnshopItems', error);
    logger.error(`Error fetching the proxy pawnshop items: ${error}`);
    return 0;
  }
}

async function getSubgraphBlock(subgraph: string): Promise<number> {
  try {
    const response = await axios.post(subgraph, {
      query: '{ _meta { block { number } } }'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data.data._meta.block.number;
  } catch (error) {
    await sendErrorMessage('getSubgraphBlock', error);
    logger.error(`Error fetching the subgraph block: ${error}`);
    return 0;
  }
}