import { Dispatch, useState } from 'react';
import { callApi, Operation } from '../helpers/Api.ts';

interface OperationFormProps {
    onCancel: Dispatch<number | null>;
    taskId: number;
}

export function OperationForm({ onCancel, taskId }: OperationFormProps) {
    const [value, setValue] = useState('');

    async function handleAddOperation() {
        const operation: Operation = await callApi({
            data: {
                description: value,
                addedDate: new Date(),
                spentTime: 0,
                taskId,
            },
            endpoint: 'operations',
            method: 'post',
        });
    }

    return (
        <form>
            <input value={value} onChange={e => setValue(e.target.value)} />
            <button type="submit">Add</button>
            <button onClick={() => onCancel(null)}>Cancel</button>
        </form>
    );
}
