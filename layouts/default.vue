<template>
  <div class="primary">
    <div class="primary__template template">
      <div class="template__header header">
        <div class="header__button">
          <b-button
            v-if="!isWalletConnected"
            @click="connectMetamaskWallet"
          >
            Connect Wallet
          </b-button>
          <b-button
            v-else
            @click="disconnectUserWallet"
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
import MainVue from '~/mixins/MainVue'
import { getUserAddress } from "~/utils/web3";
import { mapActions, mapGetters } from 'vuex';

export default MainVue.extend({
  computed: {
    ...mapGetters({
      userBalances: 'token/getUserBalances',
      userAddress: 'web3/getUserWallet',
      isWalletConnected: 'web3/getIsConnected'
    })
  },
  async mounted() {
    await this.checkWalletConnection()
  },
  methods: {
    ...mapActions({
      getUserBalances: 'token/getUserBalances',
      connectWallet: 'web3/connectWallet',
      checkWalletConnection: 'web3/checkWalletConnection',
      disconnectUserWallet: 'web3/disconnectUserWallet'
    }),
    getUserAddress,
    async connectMetamaskWallet() {
        await this.connectWallet();
        await this.checkWalletConnection()
        await this.getUserBalances();
    },
  },
})
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
