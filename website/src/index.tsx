import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { raw } from "hono/html";

const app = new Hono();

app.use("/favicon.svg", serveStatic({ root: "./public" }));

app.get("*", jsxRenderer(({ children }) => {
  return (
    <html lang="en" class="dark">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>nextjs-nav-guard</title>
        <meta name="description" content="Prevent accidental navigation away from unsaved changes in Next.js App Router" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script src="https://cdn.tailwindcss.com"></script>
        {raw(`<script>
          tailwind.config = {
            darkMode: 'class',
            theme: {
              extend: {
                fontFamily: {
                  mono: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'monospace'],
                },
                colors: {
                  surface: '#0c0c0c',
                },
              },
            },
          }
        </script>`)}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/styles/github-dark-dimmed.min.css" />
        <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/highlight.min.js"></script>
        <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/languages/typescript.min.js"></script>
        <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/languages/xml.min.js"></script>
        <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/languages/diff.min.js"></script>
        <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/languages/bash.min.js"></script>
        {raw(`<style type="text/tailwindcss">
          html { scroll-behavior: smooth; }
          body { font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace; }
          pre { @apply border border-white/[0.08] rounded-none; }
          pre code.hljs { border-radius: 0; padding: 1rem 1.25rem; font-size: 13px; line-height: 1.6; }
          td code, li code, p code {
            @apply text-[0.85em] px-1.5 py-0.5 bg-white/[0.06] border border-white/[0.08] rounded-none text-gray-300 font-mono;
          }
        </style>
        <script>
          document.addEventListener('DOMContentLoaded', () => {
            hljs.highlightAll();
            const btn = document.getElementById('menu-btn');
            const menu = document.getElementById('mobile-menu');
            if (btn && menu) {
              btn.addEventListener('click', () => menu.classList.toggle('hidden'));
              menu.querySelectorAll('a').forEach(a =>
                a.addEventListener('click', () => menu.classList.add('hidden'))
              );
            }
          });
        </script>`)}
      </head>
      <body class="bg-surface text-gray-400 antialiased font-mono text-sm leading-relaxed">
        {/* Navigation */}
        <nav class="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-white/[0.06]">
          <div class="max-w-3xl mx-auto px-6 h-12 flex items-center justify-between">
            <a href="/" class="text-sm text-gray-300 hover:text-white transition-colors">
              nextjs-nav-guard
            </a>
            <div class="hidden md:flex items-center gap-5">
              <a href="#install" class="text-xs text-gray-500 hover:text-gray-300 transition-colors">install</a>
              <a href="#usage" class="text-xs text-gray-500 hover:text-gray-300 transition-colors">usage</a>
              <a href="#api" class="text-xs text-gray-500 hover:text-gray-300 transition-colors">api</a>
              <a href="https://github.com/br-schneider/nextjs-nav-guard" target="_blank" class="text-xs text-gray-500 hover:text-gray-300 transition-colors">github</a>
            </div>
            <button id="menu-btn" class="md:hidden p-1 text-gray-500 hover:text-gray-300" aria-label="Toggle menu">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
          <div id="mobile-menu" class="hidden md:hidden border-t border-white/[0.06] bg-surface/95 backdrop-blur-md">
            <div class="px-6 py-3 space-y-1">
              <a href="#install" class="block py-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors">install</a>
              <a href="#usage" class="block py-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors">usage</a>
              <a href="#api" class="block py-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors">api</a>
              <a href="https://github.com/br-schneider/nextjs-nav-guard" target="_blank" class="block py-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors">github</a>
            </div>
          </div>
        </nav>

        <main class="max-w-3xl mx-auto px-6 pt-20">
          {children}
        </main>

        <footer class="max-w-3xl mx-auto px-6 py-10 mt-8 text-center text-xs text-gray-600">
          <p>MIT License — Originally created by <a href="https://github.com/LayerXcom" target="_blank" class="text-gray-500 hover:text-gray-300 transition-colors">LayerX Inc.</a></p>
        </footer>
      </body>
    </html>
  );
}));

