import { MutationTree } from 'vuex'
import {ITokenState, IUserBalance, ITransaction, IUserBalances} from '~/store/token/types'
import { TokenMutations } from '@/store/token/types'

export interface ITokenMutations<S = ITokenState> {
  [TokenMutations.SET_USER_BALANCES](state: S, payload: IUserBalances): void,
  [TokenMutations.SET_USER_ALLOWANCE](state: S, payload: number): void,
  [TokenMutations.SET_USER_TRANSACTIONS](state: S, payload: Array<ITransaction>): void,
}

const mutations: MutationTree<ITokenState> & ITokenMutations = {
  [TokenMutations.SET_USER_BALANCES]: (state, payload) => (state.userBalances = payload),
  [TokenMutations.SET_USER_ALLOWANCE]: (state, payload) => (state.userAllowance = payload),
  [TokenMutations.SET_USER_TRANSACTIONS]: (state, payload) => (state.userTransactions = payload)
}

export default mutations
