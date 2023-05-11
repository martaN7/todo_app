import { useContext, useState } from 'react';
import { Alert, Button, Stack, TextField, Typography } from '@mui/material';
import { TasksContext } from '../helpers/TaskContext.tsx';
import { callTasksApi } from '../helpers/Api.ts';

function AddTaskForm() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [titleError, setTitleError] = useState(false);
    const { tasks, setTasks } = useContext(TasksContext);

    async function handleSubmit() {
        if (name !== '') {
            const data = await callTasksApi({
                data: {
                    addedDate: new Date(),
                    description,
                    name,
                    status: 'open',
                },
                method: 'post',
            });

            setTitleError(false);
            setTasks([...tasks, { ...data, operations: [] }]);
            setName('');
            setDescription('');
        } else {
            setTitleError(true);
        }
    }

    return (
        <form
            onSubmit={async e => {
                e.preventDefault();
                await handleSubmit();
            }}
            style={{ marginTop: 20, marginBottom: 40 }}
        >
            <Stack spacing={2} direction="column">
                <Typography variant="h4" textAlign="center">
                    New task
                </Typography>
                <TextField
                    label="Title"
                    variant="outlined"
                    type="text"
                    id="task"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

                <TextField
                    label="Description"
                    variant="outlined"
                    id="description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
                <Button variant="contained" type="submit">
                    Add
                </Button>
                {titleError && <Alert severity="error">Add task title!</Alert>}
            </Stack>
        </form>
    );
}

export default AddTaskForm;
