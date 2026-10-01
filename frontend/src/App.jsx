import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const API_URL = "http://localhost:5000/api/todos";

  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.log("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add Todo
  const addTodo = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      await axios.post(API_URL, {
        title: title.trim(),
      });

      setTitle("");
      fetchTodos();
    } catch (error) {
      console.log("Add Error:", error);
    }
  };

  // Complete / Incomplete
  const toggleTodo = async (id, completed) => {
    try {
      await axios.put(`${API_URL}/${id}`, {
        completed: !completed,
      });

      fetchTodos();
    } catch (error) {
      console.log("Toggle Error:", error);
    }
  };

  // Start Edit
  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditingTitle(todo.title);
  };

  // Save Edit
  const saveEdit = async (id) => {
    if (!editingTitle.trim()) return;

    try {
      await axios.put(`${API_URL}/${id}`, {
        title: editingTitle.trim(),
      });

      setEditingId(null);
      setEditingTitle("");

      fetchTodos();
    } catch (error) {
      console.log("Edit Error:", error);
    }
  };

  // Cancel Edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  // Delete
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);

      fetchTodos();
    } catch (error) {
      console.log("Delete Error:", error);
    }
  };

  return (
    <div className="app">
      <div className="todo-container">

        <h1>Todo List</h1>

        {/* Add Todo */}
        <form onSubmit={addTodo} className="todo-form">
          <input
            type="text"
            placeholder="Enter your todo..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button type="submit">
            Add Todo
          </button>
        </form>

        {/* Todo List */}
        <div className="todo-list">

          {todos.length === 0 ? (
            <p className="empty">
              No todos found
            </p>
          ) : (
            todos.map((todo) => (

              <div className="todo-item" key={todo._id}>

                {editingId === todo._id ? (

                  <div className="edit-box">

                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) =>
                        setEditingTitle(e.target.value)
                      }
                    />

                    <button
                      onClick={() =>
                        saveEdit(todo._id)
                      }
                    >
                      Save
                    </button>

                    <button
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>

                  </div>

                ) : (

                  <>
                    <span
                      className={
                        todo.completed
                          ? "completed"
                          : ""
                      }
                      onClick={() =>
                        toggleTodo(
                          todo._id,
                          todo.completed
                        )
                      }
                    >
                      {todo.title}
                    </span>

                    <div className="todo-actions">

                      <button
                        onClick={() =>
                          startEdit(todo)
                        }
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteTodo(todo._id)
                        }
                      >
                        Delete
                      </button>

                    </div>
                  </>

                )}

              </div>

            ))
          )}

        </div>

      </div>
    </div>
  );
}

export default App;