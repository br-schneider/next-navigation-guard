# nextjs-nav-guard

Navigation guard for Next.js App Router. Prevent users from accidentally leaving pages with unsaved changes.

This is a maintained fork of [`next-navigation-guard`](https://github.com/LayerXcom/next-navigation-guard) by [LayerX](https://github.com/LayerXcom), which is no longer actively maintained and incompatible with recent Next.js versions.

## What's different from the original?

- **Next.js 16.2+ support** — fixed runtime crash caused by `null` `history.state` in newer Next.js versions
- **Resilient internals** — fragile `next/dist/*` imports centralized behind try/catch fallbacks so the library won't crash if Next.js moves internal APIs
- **Fixed React hooks violation** — conditional `useContext` call that violated rules of hooks
- **Pages Router removed** — focused on App Router only (Pages Router is deprecated)
- **Better error messages** — actionable errors when the provider is missing, with code examples
- **Actively maintained** — compatible with Next.js 14, 15, and 16 (including 16.2+)

## Install

```bash
npm install nextjs-nav-guard
```

## Setup

Wrap your app with `NavigationGuardProvider` in your root layout:

```tsx
// app/layout.tsx
import { NavigationGuardProvider } from "nextjs-nav-guard";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavigationGuardProvider>{children}</NavigationGuardProvider>
      </body>
    </html>
  );
}
```

## Usage

### Simple: `window.confirm()`

```tsx
import { useNavigationGuard } from "nextjs-nav-guard";

function MyForm() {
  const [isDirty, setIsDirty] = useState(false);

  useNavigationGuard({
    enabled: isDirty,
    confirm: () => window.confirm("You have unsaved changes. Leave anyway?"),
  });

  return <form>{/* your form */}</form>;
}
```

### Custom dialog UI

If you want full control over the confirmation UI, omit the `confirm` callback. The hook returns `active`, `accept`, and `reject` to drive your own dialog:

```tsx
import { useNavigationGuard } from "nextjs-nav-guard";

function MyForm() {
  const [isDirty, setIsDirty] = useState(false);
  const guard = useNavigationGuard({ enabled: isDirty });

  return (
    <>
      <form>{/* your form */}</form>

      {guard.active && (
        <Dialog open>
          <p>You have unsaved changes. Leave anyway?</p>
          <button onClick={guard.reject}>Stay</button>
          <button onClick={guard.accept}>Leave</button>
        </Dialog>
      )}
    </>
  );
}
```

### Conditional guard with navigation type

The `enabled` option can be a function that receives the navigation type, letting you guard selectively:

```tsx
useNavigationGuard({
  enabled: ({ type }) => {
    // Only guard against link clicks and back/forward, not refresh
    return type !== "refresh" && type !== "beforeunload";
  },
  confirm: () => window.confirm("Discard changes?"),
});
```

## API

### `<NavigationGuardProvider>`

Wrap your app with this provider. It intercepts navigation at multiple levels:

- **Router methods** — `router.push()`, `router.replace()`, `router.refresh()`
- **Link clicks** — `<Link>` and `<a>` tag clicks
- **Browser navigation** — back/forward buttons, `history.go()`
- **Page unload** — tab close, `window.location` changes

### `useNavigationGuard(options)`

Register a navigation guard. Returns `{ active, accept, reject }`.

#### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `enabled` | `boolean \| (params) => boolean` | `true` | Whether the guard is active. Can be a function receiving `{ to, type }` |
| `confirm` | `(params) => boolean \| Promise<boolean>` | `undefined` | Sync or async confirmation callback. Return `true` to allow, `false` to block. If omitted, the hook uses async mode |
| `disableForTesting` | `boolean` | `false` | Makes the hook a complete no-op. No provider required. Use in tests and Storybook |

#### Return value

| Property | Type | Description |
|---|---|---|
| `active` | `boolean` | `true` when a navigation attempt is pending confirmation (async mode only) |
| `accept` | `() => void` | Allow the pending navigation |
| `reject` | `() => void` | Block the pending navigation |

#### Navigation params

The `enabled` function and `confirm` callback both receive:

| Property | Type | Description |
|---|---|---|
| `to` | `string` | The target URL |
| `type` | `"push" \| "replace" \| "refresh" \| "popstate" \| "beforeunload"` | How the navigation was triggered |

### `NavigationGuard` (type export)

The callback type, exported for convenience:

```tsx
import type { NavigationGuard } from "nextjs-nav-guard";

const myGuard: NavigationGuard = ({ to, type }) => {
  return window.confirm(`Navigate to ${to}?`);
};
```

## Migrating from `next-navigation-guard`

The API is identical. Just change the import:

```diff
- import { NavigationGuardProvider, useNavigationGuard } from "next-navigation-guard";
+ import { NavigationGuardProvider, useNavigationGuard } from "nextjs-nav-guard";
```

If you were using Pages Router, you'll need to switch to App Router — Pages Router support has been removed.

## Compatibility

| Next.js | React | Status |
|---|---|---|
| 14.x | 18, 19 | Supported |
| 15.x | 18, 19 | Supported |
| 16.0 - 16.2+ | 19 | Supported |

## License

MIT - Originally created by [LayerX Inc.](https://github.com/LayerXcom)
