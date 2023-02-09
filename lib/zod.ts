import { z } from 'zod'

const todoSchema = z.object({
	id: z.string(),
	list_id: z.string(),
	description: z.string(),
	title: z.string(),
	created_at: z.string().datetime({ offset: true }),
})

const todosSchema = z.array(todoSchema)

export type Todo = z.infer<typeof todoSchema>
export type Todos = z.infer<typeof todosSchema>

export { todoSchema, todosSchema }
