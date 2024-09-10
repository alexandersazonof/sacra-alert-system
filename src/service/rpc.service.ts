import { ethers } from 'ethers';
import logger from '../logger';

const DIFFERENCE_THRESHOLD = 15;

export async function isEqualsRpcState(firstRpc: string, secondRpc: string) {
  try {
    const firstRpcBlock = await getLatestBlock(firstRpc);
    const secondRpcBlock = await getLatestBlock(secondRpc);
    return Math.abs(firstRpcBlock - secondRpcBlock) < DIFFERENCE_THRESHOLD;
  } catch (error) {
    logger.error(`Error comparing the RPCs: ${error}`);
    return false;
  }
}

export async function getLatestBlock(rpc: string) {
  try {
    const provider = new ethers.JsonRpcProvider(rpc)
    return await provider.getBlockNumber();
  } catch (error) {
    logger.error(`Error fetching the latest block: ${error}`);
    return 0;
  }
}
