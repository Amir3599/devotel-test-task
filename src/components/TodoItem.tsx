import { useState } from "react"
import { useTodos } from "../hooks/useTodos"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Todos } from "@/types/todos"
import { Switch } from "./ui/switch"
import { Trash2Icon, Edit2Icon } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
    todo: Todos.Todo
    isDragging?: boolean
}

export default function TodoItem({ todo, isDragging }: Props) {
    const { deleteMutation, toggleMutation, editMutation } = useTodos()
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [editValue, setEditValue] = useState(todo.todo ?? "")

    const handleEditSave = () => {
        const value = (editValue ?? "").trim()
        if (!value) return

        const id = Number(todo.id)
        if (!Number.isFinite(id)) return

        editMutation.mutate(
            { id, todo: value },
            { onSuccess: () => setEditOpen(false) }
        )
    }


    return (
        <div
            className={cn(
                "flex justify-between items-center p-2 border-b rounded-lg flex-1 shadow-sm bg-white",
                isDragging && "shadow-lg"
            )}
        >
            <span
                className={todo.completed ? "line-through cursor-pointer" : "cursor-pointer"}
            >
                {todo.todo}
            </span>

            <div className="flex items-center gap-x-2">
                {/* Toggle */}
                <Switch
                    checked={todo.completed}
                    onCheckedChange={(checked) =>
                        toggleMutation.mutate({ id: todo.id ?? 0, completed: checked })
                    }
                />

                {/* Edit */}
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            className="text-blue-600 hover:text-blue-400"
                            size="sm"
                        >
                            <Edit2Icon />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Todo</DialogTitle>
                        </DialogHeader>
                        <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                        />
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEditOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleEditSave}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete */}
                <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            className="text-red-600 hover:text-red-400"
                            size="sm"
                        >
                            <Trash2Icon />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Todo</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete this todo? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction asChild>
                                <Button
                                    className="bg-red-600 hover:bg-red-400"
                                    size="sm"
                                    onClick={() => deleteMutation.mutate(todo.id ?? 0)}
                                >
                                    Delete
                                </Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}
