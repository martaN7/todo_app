import React, { createContext, Dispatch, ReactElement, useState } from 'react';
import { Task } from '../App.tsx';

// interface ContextTypes {
//     tasks: Task[];
//     setTasks: Dispatch<TaskAction | TaskGetFromApiAction>;
// }

interface ContextTypes {
    tasks: Task[];
    setTasks: Dispatch<React.SetStateAction<Task[]>>;
}

export const TasksContext = createContext<ContextTypes>({
    tasks: [],
    setTasks: () => null,
});

// interface TaskAction {
//     type: 'finish' | 'delete' | 'submit';
//     payload: Task;
// }
//
// export interface TaskGetFromApiAction {
//     type: 'getFromApi';
//     tasksFromApi: Task[];
//     operationsFromApi: Operation[];
// }
//
// type InitialState = {
//     tasks: Task[];
// };
//
// const initialState: InitialState = {
//     tasks: [],
// };
//
// function tasksReducer(
//     state: InitialState,
//     action: TaskAction | TaskGetFromApiAction
// ) {
//     const { tasks } = state;
//
//     switch (action.type) {
//         case 'finish': {
//             return { ...state, tasks: [...tasks] };
//         }
//         case 'delete': {
//             return {
//                 ...state,
//                 tasks: state.tasks.filter(
//                     task => task.id !== action.payload.id
//                 ),
//             };
//         }
//         case 'getFromApi': {
//             return {
//                 ...state,
//                 tasks: action.tasksFromApi.map(task => ({
//                     ...task,
//                     operations: action.operationsFromApi.filter(
//                         operation => operation.taskId === task.id
//                     ),
//                 })),
//             };
//         }
//         case 'submit': {
//             return {
//                 ...state,
//                 tasks: [...tasks, { ...action.payload, operations: [] }],
//             };
//         }
//     }
// }

type TasksProviderPropsType = {
    children: ReactElement;
    // ReactElement
};
export function TasksProvider({ children }: TasksProviderPropsType) {
    const [tasks, setTasks] = useState<Task[]>([]);

    return (
        <TasksContext.Provider value={{ tasks, setTasks }}>
            {children}
        </TasksContext.Provider>
    );
}
