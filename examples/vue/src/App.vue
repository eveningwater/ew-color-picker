<script setup lang="ts">
import { ref } from 'vue';
import ColorField from './ColorField.vue';
import './app.css';

const color = ref('#6366f1');
const presets = ['#6366f1', '#ef4444', '#22c55e', '#f59e0b'];
</script>

<template>
  <main class="app">
    <h1>ew-color-picker + Vue</h1>
    <p class="lead">
      A controlled ColorField component with v-model: picker events update
      state, and state changes flow back into the picker.
    </p>

    <div class="field">
      <ColorField v-model="color" />
      <span class="value">{{ color }}</span>
    </div>

    <div class="actions">
      <button
        v-for="preset in presets"
        :key="preset"
        type="button"
        @click="color = preset"
      >
        {{ preset }}
      </button>
      <button type="button" @click="color = '#6366f1'">Reset</button>
    </div>
  </main>
</template>
