import { useState, forwardRef } from 'react';
import classNames from 'classnames';
import { REDUCER_ACTIONS } from './Content';
import { AddIcon } from './Icons';

const Form = forwardRef(({ dispatch }, ref) => {
  const [todoContent, setTodoContent] = useState('');

  function handleChange(event) {
    setTodoContent(event.target.value);
  }

  function handleAddTodo(event) {
    event.preventDefault();
    dispatch({
      type: REDUCER_ACTIONS.ADD_TODO,
      payload: { content: todoContent },
    });
    setTodoContent('');
    ref.current.focus();
  }

  return (
    <form className="main-form" onSubmit={handleAddTodo}>
      <button
        type="submit"
        className={classNames('add-button', !!todoContent && 'active')}
        aria-label="Add new todo"
      >
        <span className="add-icon">
          <AddIcon />
        </span>
      </button>
      <input
        type="text"
        className="form-input"
        value={todoContent}
        onChange={handleChange}
        ref={ref}
        placeholder="Create a new todo..."
        required
        autoFocus
      />
    </form>
  );
});

export default Form;
