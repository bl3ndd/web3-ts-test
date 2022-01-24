export interface ILoaderState {
  isLoading: boolean,
  loaderStatusText: string,
  isBgHider: boolean,
}

export const initState = (): ILoaderState => ({
  isLoading: false,
  loaderStatusText: 'Loading',
  isBgHider: true
})

export default initState
