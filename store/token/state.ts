import Token from '~/classes/Token'

export interface ITokensMap {
  [key: string]: Token;
}

export interface ITokenState {
  tokensMap: ITokensMap
  userBalances: Array<IUserBalance>
  userAllowance: string
}

export interface IUserBalance {
  [key: string]: string
}

export const initState = (): ITokenState => ({
  tokensMap: {},
  userBalances: [],
  userAllowance: '',
})

export default initState
