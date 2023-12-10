import { useState } from 'react';
import classNames from 'classnames';
import { REDUCER_ACTIONS } from './Content';
import { CheckIcon, CrossIcon, DoneIcon, EditIcon, GripIcon } from './Icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableTodoItem(props) {
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
  } = useSortable({
    id: props.todo.id,
    animateLayoutChanges: props.animateLayoutChanges,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TodoItem
      {...props}
      isDragging={isDragging}
      attributes={attributes}
      listeners={listeners}
      setNodeRef={setNodeRef}
      style={style}
      setActivatorNodeRef={setActivatorNodeRef}
    />
  );
}

export function TodoItem({
  todo,
  dispatch,
  isDragging,
  attributes,
  listeners,
  setNodeRef,
  style,
  dragOverlay,
  setActivatorNodeRef,
}) {
  const { id, content, isCompleted } = todo;
  const [editedContent, setEditedContent] = useState(content);
  const [isEditing, setIsEditing] = useState(false);

  function handleToggleCheckTodo() {
    dispatch({
      type: REDUCER_ACTIONS.TOGGLE_CHECK_TODO,
      payload: { id },
    });
  }

  function handleSaveTodo() {
    dispatch({
      type: REDUCER_ACTIONS.SAVE_TODO,
      payload: { id, editedContent },
    });
  }

  function handleDeleteTodo() {
    dispatch({ type: REDUCER_ACTIONS.DELETE_TODO, payload: { id } });
  }

  return (
    <li
      ref={setNodeRef}
      className="todo-item-wrapper"
      style={style}
      {...attributes}
      tabIndex={undefined}
    >
      <div
        className={classNames(
          'todo-item',
          isCompleted && 'completed',
          isEditing && 'editing',
          isDragging && 'dragging',
          dragOverlay && 'drag-overlay'
        )}
      >
        {!isEditing && (
          <button
            type="button"
            ref={setActivatorNodeRef}
            className="grip-button"
            aria-label="Order todo"
            {...(isEditing ? undefined : listeners)}
          >
            <GripIcon />
          </button>
        )}
        <label className="check-todo">
          <span className="check-icon">
            <CheckIcon />
          </span>
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={handleToggleCheckTodo}
          />
        </label>
        {isEditing ? (
          <textarea
            className="edit-textarea"
            value={editedContent}
            onChange={(e) => {
              console.log(e.target.value);
              setEditedContent(e.target.value);
            }}
          />
        ) : (
          <p className="content" onDoubleClick={handleToggleCheckTodo}>
            {content}
          </p>
        )}
        <div className="actions">
          {isEditing ? (
            <button
              type="button"
              className="save-button"
              onClick={() => {
                setIsEditing(false);
                handleSaveTodo();
              }}
              aria-label="Save todo"
            >
              <DoneIcon />
            </button>
          ) : (
            <>
              <button
                type="button"
                className="edit-button"
                onClick={() => setIsEditing(true)}
                aria-label="Edit todo"
              >
                <EditIcon />
              </button>
              <button
                type="button"
                className="delete-button"
                aria-label="Delete todo"
                onClick={handleDeleteTodo}
              >
                <CrossIcon />
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  );
}
