import { defineStore } from "pinia";
import { useSupabase } from "~/composables/useSupabase";
function createInitialColumns() {
    return [
        {
            id: "todo",
            title: "To do",
            tasks: []
        },
        {
            id: "doing",
            title: "Doing",
            tasks: []
        },
        {
            id: "done",
            title: "Done",
            tasks: []
        }
    ];
}
export const useBoardStore = defineStore("board", {
    state: () => ({
        columns: createInitialColumns(),
        loading: false,
        error: null
    }),
    actions: {
        async fetchTasks() {
            const supabase = useSupabase();
            if (!supabase) {
                this.error = "Supabase client niet beschikbaar";
                return;
            }
            this.loading = true;
            this.error = null;
            try {
                const { data, error } = await supabase
                    .from("tasks")
                    .select("*")
                    .order("created_at", { ascending: true });
                if (error) throw error;
                this.columns = createInitialColumns();
                if (data) {
                    data.forEach((task) => {
                        const column = this.columns.find((col) => col.id ===
                            task.column_id);
                        if (column) {
                            column.tasks.push({
                                id: task.id,
                                title: task.title,
                                description: task.description || ""
                            });
                        }
                    });
                }
            } catch (err) {
                this.error = err.message;
                console.error("Fout bij ophalen taken:", err);
            } finally {
                this.loading = false;
            }
        },
        async addTaskToColumn(payload) {
            const { columnId, title, description } = payload;
            const supabase = useSupabase();
            if (!supabase) {
                this.error = "Supabase client niet beschikbaar";
                return;
            }
            this.error = null;
            try {
                const { data, error } = await supabase
                    .from("tasks")
                    .insert({
                        title,
                        description: description || "",
                        column_id: columnId
                    })
                    .select()
                    .single();
                if (error) throw error;
                const column = this.columns.find((col) => col.id === columnId);
                if (column && data) {
                    column.tasks.push({
                        id: data.id,
                        title: data.title,
                        description: data.description || ""
                    });
                }
            } catch (err) {
                this.error = err.message;
                console.error("Fout bij toevoegen taak:", err);
                throw err;
            }
        },
        async moveTask(payload) {
            const { taskId, fromColumnId } = payload;
            const supabase = useSupabase();
            if (!supabase) {
                this.error = "Supabase client niet beschikbaar";
                return;
            }
            const fromColumnIndex = this.columns.findIndex(
                (col) => col.id === fromColumnId
            );
            if (fromColumnIndex === -1) return;
            const toColumnIndex = fromColumnIndex + 1;
            if (toColumnIndex >= this.columns.length) return;
            const toColumn = this.columns[toColumnIndex];
            this.error = null;
            try {
                const { error } = await supabase
                    .from("tasks")
                    .update({ column_id: toColumn.id })
                    .eq("id", taskId);
                if (error) throw error;
                const fromColumn = this.columns[fromColumnIndex];
                const taskIndex = fromColumn.tasks.findIndex(
                    (task) => task.id === taskId
                );
                if (taskIndex !== -1) {
                    const task = fromColumn.tasks.splice(taskIndex, 1)[0];
                    toColumn.tasks.push(task);
                }
            } catch (err) {
                this.error = err.message;
                console.error("Fout bij verplaatsen taak:", err);
                throw err;
            }
        },
        async moveTaskBack(payload) {
            const { taskId, fromColumnId } = payload;
            const supabase = useSupabase();
            if (!supabase) {
                this.error = "Supabase client niet beschikbaar";
                return;
            }
            const fromColumnIndex = this.columns.findIndex(
                (col) => col.id === fromColumnId
            );
            if (fromColumnIndex === -1) return;
            const toColumnIndex = fromColumnIndex - 1;
            if (toColumnIndex < 0) return;
            const toColumn = this.columns[toColumnIndex];
            this.error = null;
            try {
                const { error } = await supabase
                    .from("tasks")
                    .update({ column_id: toColumn.id })
                    .eq("id", taskId);
                if (error) throw error;
                const fromColumn = this.columns[fromColumnIndex];
                const taskIndex = fromColumn.tasks.findIndex(
                    (task) => task.id === taskId
                );
                if (taskIndex !== -1) {
                    const task = fromColumn.tasks.splice(taskIndex, 1)[0];
                    toColumn.tasks.push(task);
                }
            } catch (err) {
                this.error = err.message;
                console.error("Fout bij verplaatsen taak:", err);
                throw err;
            }
        },
        async deleteTask(payload) {
            const { taskId, fromColumnId } = payload;
            const supabase = useSupabase();
            if (!supabase) {
                this.error = "Supabase client niet beschikbaar";
                return;
            }
            this.error = null;
            try {
                const { error } = await supabase
                    .from("tasks")
                    .delete()
                    .eq("id", taskId);
                if (error) throw error;
                const column = this.columns.find((col) => col.id === fromColumnId);
                if (column) {
                    const taskIndex = column.tasks.findIndex(
                        (task) => task.id === taskId
                    );
                    if (taskIndex !== -1) {
                        column.tasks.splice(taskIndex, 1);
                    }
                }
            } catch (err) {
                this.error = err.message;
                console.error("Fout bij verwijderen taak:", err);
                throw err;
            }
        },
        async resetBoard() {
            const supabase = useSupabase();
            if (!supabase) {
                this.error = "Supabase client niet beschikbaar";
                return;
            }
            this.loading = true;
            this.error = null;
            try {
                const { error } = await supabase
                    .from("tasks")
                    .delete()
                    .neq("id", 0);
                if (error) throw error;
                this.columns = createInitialColumns();
            } catch (err) {
                this.error = err.message;
                console.error("Fout bij resetten board:", err);
                throw err;
            } finally {
                this.loading = false;
            }
        }
    }
});