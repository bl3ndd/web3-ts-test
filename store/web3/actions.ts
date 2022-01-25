import { ActionTree } from 'vuex'
import { IWeb3State } from '~/store/web3/state'
import { connectNode, connectWallet } from '~/utils/web3'

const actions: ActionTree<IWeb3State, IWeb3State> = {
  async connectNode ({ dispatch }) {
    const r = connectNode()
    await dispatch('token/fetchCommonDataToken', null, { root: true })
    return r
  },
  async connectWallet ({ dispatch }) {
    const r = await connectWallet()
    if (!r.ok) {
      console.log(r)
      return r
    }
    await dispatch('token/fetchUserDataToken', null, { root: true })
    return r
  }
}

export default actions
