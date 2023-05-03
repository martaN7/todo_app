import { Dispatch, FormEvent, useContext, useState } from 'react';
import { callOperationsApi, Operation } from '../helpers/Api.ts';
import { Button, TextField } from '@mui/material';
import { TasksContext } from '../helpers/TaskContext.tsx';

interface AddSpentTimeProps {
    operation: Operation;
    onCancel: Dispatch<number | null>;
}
function AddSpentTimeForm({ operation, onCancel }: AddSpentTimeProps) {
    const [value, setValue] = useState(0);

    const { setTasks } = useContext(TasksContext);

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
                gap: 5,
                alignItems: 'center',
                marginRight: 50,
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
                variant="contained"
                size="small"
                sx={{ textTransform: 'none' }}
                type="submit"
            >
                Save
            </Button>
            <Button
                variant="contained"
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
