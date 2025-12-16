<script setup>
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import BoardColumn from '~/components/BoardColumn.vue'
import TaskCard from '~/components/TaskCard.vue'
import { useBoardStore } from '~/stores/board'
const boardStore = useBoardStore()
const { columns, loading, error } = storeToRefs(boardStore)
onMounted(() => {
  boardStore.fetchTasks()
})
</script>
<template>
  <div class="space-y-6">
    <header class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div class="space-y-2">
        <h1 class="text-3xl font-bold tracking-tight text-slate-50">
          Kanban board
        </h1>
        <p class="text-sm text-slate-200 max-w-2xl">
          Dit board gebruikt Supabase als database. Je kunt taken toevoegen,
          verplaatsen, verwijderen en het board terugzetten naar de
          oorspronkelijke starttoestand.
        </p>
        <p v-if="error" class="text-sm text-red-400">
          Fout: {{ error }}
        </p>
      </div>
      <button
          type="button"
          class="inline-flex items-center justify-center rounded-md border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate100 hover:bg-slate-700 hover:border-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="boardStore.resetBoard"
          :disabled="loading"
      >
        {{ loading ? 'Laden...' : 'Board resetten' }}
      </button>
    </header>
    <div v-if="loading" class="text-center text-slate-400 py-8">
      Taken laden...
    </div>
    <section v-else class="flex gap-6 overflow-x-auto pb-4">
      <BoardColumn
          v-for="(column, columnIndex) in columns"
          :key="column.id"
          :id="column.id"
          :title="column.title"
          :count="column.tasks.length"
          @add-task="boardStore.addTaskToColumn"
      >
        <TaskCard
            v-for="task in column.tasks"
            :key="task.id"
            :id="task.id"
            :column-id="column.id"
            :title="task.title"
            :description="task.description"
            :is-first-column="columnIndex === 0"
            :is-last-column="columnIndex === columns.length - 1"
            @move-task="boardStore.moveTask"
            @move-task-back="boardStore.moveTaskBack"
            @delete-task="boardStore.deleteTask"
        />
      </BoardColumn>
    </section>
  </div>
</template>