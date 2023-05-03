import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { TasksProvider } from './helpers/TaskContext.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <TasksProvider>
            <App />
        </TasksProvider>
    </React.StrictMode>
);
