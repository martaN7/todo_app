import { useEffect, useState } from 'react';
import axios from 'axios';
import { OperationForm } from './components/OperationForm.tsx';
import { callApi } from './helpers/Api.ts';

export interface TaskStatus {
    status: 'open' | 'closed';
}
export interface Task extends TaskStatus {
    name: string;
    description: string;
    addedDate: Date;
    id: number;
}

function App() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTaskId, setActiveTaskId] = useState<number | null>(null);

    useEffect(() => {
        getTasksApi('tasks').then(setTasks);
    }, []);

    async function getTasksApi(endpoint: string): Promise<Task[]> {
        const response = await axios.get<Task[]>(
            `http://localhost:3000/${endpoint}`
        );
        return response.data;
    }

    async function handleSubmit() {
        const data = await callApi({
            data: {
                addedDate: new Date(),
                description,
                name,
                status: 'open',
            },
            endpoint: 'tasks',
            method: 'post',
        });
        setTasks([...tasks, data]);
        setName('');
        setDescription('');
    }

    function handleFinishTask(task: Task) {
        return async function () {
            await callApi({
                endpoint: `tasks/${task.id}`,
                data: { status: 'closed' },
                method: 'patch',
            });

            task.status = 'closed';
            setTasks([...tasks]);
        };
    }

    function handleDeleteTask(id: number) {
        return async function () {
            await callApi({
                endpoint: `tasks/${id}`,
                method: 'delete',
            });

            setTasks(tasks.filter(task => task.id !== id));
        };
    }

    return (
        <>
            <form
                onSubmit={async e => {
                    e.preventDefault();
                    await handleSubmit();
                }}
            >
                <label htmlFor="task">Task</label>
                <input
                    type="text"
                    id="task"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                ></textarea>
                <button type="submit">add</button>
            </form>
            <div>
                {tasks.map(task => (
                    <div key={task.id}>
                        <b>{task.name} </b>
                        <span>{task.description} </span>
                        {task.status === 'open' && (
                            <>
                                <button
                                    onClick={() => setActiveTaskId(task.id)}
                                >
                                    Add operation
                                </button>
                                <button onClick={handleFinishTask(task)}>
                                    Finish
                                </button>
                            </>
                        )}
                        <button onClick={handleDeleteTask(task.id)}>
                            Delete
                        </button>
                        {activeTaskId === task.id && (
                            <OperationForm
                                taskId={task.id}
                                onCancel={setActiveTaskId}
                            />
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}

export default App;
