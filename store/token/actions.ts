import { ActionTree, Commit, Dispatch } from 'vuex'
import {ITokenState, IUserBalances, TokenMutations} from '~/store/token/types'
import { getBalance, getUserAddress, fetchContractData, sendTransaction, fetchTransactionHistory } from '~/utils/web3'
import { shiftedBy } from '~/utils'
import { ERC20 } from '~/utils/abis'
import { TOKENS } from '~/utils/constants';
import { error } from "~/utils";

export interface ITokenActions<C = Commit, D = Dispatch> {
  getUserBalances({ commit, dispatch }: { commit: C, dispatch: D }): void
  resetUserBalances({ commit }: { commit: C }): void
  fetchUserAllowance({ commit }: { commit: C }, payload: { contractAddress: string, spenderAddress: string, decimals: string }): void
  approve({ commit, dispatch }: { commit: C, dispatch: D }, payload: { tokenAddress: string, spender: string, amount: string }): Promise<any>
  transfer({ commit, dispatch }: { commit: C, dispatch: D }, payload: { tokenAddress: string, recipient: string, amount: string }): Promise<any>
  getTransactions({ commit, dispatch }: { commit: C, dispatch: D }, payload: { address: string, symbol: string, decimals: string }): void
  resetTransactions({ commit }: { commit: C }): void
}

const actions: ActionTree<ITokenState, ITokenState> & ITokenActions = {
  async getUserBalances({ commit, dispatch }) {
    try {
      const balances: IUserBalances = {}
      for (let token of TOKENS) {
        const resp = await getBalance(token.address, getUserAddress());
        if(!resp.ok) {
          dispatch('modals/showToast', {text: 'You need to connect your wallet'}, {root: true})
          return error(0)
        }
        balances[token.symbol] = shiftedBy(resp.result, token.decimals)
      }
      commit(TokenMutations.SET_USER_BALANCES, balances)
    } catch (e) {
      return error(0)
    }
  },

  resetUserBalances({ commit }) {
    commit(TokenMutations.SET_USER_BALANCES, {})
  },

  async fetchUserAllowance({ commit }, { contractAddress, spenderAddress, decimals }) {
    const resp = await fetchContractData('allowance', ERC20, contractAddress, [getUserAddress(), spenderAddress]);
    if (resp.ok) {
      commit(TokenMutations.SET_USER_ALLOWANCE, shiftedBy(resp.result, decimals, 0));
    }
  },

  async approve({ commit, dispatch }, { tokenAddress, spender, amount }) {
    const resp = await sendTransaction('approve', ERC20, tokenAddress, [spender, amount]);
    if (!resp.ok) {
      dispatch('modals/showToast', {text: 'Error'}, {root: true})
    }
  },

  async transfer({ commit, dispatch }, { tokenAddress, recipient, amount }) {
    const resp = await sendTransaction('transfer', ERC20, tokenAddress, [recipient, amount]);
    if (!resp.ok) {
      dispatch('modals/showToast', {text: 'Error'}, {root: true})
    }
  },

  async getTransactions({ commit, dispatch }, { address, symbol, decimals }) {
    const resp = await fetchTransactionHistory(address, symbol, decimals)
    if(resp.ok) {
      commit(TokenMutations.SET_USER_TRANSACTIONS, resp.result)
    } else {
      dispatch('modals/showToast', {text: 'You need to connect your wallet'}, {root: true})
    }
  },

  resetTransactions({ commit }) {
    commit(TokenMutations.SET_USER_TRANSACTIONS, [])
  }
}

export default actions
