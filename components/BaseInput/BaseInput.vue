<template>
  <div
    :class="fieldClass"
    class="base-field"
  >
    <validation-provider
      v-slot="{ errors }"
      :rules="rules"
      :vid="vid"
    >
      <label
        v-if="label"
        class="base-field__label"
      >
        {{ label }}
      </label>
      <div
        class="base-field__control"
      >
        <div class="base-field__slot">
          <slot name="left" />
        </div>
        <input
          :value="value"
          :type="type"
          class="base-field__input"
          :placeholder="placeholder"
          :readonly="isReadonly"
          :autocomplete="autocomplete"
          :name="name"
          :data-selector="selectors"
          @input="input"
          @keyup="keyup"
        >
        <span
          class="base-field__description"
        >{{ description }}</span>
        <div class="base-field__slot">
          <slot name="right" />
        </div>
      </div>
      <div
        class="base-field__error"
      >
        {{ errors[0] || errorText }}
      </div>
    </validation-provider>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    selectors: {
      type: String,
      require: true,
      default: 'SELECTOR',
    },
    label: {
      type: String,
      default: '',
    },
    rules: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    name: {
      type: String,
      default: '',
    },
    vid: {
      type: String,
      default: '',
    },
    errorText: {
      type: String,
      default: '',
    },
    isButton: {
      type: Boolean,
      default: false,
    },
    isShadow: {
      type: Boolean,
      default: false,
    },
    isWhite: {
      type: Boolean,
      default: false,
    },
    isReadonly: {
      type: Boolean,
      default: false,
    },
    autocomplete: {
      type: String,
      default: 'on',
    },
    value: {
      type: String,
      default: '',
    },
  },
  computed: {
    fieldClass() {
      const {
        isButton,
        isShadow,
        isWhite,
      } = this;
      return [
        {
          'base-field_shadow': isShadow,
          'base-field_is-button': isButton === true,
          'base-field_is-white': isWhite,
        },
      ];
    },
  },
  methods: {
    input(e: Event): void {
      this.$emit('input', e.target.value);
    },
    clear(): void {
      this.$emit('input', '');
    },
    keyup(e: Event): void {
      this.$emit('keyup', e);
    },
  },
};
</script>

<style lang="scss" scoped>
.base-field {
  position: relative;
  font-size: 16px;
  line-height: 145%;
  &__label {
    color: #282F39;
    min-height: 30px;
    margin-bottom: 0;
  }
  &__control {
    display: flex;
    align-items: center;
    width: 100%;
    height: 54px;
    padding: 0 16px;
    background: #F9F9F9;
    border-radius: 27px;
    font-size: 16px;
    line-height: 145%;
    border: 1px solid transparent;
    transition: 0.2s ease-in-out;
    &:focus-within {
      border-color:  rgba(19, 167, 130, 1);
    }
  }
  &__input {
    width: 100%;
    border: none;
    background: transparent;
    color: #282F39;
    &::placeholder {
      color: #A7AEB9;
    }
  }
  &__description {
    color: #A7AEB9;
    margin-right: 10px;
  }
  &__slot {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px 0;
    height: 100%;
    span {
      width: 25px;
      &:before {
        font-size: 26px;
      }
    }
  }
  &__error {
    display: flex;
    align-items: center;
    min-height: 20px;
    font-size: 12px;
    color: #EA3147;
    line-height: 100%;
  }
  &_is-button {
    .base-field {
      &__control {
        padding: 0 4px 0 16px;
      }
    }
  }
  &_shadow {
    .base-field {
      &__control {
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.07);
      }
    }
  }
  &_is-white {
    .base-field {
      &__control {
        background-color: #FFFFFF;
      }
    }
  }
  @include _380 {
    font-size: 14px;
    &__control {
      font-size: 14px;
      height: 44px;
    }
  }
}
</style>
