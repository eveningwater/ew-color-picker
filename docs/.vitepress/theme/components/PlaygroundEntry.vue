<script setup lang="ts">
import { withBase } from 'vitepress'

defineProps<{ label: string }>()
</script>

<template>
  <a class="playground-entry" :href="withBase('/playground.html')" target="_blank" rel="noopener">
    {{ label }} ↗
  </a>
</template>
