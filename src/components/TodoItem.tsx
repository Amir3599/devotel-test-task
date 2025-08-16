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
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2Icon, Edit2Icon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Todos } from "@/types/todos"

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
        <Card
            className={cn(
                "shadow-sm transition-all hover:shadow-md w-full p-0",
                isDragging && "shadow-lg border-primary"
            )}
        >
            <CardContent className="flex justify-between items-center p-3">
                {/* متن تسک */}
                <span
                    className={cn(
                        "font-medium",
                        todo.completed && "line-through text-gray-400"
                    )}
                >
                    {todo.todo}
                </span>

                {/* اکشن‌ها */}
                <div className="flex items-center gap-x-2">
                    {/* Toggle Completed */}
                    <Switch
                        checked={todo.completed}
                        onCheckedChange={(checked) =>
                            toggleMutation.mutate({ id: todo.id ?? 0, completed: checked })
                        }
                    />

                    {/* Edit Dialog */}
                    <Dialog open={editOpen} onOpenChange={setEditOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:text-blue-400"
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

                    {/* Delete Alert */}
                    <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-400"
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
            </CardContent>
        </Card>
    )
}
