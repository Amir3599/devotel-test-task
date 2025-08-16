import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import TodoItem from './TodoItem';
import { useTodos } from '../hooks/useTodos';
import type { Todos } from '../types/todos';
import { cn } from '@/lib/utils';
import { LucideGripVertical } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    todos: Todos.Todo[];
}

export default function TodoList({ todos }: Props) {
    const { updateOrder } = useTodos();
    const [currentTodos, setCurrentTodos] = useState<Todos.Todo[]>(todos);

    useEffect(() => {
        setCurrentTodos(todos);
    }, [todos]);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const reorderedTodos = Array.from(currentTodos);
        const [removed] = reorderedTodos.splice(result.source.index, 1);
        reorderedTodos.splice(result.destination.index, 0, removed);

        setCurrentTodos(reorderedTodos);
        updateOrder(reorderedTodos);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="todos">
                {(provided) => (
                    <div
                        className='space-y-2'
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {currentTodos.map((todo, index) => (
                            <Draggable
                                key={todo.id}
                                index={index}
                                draggableId={todo?.id?.toString() ?? ""}
                            >
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={cn("flex items-center gap-x-2",)}
                                    >
                                        <LucideGripVertical className={cn("opacity-30", snapshot.isDragging && "opacity-100")} />
                                        <TodoItem todo={todo} isDragging={snapshot.isDragging} />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}