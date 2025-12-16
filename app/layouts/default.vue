<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <!-- Bovenbalk -->
    <header class="border-b border-slate-800 bg-slate-900/90 backdrop-blur">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <!-- Logo / titel -->
        <div class="text-xs font-semibold tracking-[0.2em] uppercase textslate-400">
          Nuxt Kanban
        </div>
        <!-- Navigatie -->
        <nav class="flex gap-4 text-sm">
          <NuxtLink
              to="/"
              class="text-slate-400 hover:text-white transition-colors"
              active-class="text-white font-semibold"
          >
            Home
          </NuxtLink>
          <NuxtLink
              to="/board"
              class="text-slate-400 hover:text-white transition-colors"
              active-class="text-white font-semibold"
          >
            Board
          </NuxtLink>
        </nav>
      </div>
    </header>
    <!-- Hoofdinhoud -->
    <main class="mx-auto max-w-5xl px-6 py-8">
      <slot />
    </main>
  </div>
</template>
