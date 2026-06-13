import { useState, useEffect } from 'react';

// MAKE SURE THIS MATCHES YOUR PYTHONANYWHERE USERNAME
const API_URL = 'https://letlouise.pythonanywhere.com/api/tasks/';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched tasks:', data); // Check console to see if data arrives
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    console.log('Attempting to add task:', title);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: title, is_completed: false }),
      });

      if (response.ok) {
        const newTask = await response.json();
        console.log('Task added successfully:', newTask);
        setTitle(''); // Clear input
        fetchTasks(); // Refresh list
      } else {
        const errorText = await response.text();
        console.error('Failed to add task. Server responded with:', response.status, errorText);
        alert(`Failed to add task: ${response.status}`);
      }
    } catch (error) {
      console.error('Network error adding task:', error);
      alert('Network error. Check console for details.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '700px', margin: '0 auto' }}>
      <h1>Task Management System</h1>
      
      <form onSubmit={handleAddTask} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter new task"
          style={{ flex: 1, padding: '10px', fontSize: '16px' }}
          required
        />
        <button type="submit" style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          Add Task
        </button>
      </form>

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {tasks.length === 0 && <p>No tasks yet. Add one above!</p>}
        {tasks.map((task) => (
          <li key={task.id} style={{ padding: '10px', borderBottom: '1px solid #ccc', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="checkbox" checked={task.is_completed} readOnly />
            <span style={{ textDecoration: task.is_completed ? 'line-through' : 'none', color: task.is_completed ? '#888' : '#000' }}>
              {task.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;