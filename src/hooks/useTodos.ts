import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTodos, addTodo, deleteTodo, toggleTodo, editTodo } from '../lib/api/todos.api'
import { QUERIES } from '../constants/react-query.constants'
import type { Todos } from '../types/todos'
import { generateOptimisticId, isOptimisticId } from '@/lib/utils'

export const useTodos = () => {
    const queryClient = useQueryClient()

    const todosQuery = useQuery({
        queryKey: [QUERIES.TODOS_LIST],
        queryFn: getTodos,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    })

    const addMutation = useMutation({
        mutationFn: addTodo,
        onMutate: async (newTodo) => {
            await queryClient.cancelQueries({ queryKey: [QUERIES.TODOS_LIST] });
            const prev = queryClient.getQueryData<Todos.Todo[]>([QUERIES.TODOS_LIST]) || [];

            const optimisticId = generateOptimisticId(2);

            const optimisticTodo: Todos.Todo = {
                id: optimisticId,
                todo: newTodo.todo,
                completed: false,
                userId: 1,
            };
            queryClient.setQueryData([QUERIES.TODOS_LIST], [optimisticTodo, ...prev]);
            return { prev, optimisticId };
        },
        onSuccess: (_data, _vars, ctx) => {
            if (!ctx) return;
            queryClient.setQueryData([QUERIES.TODOS_LIST], (old: Todos.Todo[] = []) =>
                old.map(t => t.id === ctx.optimisticId ? { ...t, isOptimistic: false } : t)
            );
        },
        onError: (_e, _vars, ctx) => {
            if (ctx?.prev) queryClient.setQueryData([QUERIES.TODOS_LIST], ctx.prev);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => (isOptimisticId(id) ? Promise.resolve(null) : deleteTodo(id)),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: [QUERIES.TODOS_LIST] })
            const prev = queryClient.getQueryData<Todos.Todo[]>([QUERIES.TODOS_LIST]) || []
            queryClient.setQueryData([QUERIES.TODOS_LIST], prev.filter(t => t.id !== id))
            return { prev, id }
        },
        onError: (_e, vars, ctx) => {
            if (!isOptimisticId(vars) && ctx?.prev) {
                queryClient.setQueryData([QUERIES.TODOS_LIST], ctx.prev)
            }
        },
    })

    const toggleMutation = useMutation({
        mutationFn: async ({ id, completed }: { id: number; completed: boolean }) =>
            isOptimisticId(id) ? Promise.resolve(null) : toggleTodo(id, completed),
        onMutate: async ({ id, completed }) => {
            await queryClient.cancelQueries({ queryKey: [QUERIES.TODOS_LIST] })
            const prev = queryClient.getQueryData<Todos.Todo[]>([QUERIES.TODOS_LIST]) || []
            queryClient.setQueryData(
                [QUERIES.TODOS_LIST],
                prev.map(t => (t.id === id ? { ...t, completed } : t))
            )
            return { prev, id }
        },
        onError: (_e, vars, ctx) => {
            if (!isOptimisticId(vars.id) && ctx?.prev) {
                queryClient.setQueryData([QUERIES.TODOS_LIST], ctx.prev)
            }
        },
    })

    const editMutation = useMutation({
        mutationFn: async ({ id, todo }: { id: number; todo: string }) =>
            isOptimisticId(id) ? Promise.resolve(null) : editTodo(id, todo),
        onMutate: async ({ id, todo }) => {
            await queryClient.cancelQueries({ queryKey: [QUERIES.TODOS_LIST] })
            const prev = queryClient.getQueryData<Todos.Todo[]>([QUERIES.TODOS_LIST]) || []
            queryClient.setQueryData(
                [QUERIES.TODOS_LIST],
                prev.map(t => (t.id === id ? { ...t, todo } : t))
            )
            return { prev, id }
        },
        onError: (_e, vars, ctx) => {
            if (!isOptimisticId(vars.id) && ctx?.prev) {
                queryClient.setQueryData([QUERIES.TODOS_LIST], ctx.prev)
            }
        },
    })

    const updateOrder = (newOrder: Todos.Todo[]) => {
        queryClient.setQueryData([QUERIES.TODOS_LIST], newOrder)
    }

    return { todosQuery, addMutation, deleteMutation, toggleMutation, editMutation, updateOrder }
}
