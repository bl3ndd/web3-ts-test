import { GetterTree } from 'vuex';
import { IWeb3State } from '~/store/web3/state';

export interface IWeb3Getters<S = IWeb3State> {
  getIsConnected(state: S): boolean,
  getUserWallet(state: S): string
}

const getters: GetterTree<IWeb3State, IWeb3State> & IWeb3Getters = {
  getIsConnected: (state): boolean => state.isWalletConnected,
  getUserWallet: (state): string => state.userWallet,
};

export default getters;
