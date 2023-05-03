import { useContext, useEffect } from 'react';
import { Container, List } from '@mui/material';
import { getOperationsApi, getTasksApi } from './helpers/Api.ts';
import TaskComponent from './components/TaskComponent.tsx';
import AddTaskForm from './components/AddTaskForm.tsx';
import { TasksContext } from './helpers/TaskContext.tsx';

function App() {
    const { tasks, setTasks } = useContext(TasksContext);

    useEffect(() => {
        const responses = Promise.all([getTasksApi(), getOperationsApi()]);
        responses.then(data => {
            const [tasks, operations] = data;

            setTasks(
                tasks.map(task => ({
                    ...task,
                    operations: operations.filter(
                        operation => operation.taskId === task.id
                    ),
                }))
            );
        });
    }, []);

    return (
        <Container maxWidth="md">
            <AddTaskForm />
            <List>
                {tasks.map(task => (
                    <TaskComponent key={task.id} task={task} />
                ))}
            </List>
        </Container>
    );
}

export default App;
