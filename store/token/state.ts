import { ITokenState } from "~/store/token/types";

export const initState = (): ITokenState => ({
  userBalances: {},
  userAllowance: 0,
  userTransactions: [],
})

export default initState
