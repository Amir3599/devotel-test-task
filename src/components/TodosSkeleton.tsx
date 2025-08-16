import type { FC } from "react"
import { Skeleton } from "./ui/skeleton"

type Props = {
    count: number
}

const TodosSkeleton: FC<Props> = ({ count }) => {
    return Array.from({ length: count }).map((_) => (
        <div className="flex items-center gap-x-2 h-10 mb-2">
            <Skeleton className="w-4 h-full rounded-[4px]" />
            <Skeleton className="flex-1 h-full" />
            <div className="flex gap-x-2 h-full">
                <Skeleton className="w-8 h-full" />
                <Skeleton className="w-8 h-full" />
                <Skeleton className="w-8 h-full" />
            </div>
        </div>
    ))
}

export default TodosSkeleton