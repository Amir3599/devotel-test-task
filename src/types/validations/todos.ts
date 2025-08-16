import { z } from 'zod'

export const todoSchema = z.object({
  todo: z.string().min(1, 'Title is required'),
})

export type TodoInput = z.infer<typeof todoSchema>
