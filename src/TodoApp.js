// src/TodoApp.js
import React, { useState, useEffect, useReducer, useCallback } from 'react';
import './TodoApp.css';

// Reducer function to handle todo actions
const todoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, { text: action.text, completed: false }];
    case 'TOGGLE_TODO':
      return state.map((todo, index) =>
        index === action.index ? { ...todo, completed: !todo.completed } : todo
      );
    case 'DELETE_TODO':
      return state.filter((_, index) => index !== action.index);
    case 'EDIT_TODO':
      return state.map((todo, index) =>
        index === action.index ? { ...todo, text: action.text } : todo
      );
    default:
      return state;
  }
};

function TodoApp() {
  const [input, setInput] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Use reducer for todo state management
  const [todos, dispatch] = useReducer(todoReducer, [], () => {
    // Initialize state from localStorage
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  // Save todos to localStorage when they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Add Todo function using dispatch
  const addTodo = useCallback(() => {
    if (input.trim()) {
      dispatch({ type: 'ADD_TODO', text: input });
      setInput('');
    }
  }, [input]);

  // Toggle Todo completed status using dispatch
  const toggleTodo = useCallback((index) => {
    dispatch({ type: 'TOGGLE_TODO', index });
  }, []);

  // Delete Todo using dispatch
  const deleteTodo = useCallback((index) => {
    dispatch({ type: 'DELETE_TODO', index });
  }, []);

  // Edit Todo
  const editTodo = (index) => {
    setEditingIndex(index);
    setEditingText(todos[index].text);
  };

  // Save edited Todo
  const saveEdit = (index) => {
    dispatch({ type: 'EDIT_TODO', index, text: editingText });
    setEditingIndex(null);
    setEditingText('');
  };

  return (
    <div className="todo-app">
      <h1 className="title">To-Do List</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Add a new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input"
        />
        <button onClick={addTodo} className="add-button">Add</button>
      </div>
      <ul className="list">
        {todos.map((todo, index) => (
          <li
            key={index}
            className={`todo-item ${todo.completed ? 'completed' : ''}`}
          >
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="edit-input"
                />
                <button onClick={() => saveEdit(index)} className="save-button">
                  Save
                </button>
              </>
            ) : (
              <>
                <span onClick={() => toggleTodo(index)} className="text">
                  {todo.text}
                </span>
                <button onClick={() => editTodo(index)} className="edit-button">
                  Edit
                </button>
                <button onClick={() => deleteTodo(index)} className="delete-button">
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
