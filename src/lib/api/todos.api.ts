import type { Todos } from "../../types/todos"
import type { TodoInput } from "../../types/validations/todos"
import axiosInstance from "../axios/axios-instance"

const todosBase = "/todos"

export const getTodos = async (): Promise<Todos.Todo[]> => {
    const res = await axiosInstance.get<{ todos: Todos.Todo[] }>(todosBase)
    return res.data.todos
}

export const addTodo = async (data: TodoInput): Promise<Todos.Todo> => {
    const res = await axiosInstance.post(`${todosBase}/add`, {
        ...data,
        userId: 1,
    })
    return res.data
}

export const deleteTodo = async (id: number) => {
    await axiosInstance.delete(`${todosBase}/${id}`)
}

export const toggleTodo = async (id: number, completed: boolean): Promise<Todos.Todo> => {
    const res = await axiosInstance.put(`${todosBase}/${id}`, { completed })
    return res.data
}

export const editTodo = async (id: number, todo: string): Promise<Todos.Todo> => {
    const res = await axiosInstance.put(`${todosBase}/${id}`, { todo })
    return res.data
}