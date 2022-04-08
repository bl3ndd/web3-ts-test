export interface IWeb3State {
  isWalletConnected: boolean,
  userWallet: string,
}

export const initState = (): IWeb3State => ({
  isWalletConnected: false,
  userWallet: '',
});

export default initState;
