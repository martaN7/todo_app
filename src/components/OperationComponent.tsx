import { useContext, useState } from 'react';
import {
    Button,
    Chip,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DeleteIcon from '@mui/icons-material/Delete';
import AddSpentTimeForm from './AddSpentTimeForm.tsx';
import { callOperationsApi } from '../helpers/Api.ts';
import { TasksContext } from '../helpers/TaskContext.tsx';
import { Operation, Task } from '../helpers/BasicTypes.ts';

interface OperationComponentPropsTypes {
    operation: Operation;
    parentTask: Task;
}
function OperationComponent({
    operation,
    parentTask,
}: OperationComponentPropsTypes) {
    const [activeOperationId, setActiveOperationId] = useState<number | null>(
        null
    );
    const { tasks, setTasks } = useContext(TasksContext);

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
                        (operation: Operation) =>
                            operation !== operationToDelete
                    ),
                }))
            );
        };
    }

    return (
        <ListItem
            key={operation.id}
            sx={{
                p: 1,
                pl: 3,
                display: 'flex',
                alignContent: 'center',
                borderBottom: '1px solid #cccccc',
            }}
        >
            <ListItemText
                sx={{
                    // pb: 2,
                    display: 'flex',
                    alignContent: 'center',
                }}
                primary={
                    <>
                        <Typography
                            sx={{
                                display: 'inline',
                                pr: 2,
                            }}
                            variant="body1"
                        >
                            {operation.description}
                        </Typography>
                        <Chip
                            label={`${~~(operation.spentTime / 60)}h ${
                                operation.spentTime % 60
                            }m`}
                            color="success"
                            size="small"
                            sx={{
                                display: 'inline',
                            }}
                        />
                    </>
                }
            />

            {activeOperationId === operation.id ? (
                <AddSpentTimeForm
                    operation={operation}
                    onCancel={setActiveOperationId}
                />
            ) : (
                parentTask.status === 'open' && (
                    <>
                        <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<AccessTimeIcon />}
                            sx={{
                                textTransform: 'none',
                                mr: 1,
                            }}
                            onClick={() => setActiveOperationId(operation.id)}
                        >
                            Add time
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            size="small"
                            sx={{
                                textTransform: 'none',
                                mr: 6,
                            }}
                            startIcon={<DeleteIcon />}
                            onClick={handleDeleteOperation(operation)}
                        >
                            Delete
                        </Button>
                    </>
                )
            )}
        </ListItem>
    );
}

export default OperationComponent;
