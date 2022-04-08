import { ActionTree } from 'vuex';
import { IModalOptions, IModalsState } from '~/store/modals/state';

const actions: ActionTree<IModalsState, IModalsState> = {
  show({ commit }, payload: IModalOptions) {
    console.log(payload);
    commit('SET_IS_SHOW', true);
    commit('SET_CURRENT_MODAL_KEY', payload.key);
    commit('SET_OPTIONS', payload);
  },
  hide({ commit }) {
    commit('SET_IS_SHOW', false);
    commit('SET_CURRENT_MODAL_KEY', '');
    commit('SET_OPTIONS', {});
  },
  setUnclicable({ commit }) {
    commit('SET_UNCLOSABLE');
  },
  showToast(_, value) {
    // @ts-ignore
    const codeText = value?.code ? $nuxt.$t(`toasts.errors.${value.code}`) : $nuxt.$t('toasts.errors.0');
    // @ts-ignore
    this._vm.$bvToast.toast(value?.text || codeText, {
      // @ts-ignore
      title: value.title || 'Error',
      variant: value.variant || 'danger',
      solid: true,
      toaster: value.toaster || 'b-toaster-bottom-right',
      appendToast: value.appendToast || false,
      autoHideDelay: value.delay || 5000,
    });
  },
};

export default actions;
