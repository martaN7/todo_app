import { Fragment, useEffect, useState } from 'react';
import { OperationForm } from './components/OperationForm.tsx';
import {
    callOperationsApi,
    callTasksApi,
    getOperationsApi,
    getTasksApi,
    Operation,
} from './helpers/Api.ts';
import AddSpentTimeForm from './components/AddSpentTimeForm.tsx';
import {
    Button,
    Chip,
    Collapse,
    Container,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export interface TaskStatus {
    status: 'open' | 'closed';
}
export interface Task extends TaskStatus {
    name: string;
    description: string;
    addedDate: Date;
    id: number;
    operations: Operation[];
}

function App() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
    const [activeOperationId, setActiveOperationId] = useState<number | null>(
        null
    );
    const [expandTaskId, setExpandTaskId] = useState(0);

    const handleExpandTask = (id: number) => {
        setExpandTaskId(expandTaskId === id ? 0 : id);
    };

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

    async function handleSubmit() {
        const data = await callTasksApi({
            data: {
                addedDate: new Date(),
                description,
                name,
                status: 'open',
            },
            method: 'post',
        });

        setTasks([...tasks, { ...data, operations: [] }]);
        setName('');
        setDescription('');
    }

    function handleFinishTask(task: Task) {
        return async function () {
            await callTasksApi({
                id: task.id,
                data: { status: 'closed' },
                method: 'patch',
            });

            task.status = 'closed';
            setTasks([...tasks]);
        };
    }

    function handleDeleteTask(taskToDelete: Task) {
        return async function () {
            await callTasksApi({
                id: taskToDelete.id,
                method: 'delete',
            });

            setTasks(tasks.filter(task => task.id !== taskToDelete.id));
        };
    }

    function handleDeleteOperation(operationToDelete: Operation) {
        return async function () {
            await callOperationsApi({
                id: operationToDelete.id,
                method: 'delete',
            });

            setTasks(
                tasks.map(task => ({
                    ...task,
                    operations: task.operations.filter(
                        operation => operation !== operationToDelete
                    ),
                }))
            );
        };
    }

    function calculateTotalTime(operations: Operation[]): string {
        const totalMinutes = operations.reduce(
            (acc, ce) => acc + ce.spentTime,
            0
        );
        return `${~~(totalMinutes / 60)}h ${totalMinutes % 60}m`;
    }

    return (
        <Container maxWidth="md">
            <form
                onSubmit={async e => {
                    e.preventDefault();
                    await handleSubmit();
                }}
                style={{ marginBottom: 40 }}
            >
                <Stack spacing={2} direction="column">
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
                </Stack>
            </form>
            <List>
                {tasks.map(task => (
                    <Fragment key={task.id}>
                        <ListItemButton
                            sx={{
                                backgroundColor: '#fafafa',
                                mt: 2,
                            }}
                            onClick={() => handleExpandTask(task.id)}
                        >
                            <ListItemText
                                primary={task.name}
                                secondary={task.description}
                            />
                            {task.status === 'open' ? (
                                <>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="small"
                                        sx={{ textTransform: 'none' }}
                                        startIcon={<AddCircleOutlineIcon />}
                                        onClick={() => setActiveTaskId(task.id)}
                                    >
                                        Add operation
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        sx={{
                                            textTransform: 'none',
                                            mr: 1,
                                            ml: 1,
                                        }}
                                        startIcon={<DoneAllIcon />}
                                        onClick={handleFinishTask(task)}
                                    >
                                        Finish
                                    </Button>
                                </>
                            ) : (
                                <ListItemText
                                    primary={calculateTotalTime(
                                        task.operations
                                    )}
                                />
                            )}
                            <Button
                                variant="contained"
                                color="error"
                                size="small"
                                sx={{ textTransform: 'none', mr: 2 }}
                                startIcon={<DeleteIcon />}
                                onClick={handleDeleteTask(task)}
                            >
                                Delete
                            </Button>
                            {expandTaskId === task.id ? (
                                <ExpandLess />
                            ) : (
                                <ExpandMore />
                            )}
                        </ListItemButton>

                        {activeTaskId === task.id && (
                            <OperationForm
                                taskId={task.id}
                                onCancel={setActiveTaskId}
                                setTasks={setTasks}
                            />
                        )}
                        {task.operations.map(operation => (
                            <Collapse
                                key={operation.id}
                                in={expandTaskId === task.id}
                                timeout="auto"
                                unmountOnExit
                            >
                                <List
                                    sx={{
                                        borderColor: '#d4d6d6',
                                        pt: 1,
                                    }}
                                    component="div"
                                    disablePadding
                                >
                                    <ListItem
                                        sx={{
                                            p: 1,
                                            pl: 3,
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                        secondaryAction={
                                            activeOperationId ===
                                            operation.id ? (
                                                <AddSpentTimeForm
                                                    operation={operation}
                                                    setTasks={setTasks}
                                                    onCancel={
                                                        setActiveOperationId
                                                    }
                                                />
                                            ) : (
                                                task.status === 'open' && (
                                                    <>
                                                        <Button
                                                            variant="outlined"
                                                            color="success"
                                                            size="small"
                                                            startIcon={
                                                                <AccessTimeIcon />
                                                            }
                                                            onClick={() =>
                                                                setActiveOperationId(
                                                                    operation.id
                                                                )
                                                            }
                                                        >
                                                            Add time
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            size="small"
                                                            sx={{
                                                                textTransform:
                                                                    'none',
                                                            }}
                                                            startIcon={
                                                                <DeleteIcon />
                                                            }
                                                            onClick={handleDeleteOperation(
                                                                operation
                                                            )}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </>
                                                )
                                            )
                                        }
                                    >
                                        <ListItemText
                                            sx={{
                                                pb: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                            primary={
                                                <>
                                                    <Typography
                                                        sx={{
                                                            display: 'inline',
                                                            pr: 2,
                                                        }}
                                                    >
                                                        {operation.description}
                                                    </Typography>
                                                    <Chip
                                                        label={`${~~(
                                                            operation.spentTime /
                                                            60
                                                        )}h ${
                                                            operation.spentTime %
                                                            60
                                                        }m`}
                                                        color="success"
                                                        sx={{
                                                            display: 'inline',
                                                        }}
                                                    />
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    <Divider variant="middle" component="li" />
                                </List>
                            </Collapse>
                        ))}
                    </Fragment>
                ))}
            </List>
        </Container>
    );
}

export default App;
