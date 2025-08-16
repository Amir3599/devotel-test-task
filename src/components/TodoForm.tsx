import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTodos } from "../hooks/useTodos"
import { todoSchema, type TodoInput } from "@/types/validations/todos"

export default function TodoForm() {
    const { addMutation } = useTodos()
    const { register, handleSubmit, reset, formState: { errors } } = useForm<TodoInput>({
        resolver: zodResolver(todoSchema),
    })

    const onSubmit = (data: TodoInput) => {
        addMutation.mutate(data)
        reset()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
            <div className="flex gap-2 ">
                <Input autoFocus tabIndex={1} placeholder="New todo" {...register("todo")} />
                <Button type="submit">Add</Button>
            </div>
            {errors.todo && <p className="text-red-500 text-sm">{errors.todo.message}</p>}
        </form>
    )
}
