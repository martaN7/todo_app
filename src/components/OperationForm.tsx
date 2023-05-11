import { Dispatch, FormEvent, useContext, useState } from 'react';
import { Button, IconButton, TextField } from '@mui/material';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { callOperationsApi } from '../helpers/Api.ts';
import { TasksContext } from '../helpers/TaskContext.tsx';
import { Operation } from '../helpers/BasicTypes.ts';
import SaveIcon from '@mui/icons-material/Save';
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

    const { setTasks } = useContext(TasksContext);

    async function handleAddOperation(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const operation: Operation = await callOperationsApi({
            data: {
                description: value,
                addedDate: new Date(),
                spentTime: 0,
                taskId,
            },
            method: 'post',
        });

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
    }

    return (
        <form
            style={{
                marginTop: 10,
                marginLeft: 20,
                paddingBottom: 10,
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
        </form>
    );
}

export default OperationForm;
