<template>
  <div class="content">
    <div class="content__wrapper">
      <b-input-group
        class="content__input"
        prepend="Amount"
      >
        <b-form-input
          v-model="amount"
        />
      </b-input-group>
      <b-form-select v-model="selectedToken">
        <template #first>
          <b-form-select-option :value="null" disabled>-- Please select a token --</b-form-select-option>
        </template>
        <b-form-select-option
          v-for="token in userBalances"
          :key="token.address"
          :value="token"
        >
          {{ token.name }}
        </b-form-select-option>
      </b-form-select>
    </div>
    <b-input-group
      class="content__input content__input_mb-40"
      prepend="Address (recipient)"
    >
      <b-form-input
        v-model="recipientAddress"
      />
    </b-input-group>
    <div class="content__text text">
      <span class="text__title">Your balance:</span>
      <span class="text__value">{{ selectedToken.balance }} {{ selectedToken.name }}</span>
    </div>
    <div class="content__text text">
      <span class="text__title">Your Allowance:</span>
      <span class="text__value">{{ userAllowance }}</span>
    </div>
    <div class="content__buttons">
      <b-button
        @click="fetchUserAllowance({ contractAddress: selectedToken.address, spenderAddress: recipientAddress })"
      >
        Get Allowance
      </b-button>
      <b-button
        @click="approve({ tokenAddress: selectedToken.address ,spender: recipientAddress, amount })"
      >
        Approve</b-button>
      <b-button
        @click="transfer"
      >Transfer</b-button>
    </div>
    <div class="content__transactions transactions">
      <div class="transactions__title">
        Your Transactions
      </div>
      <div class="transactions__table table">
        <div class="table__row">
          <div class="table__cell cell">
            <div class="cell__title cell__title_bold">
              Type
            </div>
            <div class="cell__description">
              Transfer
            </div>
          </div>
          <div class="table__cell cell">
            <div class="cell__title cell__title_bold">
              From
            </div>
            <div class="cell__description">
              0x22eD84554DF3B5269B0761886eCC71a3731Dd06F
            </div>
          </div>
          <div class="table__cell cell">
            <div class="cell__title cell__title_bold">
              To
            </div>
            <div class="cell__description">
              0x22eD84554DF3B5269B0761886eCC71a3731Dd06F
            </div>
          </div>
          <div class="table__cell cell">
            <div class="cell__title cell__title_bold">
              Amount
            </div>
            <div class="cell__description">
              1000 USDT
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">

import { mapActions, mapGetters } from 'vuex'
import MainVue from '~/mixins/MainVue'
import { TOKENS } from '@/utils/constants.js'
import { shiftedBy } from '~/utils';

export default {
  data: () => ({
    recipient: '',
    amount: '',
    TOKENS,
    selectedToken: {},
    recipientAddress: '',
  }),
  async mounted () {
    await this.connectNode()
  },
  computed: {
    ...mapGetters({
      userBalances: 'token/getUserBalances',
      userAllowance: 'token/getUserAllowance'
    })
  },
  methods: {
    ...mapActions({
      fetchUserAllowance: 'token/fetchUserAllowance',
      connectNode: 'web3/connectNode',
      connectWallet: 'web3/connectWallet',
      approve: 'token/approve',
      transferAction: 'token/transfer'
    }),
    transfer() {
      const transformedAmount = shiftedBy(this.amount, this.selectedToken.decimals, 0)
      this.transferAction({ tokenAddress: this.selectedToken.address, recipient: this.recipientAddress, amount:  transformedAmount })
    }
  }
};

</script>
<style lang="scss" scoped>
.content {
  @include container;
  &__input {
    &_mb-40 {
      margin-bottom: 40px;
    }
  }
  &__text {
    margin-bottom: 40px;
  }
  &__buttons {
    display: flex;
    gap: 20px
  }
  &__wrapper {
    display: grid;
    grid-template-columns: 3fr 1fr;
    align-items: center;
    margin: 10px 0 40px 0;
  }
  .transactions {
    margin-top: 60px;
    &__title {
      margin-bottom: 20px;
      font-weight: 700;
    }
  }
  .table {
    &__row {
      display: flex;
      justify-content: space-between;
      background-color: #F3F5FA;
      padding: 10px 20px;
    }
    .cell {
      &__title {
        &_bold {
          font-weight: 700;
        }
      }
    }
  }
}
</style>
