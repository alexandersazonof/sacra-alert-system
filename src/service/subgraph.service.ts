import axios from 'axios';
import logger from '../logger';
import { getLatestBlock } from './rpc.service';

const DIFFERENCE_THRESHOLD = 15;

export async function compareSubgraphAndRpcByBlock(subgraph: string, rpc: string) {
  try {
    const subgraphBlock = await getSubgraphBlock(subgraph);
    const rpcBlock = await getLatestBlock(rpc);
    return Math.abs(subgraphBlock - rpcBlock) < DIFFERENCE_THRESHOLD;
  } catch (error) {
    logger.error(`Error comparing the subgraph and RPCs: ${error}`);
    return false;
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
    logger.error(`Error fetching the subgraph block: ${error}`);
    return 0;
  }
}