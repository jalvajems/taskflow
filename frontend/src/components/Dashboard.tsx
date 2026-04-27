import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import TaskStats from './TaskStats';
import Navbar from './Navbar';

const Dashboard: React.FC = () => {
  const { token } = useAuth();
  const [statsTrigger, setStatsTrigger] = useState(0);

  useEffect(() => {
    let socket: Socket;
    
    if (token) {
        socket = io('http://localhost:5000', {
            auth: { token }
        });

        // Refresh stats when any task operation happens
        socket.on('task_created', () => setStatsTrigger(v => v + 1));
        socket.on('task_updated', () => setStatsTrigger(v => v + 1));
        socket.on('task_deleted', () => setStatsTrigger(v => v + 1));
    }

    return () => {
        if (socket) socket.disconnect();
    };
  }, [token]);

  return (
    <>
      <Navbar />
      <main className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1>Analytics Overview</h1>
          <p style={{ color: 'var(--text-muted)' }}>Track your productivity metrics and task trends.</p>
        </div>
        
        <TaskStats refreshTrigger={statsTrigger} />
      </main>
    </>
  );
};

export default Dashboard;
