import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { callOperationsApi, Operation } from '../helpers/Api.ts';
import { Task } from '../App.tsx';
import { Button, TextField } from '@mui/material';

interface AddSpentTimeProps {
    operation: Operation;
    setTasks: Dispatch<SetStateAction<Task[]>>;
    onCancel: Dispatch<number | null>;
}
function AddSpentTimeForm({
    operation,
    setTasks,
    onCancel,
}: AddSpentTimeProps) {
    const [value, setValue] = useState(0);

    async function handleAddSpentTime(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        await callOperationsApi({
            data: { spentTime: operation.spentTime + value },
            id: operation.id,
            method: 'patch',
        });

        operation.spentTime += value;
        setTasks(prev => [...prev]);
        onCancel(null);
    }

    return (
        <form
            onSubmit={handleAddSpentTime}
            style={{
                display: 'flex',
                alignContent: 'center',
            }}
        >
            <TextField
                label="Spent time"
                variant="outlined"
                size="small"
                type="number"
                id="spent-time"
                value={value}
                onChange={e => setValue(+e.target.value)}
            />
            <Button
                variant="outlined"
                color="success"
                size="small"
                sx={{ textTransform: 'none' }}
                type="submit"
            >
                Add time
            </Button>
            <Button
                variant="outlined"
                color="warning"
                size="small"
                sx={{ textTransform: 'none' }}
                type="button"
                onClick={() => onCancel(null)}
            >
                Cancel
            </Button>
        </form>
    );
}

export default AddSpentTimeForm;
