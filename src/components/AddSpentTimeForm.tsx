import { Dispatch, FormEvent, useContext, useState } from 'react';
import { Alert, IconButton, TextField } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import { callOperationsApi } from '../helpers/Api.ts';
import { TasksContext } from '../helpers/TaskContext.tsx';
import { Operation } from '../helpers/BasicTypes.ts';

interface AddSpentTimeProps {
    operation: Operation;
    onCancel: Dispatch<number | null>;
}
function AddSpentTimeForm({ operation, onCancel }: AddSpentTimeProps) {
    const [value, setValue] = useState(0);
    const [timeError, setTimeError] = useState(false);

    const { setTasks } = useContext(TasksContext);

    async function handleAddSpentTime(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (value >= 0) {
            await callOperationsApi({
                data: { spentTime: operation.spentTime + value },
                id: operation.id,
                method: 'patch',
            });

            setTimeError(false);
            operation.spentTime += value;
            setTasks(prev => [...prev]);
            onCancel(null);
        } else {
            setTimeError(true);
        }
    }

    return (
        <form
            onSubmit={handleAddSpentTime}
            style={{
                height: 50,
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                marginRight: 50,
            }}
        >
            {timeError && (
                <Alert severity="error" style={{ marginRight: 5 }}>
                    Add correct time!
                </Alert>
            )}
            <TextField
                label="Spent time"
                variant="outlined"
                size="small"
                type="number"
                id="spent-time"
                value={value}
                onChange={e => setValue(+e.target.value)}
            />
            <IconButton type="submit" aria-label="save" color="success">
                <SaveIcon />
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

export default AddSpentTimeForm;
