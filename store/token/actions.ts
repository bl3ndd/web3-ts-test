import { ActionTree, Commit, Dispatch } from 'vuex'
import { ITokenState } from '~/store/token/types'
import { getBalance, getUserAddress, fetchContractData, sendTransaction, getDecimals, fetchTransactionHistory } from '~/utils/web3'
import { shiftedBy } from '~/utils'
import { ERC20 } from '~/utils/abis'
import { TOKENS } from '~/utils/constants';
import { TokenGetterReturnTypes } from "~/store/token/getters";
import { error } from "~/utils";

export interface ITokenActions<C = Commit, D = Dispatch, G = TokenGetterReturnTypes> {
  getUserBalances({ commit, dispatch }: { commit: C, dispatch: D }): void
  fetchUserAllowance({ commit }: { commit: C }, payload: { contractAddress: string, spenderAddress: string }): void
  approve({ commit, dispatch }: { commit: C, dispatch: D }, payload: { tokenAddress: string, spender: string, amount: string }): Promise<any> // TODO интерфейс для ответа
  transfer({ commit, dispatch }: { commit: C, dispatch: D }, payload: { tokenAddress: string, recipient: string, amount: string }): Promise<any> // TODO интерфейс для ответа
  getTransactions({ commit, dispatch }: { commit: C, dispatch: D }, payload: { address: string, symbol: string, decimals: string }): void
}

const actions: ActionTree<ITokenState, ITokenState> & ITokenActions = {
  async getUserBalances({ commit, dispatch }) {
    try {
      const balances = []
      for (let token of TOKENS) {
        const balance = await getBalance(token.address, 'getUserAddress()');
        const decimals = await getDecimals(token.address);
        balances.push({
          ...token,
          balance: shiftedBy(balance, decimals),
          decimals
        })
      }
      commit('SET_USER_BALANCES', balances)
    } catch (error) {
      dispatch('modals/showToast', { text: 'Error' }, { root: true })
    }
  },

  async fetchUserAllowance({ commit }, { contractAddress, spenderAddress }) {
    const resp = await fetchContractData('allowance', ERC20, contractAddress, [getUserAddress(), spenderAddress]);
    commit('SET_USER_ALLOWANCE', resp)
  },

  async approve({ commit, dispatch }, { tokenAddress, spender, amount }) {
    await sendTransaction('approve', ERC20, tokenAddress, [spender, amount]);
  },

  async transfer({ commit, dispatch }, { tokenAddress, recipient, amount }) {
    await sendTransaction('transfer', ERC20, tokenAddress, [recipient, amount]);
  },

  async getTransactions({ commit }, { address, symbol, decimals }) {
    console.log(address, symbol, decimals);
    const transactions = await fetchTransactionHistory(address, symbol, decimals)
    commit('SET_USER_TRANSACTIONS', transactions)
  }
}

export default actions
