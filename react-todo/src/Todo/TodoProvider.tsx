import React, { createContext, useReducer } from 'react';
import { ActionTypeEnum, IAddAction, ICompletedAction, IDeleteAction, IReducerAction, ITask, ITodoContext, ITodoState, IToggleFavouriteAction, IUpdateAction } from './Types';
import { type } from 'os';
import { stat } from 'fs';
import { act } from '@testing-library/react';
import { clone } from './utility';



export const TodoContext = createContext<ITodoContext>({
    activeTasks: [],
    completedTasks: [],
    dispatch: () => { }
});

type Props = {
    children: React.ReactNode
}
const addTaskAction = (state: ITodoState, action: IAddAction) => {
    const { data } = action;
    data.id = new Date().toJSON();
    return [action.data, ...state.activeTasks]
}

const deleteTaskAction = (state: ITodoState, action: IDeleteAction) => {
    const activeTasks: ITask[] = clone(state.activeTasks);
    const filteredData = activeTasks.filter(tasks => tasks.id !== action.data.id);
    return filteredData;
}

const deleteCompletedTaskAction = (state: ITodoState, action: IDeleteAction) => {
    const completedTasks: ITask[] = clone(state.completedTasks);
    const filteredData = completedTasks.filter(tasks => tasks.id !== action.data.id);
    return filteredData;
}

const toggleFavouriteAction = (state: ITodoState, action: IToggleFavouriteAction) => {
    const cloneActiveTasks: ITask[] = clone(state.activeTasks);
    const index = cloneActiveTasks.findIndex(x => x.id === action.data.id);
    if (index >= 0) {
        cloneActiveTasks[index].isFav = !cloneActiveTasks[index].isFav;
    }
    return cloneActiveTasks;
}
const UpdateTaskAction = (state: ITodoState, action: IUpdateAction) => {
    const cloneActiveTasks: ITask[] = clone(state.activeTasks);
    const index = cloneActiveTasks.findIndex(x => x.id === action.data.id);
    if (index >= 0) {
        cloneActiveTasks[index] = action.data;
    }
    return cloneActiveTasks;
}

const completedTaskAction = (state: ITodoState, action: ICompletedAction) => {
    const activeTasks: ITask[] = clone(state.activeTasks);
    const completedTaskData = activeTasks.find(task => task.id === action.data.id)
    const filteredData = activeTasks.filter(tasks => tasks.id !== action.data.id);

    const completedTasks = completedTaskData ?
        [completedTaskData, ...state.completedTasks] :
        [...state.completedTasks]

    return {
        activeTasks: filteredData,
        completedTasks,
    };
}
const reducer = (state: ITodoState, action: IReducerAction) => {
    switch (action.type) {
        case ActionTypeEnum.Add:
            return { ...state, activeTasks: addTaskAction(state, action) };
        case ActionTypeEnum.Delete:
            return { ...state, activeTasks: deleteTaskAction(state, action) };
        case ActionTypeEnum.DeleteCompletedTask:
            return { ...state, completedTasks: deleteCompletedTaskAction(state, action) };
        case ActionTypeEnum.ToggleFavourite:
            return { ...state, activeTasks: toggleFavouriteAction(state, action) };
        case ActionTypeEnum.Update:
            return { ...state, activeTasks: UpdateTaskAction(state, action) };
        case ActionTypeEnum.Completed:
            const data = completedTaskAction(state, action)
            return {
                ...state,
                activeTasks: data.activeTasks,
                completedTasks: data.completedTasks
            }
    };
    return { ...state };
}


const TodoProvider = (props: Props) => {

    const tasks: ITask[] = [{
        id: "1",
        title: "Task 1",
        isFav: true,
    },
    {
        id: "2",
        title: "Task 2",
        isFav: false,
    },
    {
        id: "3",
        title: "Task 3",
        isFav: true,
    },
    ];
    const data: ITodoState = { activeTasks: tasks, completedTasks: [] }
    const [state, dispatch] = useReducer(reducer, data);

    return (
        <TodoContext.Provider
            value={{
                activeTasks: state.activeTasks,
                completedTasks: state.completedTasks,
                dispatch
            }}>
            {props.children}
        </TodoContext.Provider>
    );
};

export default TodoProvider;