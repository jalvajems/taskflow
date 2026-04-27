import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Edit2, Check, X, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import Navbar from './Navbar';

interface Task {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  status: string;
  dueDate?: string;
}

const Tasks: React.FC = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState('All');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const fetchTasks = useCallback(async () => {
    try {
      const statusParam = filterStatus !== 'All' ? `&status=${filterStatus}` : '';
      const res = await api.get(`/tasks?page=${page}&limit=${limit}${statusParam}`);
      setTasks(res.data.tasks);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    }
  }, [page, limit, filterStatus]);

  useEffect(() => {
    fetchTasks();
    let socket: Socket;
    
    if (token) {
        socket = io('http://localhost:5000', {
            auth: { token }
        });

        socket.on('task_created', () => fetchTasks());
        socket.on('task_updated', () => fetchTasks());
        socket.on('task_deleted', () => fetchTasks());
    }

    return () => {
        if (socket) socket.disconnect();
    };
  }, [token, fetchTasks]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
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

  const handleToggleComplete = async (task: Task) => {
    const taskId = task.id || task._id;
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
    } catch (err) {
      console.error(err);
    }
  };

  const startEditing = (task: Task) => {
    setEditingId((task.id || task._id) as string);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const handleUpdateTask = async (taskId: string) => {
    try {
      await api.put(`/tasks/${taskId}`, { title: editTitle, description: editDescription });
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
    } catch (err) {
      console.error(err);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <Navbar />
      <main className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
        <div className="glass-panel" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Add New Task</h3>
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Tasks List</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} color="var(--text-muted)" />
            <select 
              value={filterStatus} 
              onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
              style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-glass)', color: 'var(--text)' }}
            >
              <option value="All">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {tasks.length === 0 ? (
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>No tasks found.</p>
        ) : (
          <div className="grid-cards">
            {tasks.map(task => {
              const taskId = (task.id || task._id) as string;
              const isEditing = editingId === taskId;
              
              return (
                <div key={taskId} className={`task-card ${task.status === 'completed' ? 'completed' : ''}`}>
                  <div className="task-card-header">
                    {isEditing ? (
                      <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} style={{ margin: 0, padding: '0.2rem 0.5rem', flex: 1 }} />
                    ) : (
                      <h4 className="task-title" style={{ margin: 0 }}>{task.title}</h4>
                    )}
                    <span className={`task-status status-${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span>
                  </div>
                  
                  {isEditing ? (
                    <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} style={{ width: '100%', marginTop: '0.5rem', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.5rem' }} />
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', flex: 1, marginTop: '0.5rem' }}>{task.description}</p>
                  )}
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', gap: '0.5rem' }}>
                    {isEditing ? (
                      <>
                        <button className="btn-icon" onClick={() => handleUpdateTask(taskId)}><Check size={18} color="var(--success)" /></button>
                        <button className="btn-icon" onClick={() => setEditingId(null)}><X size={18} color="var(--danger)" /></button>
                      </>
                    ) : (
                      <>
                        <button className="btn-icon" onClick={() => handleToggleComplete(task)}><Check size={18} color={task.status === 'completed' ? "var(--success)" : "var(--text-muted)"} /></button>
                        <button className="btn-icon" onClick={() => startEditing(task)}><Edit2 size={18} color="var(--primary)" /></button>
                        <button className="btn-icon" onClick={() => handleDeleteTask(taskId)}><Trash2 size={18} color="var(--danger)" /></button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem', gap: '1.5rem' }}>
            <button className="btn-icon" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ opacity: page === 1 ? 0.3 : 1 }}><ChevronLeft size={24} /></button>
            <span style={{ color: 'var(--text-muted)' }}>Page {page} of {totalPages}</span>
            <button className="btn-icon" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ opacity: page === totalPages ? 0.3 : 1 }}><ChevronRight size={24} /></button>
          </div>
        )}
      </main>
    </>
  );
};

export default Tasks;
