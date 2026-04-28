import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  
  const [filterStatus, setFilterStatus] = useState('');
  const [filterUser, setFilterUser] = useState('');
  
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      const regularUsers = response.data.filter(user => user.role !== 'admin');
      setUsers(regularUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      let url = '/tasks?';
      if (filterStatus) {
        url = url + `status=${filterStatus}&`;
      }
      if (filterUser) {
        url = url + `assignedTo=${filterUser}`;
      }

      const response = await api.get(url);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, [filterStatus, filterUser]);

  const handleCreateTask = async (event) => {
    event.preventDefault();
    
    try {
      const newTask = {
        title: title,
        description: description,
        assignedTo: assignedTo
      };
      
      await api.post('/tasks', newTask);
      
      setTitle('');
      setDescription('');
      setAssignedTo('');
      
      fetchTasks();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error creating task';
      alert(errorMessage);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header>
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        <section className="create-task-section">
          <h3>Create New Task</h3>
          <form onSubmit={handleCreateTask}>
            <input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            
            <textarea
              placeholder="Task Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
            
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              required
            >
              <option value="">Assign to User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            
            <button type="submit">Create Task</button>
          </form>
        </section>

        <section className="tasks-section">
          <h3>All Tasks</h3>
          
          <div className="filters">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            
            <select 
              value={filterUser} 
              onChange={(e) => setFilterUser(e.target.value)}
            >
              <option value="">All Users</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="task-list">
            {tasks.map((task) => (
              <div key={task._id} className="task-card">
                <h4>{task.title}</h4>
                <p>{task.description}</p>
                <p>
                  <strong>Assigned to:</strong> {task.assignedTo?.name}
                </p>
                <p>
                  <strong>Status:</strong> 
                  <span className={`status ${task.status}`}>
                    {task.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
