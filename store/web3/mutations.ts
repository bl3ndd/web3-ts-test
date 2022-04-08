import { MutationTree } from 'vuex';
import { IWeb3State } from '~/store/web3/state';
import { Web3Mutations } from '~/store/web3/types';

export interface IWeb3Mutations<S = IWeb3State> {
  [Web3Mutations.SET_IS_WALLET_CONNECTED](state: S, payload: boolean): void,
  [Web3Mutations.SET_USER_WALLET](state: S, payload: string): void,
}

const mutations: MutationTree<IWeb3State> & IWeb3Mutations = {
  [Web3Mutations.SET_IS_WALLET_CONNECTED]: (state, payload: boolean) => (state.isWalletConnected = payload),
  [Web3Mutations.SET_USER_WALLET]: (state, payload: string) => (state.userWallet = payload),
};

export default mutations;
