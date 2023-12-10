import { useState, useEffect, useRef, useMemo, useReducer } from 'react';
import { v4 as uuidV4 } from 'uuid';
import Form from './Form';
import NoTodos from './NoTodos';
import TodosContainer from './TodosContainer';
import FilterButtons from './FilterButtons';

export default function Content() {
  const [todos, dispatch] = useReducer(
    todosReducer,
    JSON.parse(localStorage.getItem('todos')) || []
  );
  const [showState, setShowState] = useState('all');
  const inputRef = useRef(null);
  const activeTodos = useMemo(
    () => todos.filter((todo) => todo.isCompleted === false),
    [todos]
  );
  const completedTodos = useMemo(
    () => todos.filter((todo) => todo.isCompleted === true),
    [todos]
  );
  const visibleTodos =
    showState === 'all'
      ? todos
      : showState === 'active'
      ? activeTodos
      : completedTodos;

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  return (
    <main className="main-content">
      <Form dispatch={dispatch} ref={inputRef} />
      {!todos.length ? (
        <NoTodos ref={inputRef} />
      ) : (
        <>
          <TodosContainer
            todos={todos}
            visibleTodos={visibleTodos}
            dispatch={dispatch}
            showState={showState}
            length={activeTodos.length}
            setShowState={setShowState}
          />
          <FilterButtons setShowState={setShowState} showState={showState} />
        </>
      )}
    </main>
  );
}

export const REDUCER_ACTIONS = {
  ADD_TODO: 'ADD_TODO',
  TOGGLE_CHECK_TODO: 'TOGGLE_CHECK_TODO',
  SAVE_TODO: 'SAVE_TODO',
  DELETE_TODO: 'DELETE_TODO',
  CLEAR_COMPLETED_TODOS: 'CLEAR_COMPLETED_TODOS',
  ORDER_TODOS: 'ORDER_TODOS',
};

function todosReducer(todos, action) {
  switch (action.type) {
    case REDUCER_ACTIONS.ADD_TODO: {
      return [
        {
          id: uuidV4(),
          content: action.payload.content,
          isCompleted: false,
        },
        ...todos,
      ];
    }
    case REDUCER_ACTIONS.TOGGLE_CHECK_TODO: {
      return todos.map((todo) =>
        todo.id !== action.payload.id
          ? todo
          : {
              ...todo,
              isCompleted: !todo.isCompleted,
            }
      );
    }
    case REDUCER_ACTIONS.SAVE_TODO: {
      return todos.map((todo) =>
        todo.id !== action.payload.id
          ? todo
          : {
              ...todo,
              content: action.payload.editedContent,
            }
      );
    }
    case REDUCER_ACTIONS.DELETE_TODO: {
      return todos.filter((todo) => todo.id !== action.payload.id);
    }
    case REDUCER_ACTIONS.CLEAR_COMPLETED_TODOS: {
      return todos.filter((todo) => todo.isCompleted !== true);
    }
    case REDUCER_ACTIONS.ORDER_TODOS: {
      return action.payload.orderedTodos;
    }
    default: {
      throw new Error(`Unknown action ${action.type}`);
    }
  }
}
