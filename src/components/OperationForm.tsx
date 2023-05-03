import { Dispatch, FormEvent, useContext, useState } from 'react';
import { Button, TextField } from '@mui/material';
import { callOperationsApi } from '../helpers/Api.ts';
import { TasksContext } from '../helpers/TaskContext.tsx';
import { Operation } from '../helpers/BasicTypes.ts';

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
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                marginLeft: 20,
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
            <Button
                variant="contained"
                color="success"
                size="small"
                sx={{ textTransform: 'none' }}
                type="submit"
            >
                Add
            </Button>
            <Button
                variant="contained"
                color="warning"
                size="small"
                sx={{ textTransform: 'none' }}
                onClick={() => onCancel(null)}
            >
                Cancel
            </Button>
        </form>
    );
}

export default OperationForm;