app.get("/", (c) => {
  return c.render(
    <>
      {/* Hero */}
      <section class="py-16 md:py-24">
        <h1 class="text-2xl md:text-3xl text-gray-200 tracking-tight">
          nextjs-nav-guard
        </h1>
        <p class="mt-3 text-gray-500 max-w-lg leading-relaxed">
          Prevent accidental navigation away from unsaved changes in Next.js App Router.
          Zero config. Two lines of code.
        </p>
        <div class="mt-5 flex gap-2 flex-wrap">
          <img alt="npm version" src="https://img.shields.io/npm/v/nextjs-nav-guard" class="h-5" />
          <img alt="license" src="https://img.shields.io/npm/l/nextjs-nav-guard" class="h-5" />
        </div>
        <div class="mt-6 flex gap-4 text-xs">
          <a href="#install" class="text-gray-300 hover:text-white transition-colors">[get started]</a>
          <a href="https://github.com/br-schneider/nextjs-nav-guard" target="_blank" class="text-gray-500 hover:text-gray-300 transition-colors">[github]</a>
        </div>
      </section>

      {/* Install */}
      <section id="install" class="py-10 md:py-14">
        <h2 class="text-sm text-gray-300 mb-4">Install</h2>
        <pre><code class="language-bash">npm install nextjs-nav-guard</code></pre>
      </section>

      {/* Features */}
      <section class="py-10 md:py-14">
        <h2 class="text-sm text-gray-300 mb-4">What it intercepts</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-px border border-white/[0.08] bg-white/[0.08]">
          <div class="bg-surface p-4">
            <h4 class="text-gray-300 text-xs mb-1">Router methods</h4>
            <p class="text-gray-500 text-xs"><code>router.push()</code>, <code>router.replace()</code>, <code>router.refresh()</code></p>
          </div>
          <div class="bg-surface p-4">
            <h4 class="text-gray-300 text-xs mb-1">Link clicks</h4>
            <p class="text-gray-500 text-xs">Next.js <code>&lt;Link&gt;</code> and plain <code>&lt;a&gt;</code> tags</p>
          </div>
          <div class="bg-surface p-4">
            <h4 class="text-gray-300 text-xs mb-1">Browser navigation</h4>
            <p class="text-gray-500 text-xs">Back/forward buttons, <code>history.go()</code></p>
          </div>
          <div class="bg-surface p-4">
            <h4 class="text-gray-300 text-xs mb-1">Page unload</h4>
            <p class="text-gray-500 text-xs">Tab close, <code>window.location</code> changes</p>
          </div>
        </div>
      </section>

      {/* Usage */}
      <section id="usage" class="py-10 md:py-14">
        <h2 class="text-sm text-gray-300 mb-4">Quick Start</h2>
        <p class="text-gray-500 mb-3">1. Wrap your app with the provider in your root layout:</p>
        <pre><code class="language-tsx">{`// app/layout.tsx
import { NavigationGuardProvider } from "nextjs-nav-guard";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavigationGuardProvider>{children}</NavigationGuardProvider>
      </body>
    </html>
  );
}`}</code></pre>

        <p class="text-gray-500 mt-8 mb-4">2. Use the hook in any component with unsaved changes:</p>
        <pre><code class="language-tsx">{`import { useNavigationGuard } from "nextjs-nav-guard";

function MyForm() {
  const [isDirty, setIsDirty] = useState(false);

  useNavigationGuard({
    enabled: isDirty,
    confirm: () => window.confirm("You have unsaved changes. Leave anyway?"),
  });

  return <form>{/* your form */}</form>;
}`}</code></pre>
        <p class="text-gray-500 mt-4">That's it. Two imports, two lines of setup.</p>
      </section>

      {/* Custom Dialog */}
      <section id="custom-dialog" class="py-10 md:py-14">
        <h2 class="text-sm text-gray-300 mb-4">Custom Dialog UI</h2>
        <p class="text-gray-500 mb-3">
          Omit the <code>confirm</code> callback to use async mode. The hook returns <code>active</code>, <code>accept</code>,
          and <code>reject</code> so you can render your own confirmation dialog:
        </p>
        <pre><code class="language-tsx">{`import { useNavigationGuard } from "nextjs-nav-guard";

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
}`}</code></pre>
      </section>

      {/* Conditional */}
      <section id="conditional" class="py-10 md:py-14">
        <h2 class="text-sm text-gray-300 mb-4">Conditional Guard</h2>
        <p class="text-gray-500 mb-3">
          The <code>enabled</code> option accepts a function that receives the navigation type,
          so you can guard selectively:
        </p>
        <pre><code class="language-tsx">{`useNavigationGuard({
  enabled: ({ type }) => {
    // Only guard against link clicks and back/forward, not refresh
    return type !== "refresh" && type !== "beforeunload";
  },
  confirm: () => window.confirm("Discard changes?"),
});`}</code></pre>
      </section>

      {/* API Reference */}
      <section id="api" class="py-10 md:py-14">
        <h2 class="text-sm text-gray-300 mb-4">API Reference</h2>

        <h3 class="text-sm text-gray-300 mt-8 mb-2"><code>&lt;NavigationGuardProvider&gt;</code></h3>
        <p class="text-gray-500 mb-3">
          Wrap your app with this provider in your root layout. No props required other than <code>children</code>.
          It sets up interception of all navigation methods listed above.
        </p>

        <h3 class="text-sm text-gray-300 mt-8 mb-2"><code>useNavigationGuard(options)</code></h3>
        <p class="text-gray-500 mb-3">Register a navigation guard. Returns an object with <code>active</code>, <code>accept</code>, and <code>reject</code>.</p>

        <h4 class="text-xs text-gray-400 mt-6 mb-2">Options</h4>
        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead>
              <tr class="border-b border-white/[0.06]">
                <th class="py-2.5 pr-4 text-gray-500 font-normal">Option</th>
                <th class="py-2.5 pr-4 text-gray-500 font-normal">Type</th>
                <th class="py-2.5 pr-4 text-gray-500 font-normal">Default</th>
                <th class="py-2.5 text-gray-500 font-normal">Description</th>
              </tr>
            </thead>
            <tbody class="text-gray-400">
              <tr class="border-b border-white/[0.04]">
                <td class="py-2.5 pr-4"><code>enabled</code></td>
                <td class="py-2.5 pr-4"><code>boolean | (params) =&gt; boolean</code></td>
                <td class="py-2.5 pr-4"><code>true</code></td>
                <td class="py-2.5">Whether the guard is active. Can be a function receiving navigation params.</td>
              </tr>
              <tr class="border-b border-white/[0.04]">
                <td class="py-2.5 pr-4"><code>confirm</code></td>
                <td class="py-2.5 pr-4"><code>(params) =&gt; boolean | Promise&lt;boolean&gt;</code></td>
                <td class="py-2.5 pr-4"><code>undefined</code></td>
                <td class="py-2.5">Confirmation callback. Return <code>true</code> to allow, <code>false</code> to block. If omitted, uses async mode.</td>
              </tr>
              <tr class="border-b border-white/[0.04]">
                <td class="py-2.5 pr-4"><code>disableForTesting</code></td>
                <td class="py-2.5 pr-4"><code>boolean</code></td>
                <td class="py-2.5 pr-4"><code>false</code></td>
                <td class="py-2.5">Makes the hook a no-op. No provider required. Use in tests and Storybook.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 class="text-xs text-gray-400 mt-6 mb-2">Return Value</h4>
        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead>
              <tr class="border-b border-white/[0.06]">
                <th class="py-2.5 pr-4 text-gray-500 font-normal">Property</th>
                <th class="py-2.5 pr-4 text-gray-500 font-normal">Type</th>
                <th class="py-2.5 text-gray-500 font-normal">Description</th>
              </tr>
            </thead>
            <tbody class="text-gray-400">
              <tr class="border-b border-white/[0.04]">
                <td class="py-2.5 pr-4"><code>active</code></td>
                <td class="py-2.5 pr-4"><code>boolean</code></td>
                <td class="py-2.5"><code>true</code> when a navigation attempt is pending confirmation (async mode only).</td>
              </tr>
              <tr class="border-b border-white/[0.04]">
                <td class="py-2.5 pr-4"><code>accept</code></td>
                <td class="py-2.5 pr-4"><code>() =&gt; void</code></td>
                <td class="py-2.5">Allow the pending navigation.</td>
              </tr>
              <tr class="border-b border-white/[0.04]">
                <td class="py-2.5 pr-4"><code>reject</code></td>
                <td class="py-2.5 pr-4"><code>() =&gt; void</code></td>
                <td class="py-2.5">Block the pending navigation.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 class="text-xs text-gray-400 mt-6 mb-2">Navigation Params</h4>
        <p class="text-gray-500 mb-3">Both <code>enabled</code> (when a function) and <code>confirm</code> receive:</p>
        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead>
              <tr class="border-b border-white/[0.06]">
                <th class="py-2.5 pr-4 text-gray-500 font-normal">Property</th>
                <th class="py-2.5 pr-4 text-gray-500 font-normal">Type</th>
                <th class="py-2.5 text-gray-500 font-normal">Description</th>
              </tr>
            </thead>
            <tbody class="text-gray-400">
              <tr class="border-b border-white/[0.04]">
                <td class="py-2.5 pr-4"><code>to</code></td>
                <td class="py-2.5 pr-4"><code>string</code></td>
                <td class="py-2.5">The target URL.</td>
              </tr>
              <tr class="border-b border-white/[0.04]">
                <td class="py-2.5 pr-4"><code>type</code></td>
                <td class="py-2.5 pr-4"><code>"push" | "replace" | "refresh" | "popstate" | "beforeunload"</code></td>
                <td class="py-2.5">How the navigation was triggered.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 class="text-xs text-gray-400 mt-6 mb-2">Type Exports</h4>
        <pre><code class="language-typescript">{`import type {
  NavigationGuard,         // (params: NavigationGuardParams) => boolean | Promise<boolean>
  NavigationGuardOptions,  // { enabled?, confirm?, disableForTesting? }
  NavigationGuardParams,   // { to: string; type: "push" | "replace" | ... }
} from "nextjs-nav-guard";`}</code></pre>
      </section>

      {/* Compatibility */}
      <section id="compatibility" class="py-10 md:py-14">
        <h2 class="text-sm text-gray-300 mb-4">Compatibility</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead>
              <tr class="border-b border-white/[0.06]">
                <th class="py-2.5 pr-4 text-gray-500 font-normal">Next.js</th>
                <th class="py-2.5 pr-4 text-gray-500 font-normal">React</th>
                <th class="py-2.5 text-gray-500 font-normal">Status</th>
              </tr>
            </thead>
            <tbody class="text-gray-400">
              <tr class="border-b border-white/[0.04]">
                <td class="py-2.5 pr-4">14.x</td>
                <td class="py-2.5 pr-4">18, 19</td>
                <td class="py-2.5">Supported</td>
              </tr>
              <tr class="border-b border-white/[0.04]">
                <td class="py-2.5 pr-4">15.x</td>
                <td class="py-2.5 pr-4">18, 19</td>
                <td class="py-2.5">Supported</td>
              </tr>
              <tr class="border-b border-white/[0.04]">
                <td class="py-2.5 pr-4">16.0 &ndash; 16.2+</td>
                <td class="py-2.5 pr-4">19</td>
                <td class="py-2.5">Supported</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Migration */}
      <section id="migration" class="py-10 md:py-14">
        <h2 class="text-sm text-gray-300 mb-4">Migrating from next-navigation-guard</h2>
        <p class="text-gray-500 mb-3">The API is identical. Just change the import:</p>
        <pre><code class="language-diff">{`- import { NavigationGuardProvider, useNavigationGuard } from "next-navigation-guard";
+ import { NavigationGuardProvider, useNavigationGuard } from "nextjs-nav-guard";`}</code></pre>
        <p class="text-gray-500 mt-4">If you were using Pages Router, you'll need to switch to App Router &mdash; Pages Router support has been removed.</p>
      </section>
    </>
  );
});

const port = Number(process.env.PORT || 3000);
serve({ fetch: app.fetch, port }, () => {
  console.log(`Listening on http://localhost:${port}`);
});

export default app;
