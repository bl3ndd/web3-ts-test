import { ActionTree } from 'vuex'
import { ITokensMap, ITokenState } from '~/store/token/state'
import Token from '~/classes/Token'
import { getBalance, getUserAddress, fetchContractData, sendTransaction, getDecimals } from '~/utils/web3'
import { shiftedBy } from '~/utils'
import { ERC20 } from '~/utils/abis'
import { ITokenGetter } from '~/store/token/getters'
import { TOKENS } from '~/utils/constants';


const actions: ActionTree<ITokenState, ITokenState> = {
  async getUserBalances({ commit }) {
    const balance = await getBalance('0xc13da4146d381c7032ca1ed6050024b4e324f4ef', getUserAddress());
    const balances = []
    for (let token of TOKENS) {
      const balance = await getBalance(token.address, getUserAddress());
      const decimals = await getDecimals(token.address);
      console.log(decimals)
      balances.push({
        ...token,
        balance: shiftedBy(balance, decimals)
      })
    }
    commit('SET_USER_BALANCES', balances)
  },

  async fetchUserAllowance({ commit }, { contractAddress, spenderAddress }) {
    const resp = await fetchContractData('allowance', ERC20, contractAddress, [getUserAddress(), spenderAddress]);
    commit('SET_USER_ALLOWANCE', resp)
  },

  async approve({ commit, dispatch }, { tokenAddress, spender, amount }) {
    dispatch('loader/setLoading', true, {root:true})
    await sendTransaction('approve', ERC20, tokenAddress, [spender, amount]);
    dispatch('loader/setLoading', false, {root:true})
  },

  async transfer({ commit, dispatch }, { tokenAddress, recipient, amount }) {
    dispatch('loader/setLoading', true, {root:true})
    await sendTransaction('transfer', ERC20, tokenAddress, [recipient, amount]);
    dispatch('loader/setLoading', true, {root:true})
  }
  // createTokensByAddresses ({ commit }, { addresses }: { addresses: Array<string>}) {
  //   const tokens = addresses.map(address => new Token({ address }))
  //   const map: ITokensMap = {}
  //   tokens.forEach((inst) => {
  //     map[inst.address] = inst
  //   })
  //   commit('SET_TOKENS_MAP', map)
  // },
  // async fetchCommonDataToken ({ getters, dispatch }:{ getters: ITokenGetter, dispatch: any }) {
  //   const { getTokensKeys: tokenKeys } = getters
  //   await Promise.all(tokenKeys.map((address: string) => dispatch('fetchCommonDataTokenByAddress', { address })))
  // },
  // async fetchCommonDataTokenByAddress ({ getters, commit }, { address }: { address: string}) {
  //   const { getTokensMap: tokensMap } = getters
  //   const token = tokensMap[address]
  //   const [
  //     symbol,
  //     decimals
  //   ] = await Promise.all([
  //     token.fetchContractData('symbol'),
  //     token.fetchContractData('decimals')
  //   ])
  //   commit('SET_TOKEN_PROPS', {
  //     address,
  //     value: {
  //       symbol,
  //       decimals
  //     }
  //   })
  // },
  // async fetchUserDataToken ({ getters, dispatch }:{ getters: ITokenGetter, dispatch: any }) {
  //   const { getTokensKeys: tokenKeys } = getters
  //   await Promise.all(tokenKeys.map((address: string) => dispatch('fetchUserDataTokenByAddress', { address })))
  // },
  // async fetchUserDataTokenByAddress ({ getters, commit }:{ getters: ITokenGetter, commit: any }, { address }: { address: string }) {
  //   const { getTokensMap: tokensMap } = getters
  //   const token = tokensMap[address]
  //   let balance = await token.fetchContractData('balanceOf', [getUserAddress()])
  //   balance = shiftedBy(balance, token.decimals, 1)
  //   commit('SET_TOKEN_PROPS', {
  //     address,
  //     value: {
  //       balance
  //     }
  //   })
  // },
  // async approve ({ getters }:{ getters: ITokenGetter }, { tokenAddress, recipient, amount }:{ tokenAddress: string, recipient: string, amount: string }) {
  //   try {
  //     const decimals = getters.getDecimalsByAddress(tokenAddress)
  //     const bigAmount = shiftedBy(amount, decimals)
  //     console.log(recipient, bigAmount)
  //
  //     // example get fee
  //     let fee = await getFee('approve', ERC20, tokenAddress, [recipient, bigAmount])
  //     fee = shiftedBy(fee, '18', 1)
  //     console.log(fee)
  //
  //     await Token.approve(tokenAddress, recipient, bigAmount)
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }
}

export default actions
