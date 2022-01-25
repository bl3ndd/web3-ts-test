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
      <b-form-select
        v-model="selectedToken"
        @change="fetchTransaction(selectedToken)"
      >
        <template #first>
          <b-form-select-option :value="null" disabled>-- Please select a token --</b-form-select-option>
        </template>
        <b-form-select-option
          v-for="token in userBalances"
          :key="token.address"
          :value="token"
        >
          {{ token.symbol }}
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
        @click="fetchUserAllowance"
      >
        Get Allowance
      </b-button>
      <b-button
        @click="approve"
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
        <div
          v-for="(transaction, index) in userTransactions"
          :key="index"
          class="table__row">
          <div class="table__cell cell">
            <div class="cell__title cell__title_bold">
              Type
            </div>
            <div class="cell__description">
              {{ transaction.type }}
            </div>
          </div>
          <div class="table__cell cell">
            <div class="cell__title cell__title_bold">
              From
            </div>
            <div class="cell__description">
              {{ transaction.from }}
            </div>
          </div>
          <div class="table__cell cell">
            <div class="cell__title cell__title_bold">
              To
            </div>
            <div class="cell__description">
              {{ transaction.to }}
            </div>
          </div>
          <div class="table__cell cell">
            <div class="cell__title cell__title_bold">
              Amount
            </div>
            <div class="cell__description">
              {{ transaction.amount }} {{ transaction.symbol }}
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
import { IUserToken } from "~/store/token/types";

export default MainVue.extend({
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
      userAllowance: 'token/getUserAllowance',
      userTransactions: 'token/getUserTransactions',
    })
  },
  methods: {
    ...mapActions({
      fetchUserAllowanceAction: 'token/fetchUserAllowance',
      connectNode: 'web3/connectNode',
      connectWallet: 'web3/connectWallet',
      approveAction: 'token/approve',
      transferAction: 'token/transfer',
      fetchTransactionsAction: 'token/getTransactions',
    }),
    approve() {
      this.SetLoader(true)
      const amount = shiftedBy(this.amount, this.selectedToken.decimals, 0)
      this.approveAction({ tokenAddress: this.selectedToken.address ,spender: this.recipientAddress, amount })
      this.SetLoader(false)
    },
    fetchUserAllowance() {
      this.SetLoader(true)
      this.fetchUserAllowanceAction({ contractAddress: this.selectedToken.address, spenderAddress: this.recipientAddress })
      this.SetLoader(false)
    },
    transfer() {
      this.SetLoader(true)
      const amount = shiftedBy(this.amount, this.selectedToken.decimals, 0)
      this.transferAction({ tokenAddress: this.selectedToken.address, recipient: this.recipientAddress, amount })
      this.SetLoader(false)
    },
    async fetchTransaction(selectedToken: IUserToken) {
      this.SetLoader(true)
      await this.fetchTransactionsAction(selectedToken)
      this.SetLoader(false)
    }
  }
});

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
      display: grid;
      grid-template-columns: 1fr 3fr 3fr 1fr;
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
