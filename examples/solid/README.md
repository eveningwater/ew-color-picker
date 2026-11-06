# Solid example

A minimal controlled wrapper around `ew-color-picker` using signals.

```bash
# from the repository root
pnpm install
pnpm --filter ew-color-picker-example-solid dev
```

`vite.config.js` aliases `@ew-color-picker/*` to `packages/*/src`, so this
example runs without building the packages first.

The pattern in [src/ColorField.tsx](./src/ColorField.tsx):

1. Create the picker in `onMount` and destroy it in `onCleanup`.
2. Call `onChange` from the `change` event.
3. Run `createEffect` on `props.value` and call `setColor`, guarded by a
   `syncing` flag so the external update does not loop back.
