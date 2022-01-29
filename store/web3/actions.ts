import { ActionTree, Commit, Dispatch } from 'vuex'
import { IWeb3State } from '~/store/web3/state'
import { connectNode, connectWallet, disconnectWallet, fetchUserAddress } from '~/utils/web3'
import { Web3Mutations } from "~/store/web3/types";

export interface IWeb3Actions<C = Commit, D = Dispatch> {
  connectNode(): void,
  checkWalletConnection({ commit }: { commit: C } ): string,
  disconnectWallet({ commit, dispatch }: { commit: C, dispatch: D } ): string,
}

const actions: ActionTree<IWeb3State, IWeb3State> = {
  async connectNode () {
    const r = connectNode()
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
    return r.result.userAddress
  },
  async disconnectWallet({ commit, dispatch }) {
    const r = await disconnectWallet()
    if (r.ok) {
      commit(Web3Mutations.SET_USER_WALLET, '')
      commit(Web3Mutations.SET_IS_WALLET_CONNECTED, false)
      dispatch('token/resetUserBalances', null, { root: true })
      dispatch('token/resetTransactions', null, { root: true })
    }
  }
}

export default actions
