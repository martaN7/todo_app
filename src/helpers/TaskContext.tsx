import React, { createContext, Dispatch, ReactElement, useState } from 'react';
import { Task } from './BasicTypes.ts';

interface ContextTypes {
    tasks: Task[];
    setTasks: Dispatch<React.SetStateAction<Task[]>>;
}

export const TasksContext = createContext<ContextTypes>({
    tasks: [],
    setTasks: () => null,
});

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
