<template>
  <div class="content">
    <validation-observer
      v-slot="{ handleSubmit }"
    >
      <div class="content__wrapper">
        <validation-provider
          v-slot="{ errors }"
          rules="numeric|required"
          name="Amount"
        >
          <b-form-input
            v-model="amount"
            placeholder="Enter amount of tokens"
          />
          <span
            class="content__error"
          >
            {{ errors[0] }}
          </span>
        </validation-provider>
        <validation-provider>
          <b-form-select
            v-model="selectedToken"
            @change="fetchTransaction(selectedToken)"
          >
            <template #first>
              <b-form-select-option :value="{}" disabled>
                -- Please select a token --
              </b-form-select-option>
            </template>
            <b-form-select-option
              v-for="token in TOKENS"
              :key="token.address"
              :value="token"
            >
              {{ token.symbol || '' }}
            </b-form-select-option>
          </b-form-select>
        </validation-provider>
      </div>
      <validation-provider
        v-slot="{ errors }"
        rules="validAddress|required"
        name="Recipient address"
      >
        <div class="content__field">
          <b-form-input
            v-model="recipientAddress"
            placeholder="Enter the recipient address"
          />
          <span class="content__error">
            {{ errors[0] }}
          </span>
        </div>
      </validation-provider>
      <div class="content__text text">
        <span class="text__title">Your balance:</span>
        <span class="text__value">{{ userBalances[selectedToken.symbol] || 0 }} {{ selectedToken.name }}</span>
      </div>
      <div class="content__text text">
        <span class="text__title">Your Allowance:</span>
        <span class="text__value">{{ userAllowance }}</span>
      </div>
      <div class="content__buttons">
        <b-button
          @click="handleSubmit(fetchUserAllowance)"
        >
          Get Allowance
        </b-button>
        <b-button
          @click="handleSubmit(approve)"
        >
          Approve
        </b-button>
        <b-button
          @click="handleSubmit(transfer)"
        >
          Transfer
        </b-button>
      </div>
    </validation-observer>
    <div class="content__transactions transactions">
      <div
        class="transactions__title"
      >
        Your Transactions
      </div>
      <div
        v-if="userTransactions.length"
        class="transactions__table table"
      >
        <div
          v-for="(transaction, index) in userTransactions"
          :key="index"
          class="table__row"
        >
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
      <div v-else>
        You don't have transactions
      </div>
    </div>
  </div>
</template>
<script lang="ts">

import { mapActions, mapGetters } from 'vuex';
import MainVue from '~/mixins/MainVue';
import { TOKENS } from '@/utils/constants.js';
import { shiftedBy } from '~/utils';
import { IUserToken } from '~/store/token/types';

export default MainVue.extend({
  data: () => ({
    recipient: '',
    amount: '',
    TOKENS,
    selectedToken: {},
    recipientAddress: '',
  }),
  async mounted() {
    await this.connectNode();
  },
  computed: {
    ...mapGetters({
      userBalances: 'token/getUserBalances',
      userAllowance: 'token/getUserAllowance',
      userTransactions: 'token/getUserTransactions',
    }),
  },
  methods: {
    ...mapActions({
      fetchUserAllowanceAction: 'token/fetchUserAllowance',
      connectNode: 'web3/connectNode',
      connectWallet: 'web3/connectWallet',
      approveAction: 'token/approve',
      transferAction: 'token/transfer',
      fetchTransactionsAction: 'token/getTransactions',
      getUserBalances: 'token/getUserBalances',
    }),
    async approve() {
      this.SetLoader(true);
      const amount = shiftedBy(this.amount, this.selectedToken.decimals, 0);
      await this.approveAction({
        tokenAddress: this.selectedToken.address,
        spender: this.recipientAddress,
        amount,
      });
      this.SetLoader(false);
    },
    async fetchUserAllowance() {
      this.SetLoader(true);
      await this.fetchUserAllowanceAction({
        contractAddress: this.selectedToken.address,
        spenderAddress: this.recipientAddress,
        decimals: this.selectedToken.decimals,
      });
      this.SetLoader(false);
    },
    async transfer() {
      this.SetLoader(true);
      const amount = shiftedBy(this.amount, this.selectedToken.decimals, 0);
      await this.transferAction({
        tokenAddress: this.selectedToken.address,
        recipient: this.recipientAddress,
        amount,
      });
      await this.getUserBalances();
      this.SetLoader(false);
    },
    async fetchTransaction(selectedToken: IUserToken) {
      this.SetLoader(true);
      await this.fetchTransactionsAction(selectedToken);
      this.SetLoader(false);
    },
  },
});

</script>
<style lang="scss" scoped>
.content {
  @include container;
  &__error {
    color: red;
  }
  &__field {
    margin-bottom: 40px;
  }
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
