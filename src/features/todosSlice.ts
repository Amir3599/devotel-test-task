import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface TodosState {
    order: number[]
}

const initialState: TodosState = {
    order: [],
}

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        setOrder: (state, action: PayloadAction<number[]>) => {
            state.order = action.payload
        },
    },
})

export const { setOrder } = todosSlice.actions
export default todosSlice.reducer
