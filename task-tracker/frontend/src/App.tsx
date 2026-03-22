import { TaskList } from './components/tasks/TaskList';
import { TaskForm } from './components/tasks/TaskForm';
import { useTasks } from './hooks/useTasks';
import './App.css';

function App() {
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks();

  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Tracker</h1>
        <p>Manage your tasks efficiently</p>
      </header>

      <main className="app-main">
        <div className="container">
          <TaskForm createTask={createTask} error={error} />
          <TaskList
            tasks={tasks}
            loading={loading}
            error={error}
            deleteTask={deleteTask}
            updateTask={updateTask}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
