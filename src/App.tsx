import { useState, useMemo } from "react"
import { useTodos } from "./hooks/useTodos"
import TodoForm from "./components/TodoForm"
import TodoList from "./components/TodoList"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "./components/ThemeToggle"
import TodosSkeleton from "./components/TodosSkeleton"

export default function App() {
  const { todosQuery } = useTodos()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "completed" | "active">("all")
  const [sort, setSort] = useState<"none" | "alphabetical" | "completed">("none")
  const filteredTodos = useMemo(() => {
    const todos = todosQuery.data || [];

    const searchedTodos = search.trim()
      ? todos.filter(t => t?.todo?.toLowerCase().includes(search.toLowerCase()))
      : todos;

    const filteredTodos = searchedTodos.filter(t => {
      if (filter === "completed") return t.completed;
      if (filter === "active") return !t.completed;
      return true;
    });

    if (sort === "alphabetical") {
      return [...filteredTodos].sort((a, b) => (a.todo ?? "").localeCompare(b.todo ?? ""));
    } else if (sort === "completed") {
      return [...filteredTodos].sort((a, b) => Number(a.completed) - Number(b.completed));
    }

    return filteredTodos;
  }, [todosQuery.data, search, filter, sort]);

  if (todosQuery.isError) return <p>Error loading todos</p>

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-4 max-sm:px-6 select-none">
      <h1 className="text-2xl font-bold">Todo App</h1>

      <TodoForm />

      <div className="flex gap-2">
        <Input
          tabIndex={2}
          placeholder="Search todos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={filter} onValueChange={(val: "all" | "completed" | "active") => setFilter(val)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="active">Active</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(val: "none" | "alphabetical" | "completed") => setSort(val)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sort...</SelectItem>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
            <SelectItem value="completed">By Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-16">
        {todosQuery.isLoading ? (
          <TodosSkeleton count={7} />
        ) : <TodoList todos={filteredTodos} />}
      </div>

      <ThemeToggle />
    </div>
  )
}
