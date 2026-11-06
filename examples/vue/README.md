# Vue example

A minimal controlled wrapper around `ew-color-picker` using `v-model`.

```bash
# from the repository root
pnpm install
pnpm --filter ew-color-picker-example-vue dev
```

`vite.config.js` aliases `@ew-color-picker/*` to `packages/*/src`, so this
example runs without building the packages first.

The pattern in [src/ColorField.vue](./src/ColorField.vue):

1. Create the picker in `onMounted` and destroy it in `onBeforeUnmount`.
2. Emit `update:modelValue` on `change`.
3. Call `setColor` inside a `watch` on `modelValue`, guarded by a `syncing`
   flag so the external update does not loop back.
