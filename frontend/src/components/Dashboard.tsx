import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Trash2 } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import api from '../api';

interface Task {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  status: string;
  dueDate?: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout, token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchTasks();
    let socket: Socket;
    
    if (token) {
        socket = io('http://localhost:5000', {
            auth: { token }
        });

        socket.on('task_created', (newTask: Task) => {
            setTasks(prev => [...prev, newTask]);
        });

        socket.on('task_updated', (updatedTask: Task) => {
            setTasks(prev => prev.map(t => (t.id === updatedTask.id || t._id === updatedTask._id) ? updatedTask : t));
        });

        socket.on('task_deleted', (deletedId: string) => {
            setTasks(prev => prev.filter(t => t.id !== deletedId && t._id !== deletedId));
        });
    }

    return () => {
        if (socket) socket.disconnect();
    };
  }, [token]);

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // DueDate required by Zod schema
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);

      await api.post('/tasks', { 
         title, 
         description, 
         dueDate: defaultDate.toISOString() 
      });
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await api.delete(`/tasks/${taskId}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="app-header">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>TaskFlow</div>
          <button className="btn-icon" onClick={handleLogout} title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
        <div className="glass-panel" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Create New Task</h3>
          <form onSubmit={handleCreateTask} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <input 
                type="text" 
                placeholder="Task Title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
                style={{ marginBottom: '0.5rem' }}
              />
              <input 
                type="text" 
                placeholder="Description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                style={{ marginBottom: '0' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: 'auto', alignSelf: 'flex-start' }}>
              <Plus size={20} /> Add
            </button>
          </form>
        </div>

        <h2>Your Tasks</h2>
        {tasks.length === 0 ? (
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>No tasks found. Create one above!</p>
        ) : (
          <div className="grid-cards" style={{ marginTop: '1rem' }}>
            {tasks.map(task => {
              const taskId = task.id || task._id;
              return (
                <div key={taskId} className="task-card">
                  <div className="task-card-header">
                    <h4 className="task-title" style={{ margin: 0 }}>{task.title}</h4>
                    <span className={`task-status status-${task.status.toLowerCase().replace(' ', '-')}`}>
                      {task.status}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', flex: 1, marginTop: '0.5rem' }}>{task.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button className="btn-icon" onClick={() => handleDeleteTask(taskId as string)} title="Delete Task">
                      <Trash2 size={18} color="var(--danger)" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
};

export default Dashboard;
