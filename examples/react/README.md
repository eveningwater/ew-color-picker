# React example

A minimal controlled wrapper around `ew-color-picker`.

```bash
# from the repository root
pnpm install
pnpm --filter ew-color-picker-example-react dev
```

`vite.config.js` aliases `@ew-color-picker/*` to `packages/*/src`, so this
example runs without building the packages first.

The pattern in [src/ColorField.tsx](./src/ColorField.tsx):

1. Create the picker once inside `useEffect` and destroy it on unmount.
2. Forward `change` events to React state.
3. Call `setColor` when the `value` prop changes, guarded by a `syncing` ref so
   the external update does not loop back into `onChange`.
