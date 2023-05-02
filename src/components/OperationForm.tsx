import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { callOperationsApi, Operation } from '../helpers/Api.ts';
import { Task } from '../App.tsx';
import { Button, TextField } from '@mui/material';

interface OperationFormProps {
    onCancel: Dispatch<number | null>;
    taskId: number;
    setTasks: Dispatch<SetStateAction<Task[]>>;
}

export function OperationForm({
    onCancel,
    taskId,
    setTasks,
}: OperationFormProps) {
    const [value, setValue] = useState('');

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
    }

    return (
        <form
            style={{
                marginTop: 10,
                display: 'flex',
                alignContent: 'center',
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
