import { GetterTree } from 'vuex'
import {ArrayOfUserBalance, ITokenState, ITransaction, IUserBalances} from '~/store/token/types'

export interface ITokenGetters<S = ITokenState> {
  getUserBalances(state: S): IUserBalances,
  getUserAllowance(state: S): number,
  getUserTransactions(state: S): Array<ITransaction>,
}

export type TokenGetterReturnTypes = {
  [F in keyof ITokenGetters]: ReturnType<(ITokenGetters[F])>
}

const getters: GetterTree<ITokenState, ITokenGetters> & ITokenGetters = {
  getUserBalances: (state) => state.userBalances,
  getUserAllowance: (state) => state.userAllowance,
  getUserTransactions: (state) => state.userTransactions,
}

export default getters
