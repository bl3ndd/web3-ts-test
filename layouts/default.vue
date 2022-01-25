<template>
  <div class="primary">
    <div class="primary__template template">
      <div class="template__header header">
        <div class="header__button">
          <b-button
            @click="connectMetamaskWallet"
          >
            Connect Wallet
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
import { connectWallet, getUserAddress } from "~/utils/web3";
import {mapActions, mapGetters} from "vuex";

export default MainVue.extend({
  computed: {
    ...mapGetters({
      userBalances: 'token/getUserBalances',
    })
  },
  methods: {
    ...mapActions({
      getUserBalances: 'token/getUserBalances',
    }),
    getUserAddress,
    async connectMetamaskWallet() {
        await connectWallet();
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
