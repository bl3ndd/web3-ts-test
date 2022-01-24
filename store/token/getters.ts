import { GetterTree } from 'vuex'
import {ITokensMap, ITokenState, IUserBalance} from '~/store/token/state'

export interface ITokenGetter {
  getTokensMap: ITokensMap;
  getTokensKeys: string[];
  getDecimalsByAddress: (address: string) => string
}

const getters: GetterTree<ITokenState, ITokenState> = {
  getTokensMap: (state): ITokensMap => state.tokensMap,
  getTokensKeys: (state): Array<string> => Object.keys(state.tokensMap),
  getDecimalsByAddress: state => (address: string): string => (state.tokensMap[address].decimals || ''),

  getUserBalances: (state): Array<IUserBalance> => state.userBalances,
  getUserAllowance: (state): string => state.userAllowance
}

export default getters
