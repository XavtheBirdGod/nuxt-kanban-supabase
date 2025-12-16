<script setup>
import { ref } from 'vue'
const props = defineProps({
  id: { type: String, required: true },
  title: { type: String, required: true },
  count: { type: Number, required: true }
})
const emit = defineEmits(['add-task'])
const newTaskTitle = ref('')
const newTaskDescription = ref('')
function handleSubmit() {
  const title = newTaskTitle.value.trim()
  const description = newTaskDescription.value.trim()
  if (!title) return
  emit('add-task', {
    columnId: props.id,
    title,
    description
  })
  newTaskTitle.value = ''
  newTaskDescription.value = ''
}
</script>
<template>
  <section class="flex w-80 flex-col rounded-2xl bg-slate-900/95 border
border-slate-800 shadow-lg">
    <!-- Header -->
    <header class="flex items-center justify-between px-4 py-3 border-b border-slate-800">
      <div class="flex items-center gap-2">
        <h2 class="text-xs font-semibold tracking-[0.18em] uppercase textslate-200">
          {{ title }}
        </h2>
        <span
            class="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-slate-800 px-2 text-xs font-semibold text-slate-100"
        >
{{ count }}
</span>
      </div>
    </header>
    <!-- Inhoud -->
    <div class="flex flex-1 flex-col gap-3 px-4 py-4">
      <!-- Taken -->
      <div class="flex flex-col gap-2">
        <slot />
      </div>
      <!-- Formulier -->
      <form class="mt-3 space-y-2 rounded-xl bg-slate-950/80 p-3"
            @submit.prevent="handleSubmit">
        <label class="block text-[11px] font-medium text-slate-300">
          Titel
          <input
              v-model="newTaskTitle"
              type="text"
              placeholder="Nieuwe taaknaam"
              class="mt-1 w-full rounded-md border border-slate-700 bg-slate900 px-2 py-1 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </label>
        <label class="block text-[11px] font-medium text-slate-300">
          Omschrijving
          <textarea
              v-model="newTaskDescription"
              rows="2"
              placeholder="Optioneel"
              class="mt-1 w-full rounded-md border border-slate-700 bg-slate900 px-2 py-1 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </label>
        <button
            type="submit"
            class="w-full rounded-md bg-indigo-600 py-1.5 text-xs fontsemibold text-white hover:bg-indigo-500 disabled:opacity-40"
            :disabled="!newTaskTitle.trim()"
        >
          Taak toevoegen
        </button>
      </form>
    </div>
  </section>
</template>