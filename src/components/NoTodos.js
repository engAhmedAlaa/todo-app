import { forwardRef } from 'react';
import { AddIcon } from './Icons';

const NoTodos = forwardRef((_, ref) => {
  function handleClick() {
    ref.current.focus();
  }

  return (
    <div className="no-todos">
      <p className="info">No todos found</p>
      <button
        type="button"
        className="add-button"
        onClick={handleClick}
        aria-label="Add todos"
      >
        <AddIcon />
      </button>
    </div>
  );
});

export default NoTodos;
