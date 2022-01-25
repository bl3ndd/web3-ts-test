export interface IUserBalance {
  name: string,
  address: string,
  balance: number,
}

export interface IUserBalances {
  [key: string]: string
}

export type ArrayOfUserBalance = Array<IUserBalance>

export interface ITokenState {
  userBalances: IUserBalances
  userAllowance: number
  userTransactions: Array<ITransaction>
}

export interface IUserToken {
  symbol: string
  address: string
  decimals: string
  balance: number
}

export interface ITransaction {
  type: string
  from: string
  to: string
  amount: number
  symbol: string
}

export enum TokenMutations {
  SET_USER_BALANCES = 'SET_USER_BALANCES',
  SET_USER_ALLOWANCE = 'SET_USER_ALLOWANCE',
  SET_USER_TRANSACTIONS = 'SET_USER_TRANSACTIONS'
}
