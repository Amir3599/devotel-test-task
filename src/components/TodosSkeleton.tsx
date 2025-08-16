import type { FC } from "react"
import { Skeleton } from "./ui/skeleton"

type Props = {
    count: number
}

const TodosSkeleton: FC<Props> = ({ count }) => {
    return Array.from({ length: count }).map((_) => (
        <div className="flex items-center gap-x-2 h-14 mb-2">
            <Skeleton className="w-4 h-1/2 rounded-[4px]" />
            <Skeleton className="flex-1 h-full flex justify-end">
                <div className="flex gap-x-2 items-center px-4">
                    <Skeleton className="w-8 h-1/2 bg-white" />
                    <Skeleton className="w-8 h-1/2 bg-white" />
                    <Skeleton className="w-8 h-1/2 bg-white" />
                </div>
            </Skeleton>
        </div>
    ))
}

export default TodosSkeleton