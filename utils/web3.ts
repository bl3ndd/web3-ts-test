import Web3 from 'web3'
// @ts-ignore
import Web4 from '@cryptonteam/web4'
import BigNumber from 'bignumber.js'
import {output, error, IResponse, shiftedBy} from '~/utils/index'
import { ERC20 } from '~/utils/abis'
import {TOKENS} from "~/utils/constants";
import {createLogger} from "vuex";

const { IS_MAINNET } = process.env

let web3Wallet: any
let web3Guest: any
let web4: any
let userAddress: string
let chainId: number

BigNumber.config({ EXPONENTIAL_AT: 60 })

export const fetchContractData = async (method: string, abi: Array<any>, address: string, params?: Array<any>): Promise<any> => {
  try {
    const contract = new web3Guest.eth.Contract(abi, address)
    const resp = await contract.methods[method].apply(this, params).call()
    return output(resp)
  } catch (e) {
    return error(0)
  }
}

export const createInst = async (abi: Array<any>, address: string): Promise<any> => {
  const abs = web4.getContractAbstraction(abi)
  return await abs.getInstance(address)
}

export const connectNode = (): IResponse => {
  try {
    let bscUrl
    if (process.env.IS_MAINNET === 'true') {
      bscUrl = 'wss://mainnet.infura.io/ws/v3/4f9234a0518644ef9b62fb4d4ff53df2'
    } else {
      bscUrl = 'wss://rinkeby.infura.io/ws/v3/4f9234a0518644ef9b62fb4d4ff53df2'
    }
    const provider = new Web3.providers.WebsocketProvider(bscUrl)
    web3Guest = new Web3(provider)
    return output(web3Guest)
  } catch (e) {
    return error(500, 'connection error', e)
  }
}

export const sendTransaction = async (method: string, abi: any[], address: string, params?: string[]): Promise<any> => {
  try {
    const inst = new web3Wallet.eth.Contract(abi, address)
    const data = inst.methods[method].apply(null, params).encodeABI()
    const r = await web3Wallet.eth.sendTransaction({
      to: address,
      data,
      from: userAddress
    })
    return output(r)
  } catch (e) {
    return error(0)
  }
}

export const fetchUserAddress = async (): Promise<IResponse> => {
  try {
    // @ts-ignore
    const { ethereum } = window
    if (!ethereum) {
      return error(449, 'metamask is not installed')
    }
    web3Wallet = new Web3(ethereum)
    userAddress = await web3Wallet.eth.getCoinbase()

    return output({ userAddress, ethereum });
  } catch (e) {
    return error(0, 'error while wallet connection')
  }
}

export const connectWallet = async (): Promise<IResponse> => {
  try {
    const r = await fetchUserAddress();
    const { ethereum } = r.result;
    if (!userAddress) {
      await ethereum.enable()
      userAddress = await web3Wallet.eth.getCoinbase()
    }
    chainId = await web3Wallet.eth.net.getId()
    if (IS_MAINNET !== 'true' && +chainId !== 4) {
      return error(403, 'invalid chain, change to rinkeby')
    } else if (IS_MAINNET === 'true' && +chainId !== 1) {
      return error(403, 'invalid chain, change to mainnet')
    }
    web4 = new Web4()
    web4.setProvider(ethereum, userAddress)

    return output(userAddress)
  } catch (err) {
    return error(4001, 'connection error', err)
  }
}

export const disconnectWallet = () => {
  try {
    web3Wallet = undefined
    userAddress = ''
    return output()
  } catch (e) {
    return error(0, 'some error')
  }
}

export const getFee = async (method: string, abi: Array<any>, address: string, params?: Array<any>): Promise<any> => {
  try {
    const contract = new web3Guest.eth.Contract(abi, address)
    const [
      gasPrice,
      estimateGas
    ] = await Promise.all([
      web3Guest.eth.getGasPrice(),
      contract.methods[method].apply(this, params).estimateGas({ from: userAddress })
    ])
    return gasPrice * estimateGas
  } catch (e) {
    console.log(e)
    return ''
  }
}

export const getBalance = async (address: string, userAddress: string): Promise<any> => {
  // try catch ???? ?????????? ??.??. ?????????? ?????? ?????????????? ??????????????, ?? ???????????? ???????????????????????? ?? fetchContractData
  const resp = await fetchContractData('balanceOf', ERC20, address, [userAddress]);
  if (resp.ok) {
    return output(resp.result)
  }
  return error(0)
}

export const getDecimals = async (address: string): Promise<any> => {
  const resp = await fetchContractData('decimals', ERC20, address);
  if(resp.ok) {
    return output(resp.result)
  }
  return error(0)
}

export const fetchTransactionHistory = async (token: string, symbol: string, decimals: string) => {
  try {
    const Contract = new web3Wallet.eth.Contract(ERC20, token);
    const history = await Contract.getPastEvents('AllEvents', { fromBlock: 0, toBlock: 'latest' });
    const transactions = []
    for (let item of history) {
      const owner = item.returnValues?.owner?.toLowerCase() || '';
      const spender = item.returnValues?.spender?.toLowerCase() || '';
      const from = item.returnValues?.from?.toLowerCase() || '';
      const to = item.returnValues?.to?.toLowerCase() || '';
      if (from.toLowerCase() === userAddress || to.toLowerCase() === userAddress
        || owner.toLowerCase() === userAddress || spender.toLowerCase() === userAddress
      ) {
        transactions.push({
          type: item.event,
          from: item.returnValues.from || item.returnValues.owner,
          to: item.returnValues.to || item.returnValues.spender,
          amount: new BigNumber(item.returnValues.value).shiftedBy(-decimals).toString(),
          symbol,
        });
      }
    }
    return output(transactions);
  } catch (e) {
    return error(0)
  }
};

export const getWeb3 = (): any => web3Wallet || web3Guest

export const getUserAddress = (): string => userAddress

export const getChainId = (): number => chainId

export const isValidAddress = (address: string): boolean => web3Wallet.utils.isAddress(address)
