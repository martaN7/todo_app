import { Dispatch, FormEvent, useContext, useState } from 'react';
import { Alert, IconButton, TextField } from '@mui/material';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { callOperationsApi } from '../helpers/Api.ts';
import { TasksContext } from '../helpers/TaskContext.tsx';
import { Operation } from '../helpers/BasicTypes.ts';
import CancelIcon from '@mui/icons-material/Cancel';

interface OperationFormProps {
    onCancel: Dispatch<number | null>;
    taskId: number;
    setExpandTaskId: Dispatch<number>;
}

function OperationForm({
    onCancel,
    taskId,
    setExpandTaskId,
}: OperationFormProps) {
    const [value, setValue] = useState('');
    const [operationNameError, setOperationNameError] = useState(false);

    const { setTasks } = useContext(TasksContext);

    async function handleAddOperation(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (value !== '') {
            const operation: Operation = await callOperationsApi({
                data: {
                    description: value,
                    addedDate: new Date(),
                    spentTime: 0,
                    taskId,
                },
                method: 'post',
            });

            setOperationNameError(false);
            setTasks(prev =>
                prev.map(task => {
                    if (task.id === taskId) {
                        task.operations.push(operation);
                    }
                    return task;
                })
            );

            onCancel(null);
            setExpandTaskId(taskId);
        } else {
            setOperationNameError(true);
        }
    }

    return (
        <form
            style={{
                marginTop: 10,
                marginLeft: 20,
                paddingBottom: 5,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
            }}
            onSubmit={handleAddOperation}
        >
            <TextField
                label="Operation"
                variant="outlined"
                size="small"
                type="text"
                id="operation"
                value={value}
                onChange={e => setValue(e.target.value)}
            />
            <IconButton type="submit" aria-label="add" color="success">
                <LibraryAddIcon />
            </IconButton>
            <IconButton
                type="button"
                aria-label="cancel"
                color="warning"
                onClick={() => onCancel(null)}
            >
                <CancelIcon />
            </IconButton>
            {operationNameError && (
                <Alert sx={{ p: 1, m: 1 }} severity="error">
                    Add operation name!
                </Alert>
            )}
        </form>
    );
}

export default OperationForm;
