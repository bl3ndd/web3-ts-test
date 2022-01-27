import {ActionTree, createLogger} from 'vuex'
import { IWeb3State } from '~/store/web3/state'
import {connectNode, connectWallet, disconnectWallet, fetchUserAddress} from '~/utils/web3'
import {Web3Mutations} from "~/store/web3/types";

const actions: ActionTree<IWeb3State, IWeb3State> = {
  async connectNode ({ dispatch }) {
    const r = connectNode()
    await dispatch('token/fetchCommonDataToken', null, { root: true })
    return r
  },
  async connectWallet ({ commit }) {
    const r = await connectWallet()
    if (!r.ok) {
      console.log(r)
      return r
    }
    await commit(Web3Mutations.SET_USER_WALLET, r.result)
    return r
  },
  async checkWalletConnection( { commit } ) {
    const r = await fetchUserAddress()
    if (r.ok && r.result.userAddress) {
      commit(Web3Mutations.SET_IS_WALLET_CONNECTED, true)
    }
  },
  async disconnectUserWallet({ commit }) {
    const r = await disconnectWallet()
    if (r.ok) {
      commit(Web3Mutations.SET_USER_WALLET, '')
    }
  }
}

export default actions
