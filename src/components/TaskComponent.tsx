import { Fragment, useContext, useState } from 'react';
import {
    Button,
    Chip,
    Collapse,
    List,
    ListItemButton,
    ListItemText,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteIcon from '@mui/icons-material/Delete';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import OperationForm from './OperationForm.tsx';
import OperationComponent from './OperationComponent.tsx';
import { callTasksApi } from '../helpers/Api.ts';
import { TasksContext } from '../helpers/TaskContext.tsx';
import { Operation, Task } from '../helpers/BasicTypes.ts';

interface TaskComponentPropsTypes {
    task: Task;
}
function TaskComponent({ task }: TaskComponentPropsTypes) {
    const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
    const [expandTaskId, setExpandTaskId] = useState(0);

    const { tasks, setTasks } = useContext(TasksContext);

    const handleExpandTask = (id: number) => {
        setExpandTaskId(expandTaskId === id ? 0 : id);
    };
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

    function calculateTotalTime(operations: Operation[]): string {
        const totalMinutes = operations.reduce(
            (acc, ce) => acc + ce.spentTime,
            0
        );
        return `${~~(totalMinutes / 60)}h ${totalMinutes % 60}m`;
    }

    return (
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
                    primaryTypographyProps={{ variant: 'h5' }}
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
                            onClick={e => {
                                e.stopPropagation();
                                setActiveTaskId(task.id);
                            }}
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
                    <Chip
                        label={calculateTotalTime(task.operations)}
                        sx={{
                            display: 'flex',
                            justifySelf: 'flex-start',
                            mr: 2,
                        }}
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
                {expandTaskId === task.id ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            {activeTaskId === task.id && (
                <OperationForm
                    taskId={task.id}
                    onCancel={setActiveTaskId}
                    setExpandTaskId={setExpandTaskId}
                />
            )}
            <Collapse
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
                    {task.operations.map(operation => (
                        <OperationComponent
                            key={operation.id}
                            operation={operation}
                            parentTask={task}
                        />
                    ))}
                </List>
            </Collapse>
        </Fragment>
    );
}

export default TaskComponent;
