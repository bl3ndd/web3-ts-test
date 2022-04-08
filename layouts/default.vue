<template>
  <div class="primary">
    <div class="primary__template template">
      <div class="template__header header">
        <div class="header__button">
          <b-button
            v-if="!isWalletConnected"
            @click="connectWallet"
          >
            Connect Wallet
          </b-button>
          <b-button
            v-else
            @click="disconnectWallet"
          >
            Disconnect Wallet
          </b-button>
        </div>
      </div>
      <div class="template__content">
        <nuxt />
      </div>
      <div class="template__footer">
        Footer
      </div>
    </div>
    <base-modal-container />
    <loader-screen />
  </div>
</template>
<script lang="ts">
import { mapActions, mapGetters } from 'vuex';
import MainVue from '~/mixins/MainVue';
import { getUserAddress } from '~/utils/web3';

export default MainVue.extend({
  computed: {
    ...mapGetters({
      userBalances: 'token/getUserBalances',
      userAddress: 'web3/getUserWallet',
      isWalletConnected: 'web3/getIsConnected',
    }),
  },
  async mounted() {
    await this.checkWalletConnection();
    if (this.isWalletConnected) {
      await this.getUserBalances();
    }
  },
  methods: {
    ...mapActions({
      getUserBalances: 'token/getUserBalances',
      connectWalletAction: 'web3/connectWallet',
      checkWalletConnection: 'web3/checkWalletConnection',
      disconnectWallet: 'web3/disconnectWallet',
    }),
    getUserAddress,
    async connectWallet() {
      this.SetLoader(true);
      await this.checkWalletConnection();
      await this.connectWalletAction();
      await this.getUserBalances();
      this.SetLoader(false);
    },
  },
});
</script>
<style lang="scss" scoped>
.primary {
  height: 100vh;
  overflow-y: auto;
  &__template {
    height: 100%;
    display: grid;
    grid-template-rows: 100px 1fr auto;
  }
}
.template {
  height: 100%;
  min-height: 100vh;
  overflow: auto;
  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
}
.header {
  @include container;
  margin: auto;
  display: flex;
  align-items: center;
  &__button {
    width: fit-content;
    margin: 0 0 0 auto;
  }
}
</style>
