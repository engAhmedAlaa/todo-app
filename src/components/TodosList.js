import { useEffect, useRef, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  arrayMove,
  verticalListSortingStrategy,
  defaultAnimateLayoutChanges,
} from '@dnd-kit/sortable';
// import classNames from 'classnames';
import { createPortal } from 'react-dom';
import { SortableTodoItem, TodoItem } from './TodoItem';
import { REDUCER_ACTIONS } from './Content';

const screenReaderInstructions = {
  draggable: `
    To pick up a sortable todo, press the space bar.
    While sorting, use the arrow keys to move the todo.
    Press space again to drop the todo in its new position, or press escape to cancel.
  `,
};

function TodosList({ todos, visibleTodos, dispatch, showState }) {
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      scrollBehavior: 'Cypress' in window ? 'auto' : undefined,
      sortableKeyboardCoordinates,
    })
  );
  const isFirstAnnouncement = useRef(true);
  const getIndex = (id) => todos.findIndex((todo) => todo.id === id);
  const getPosition = (id) => getIndex(id) + 1;
  const [activeId, setActiveId] = useState(null);
  const activeIndex = activeId ? getIndex(activeId) : -1;
  const animateLayoutChanges = (args) =>
    defaultAnimateLayoutChanges({ ...args, wasDragging: true });
  const announcements = {
    onDragStart({ active: { id } }) {
      return `Picked up sortable todo ${String(
        id
      )}. Sortable todo ${id} is in position ${getPosition(id)} of ${
        todos.length
      }`;
    },
    onDragOver({ active, over }) {
      if (isFirstAnnouncement.current === true) {
        isFirstAnnouncement.current = false;
        return;
      }

      if (over)
        return `Sortable todo ${
          active.id
        } was moved into position ${getPosition(over.id)} of ${todos.length}`;

      return;
    },
    onDragEnd({ active, over }) {
      if (over)
        return `Sortable todo ${
          active.id
        } was dropped at position ${getPosition(over.id)} of ${todos.length}`;

      return;
    },
    onDragCancel({ active: { id } }) {
      return `Sorting was cancelled. Sortable todo ${id} was dropped and returned to position ${getPosition(
        id
      )} of ${todos.length}.`;
    },
  };

  useEffect(() => {
    if (!activeId) {
      isFirstAnnouncement.current = true;
    }
  }, [activeId]);

  function onDragStart({ active }) {
    if (!active) return;
    setActiveId(active.id);
  }

  function onDragEnd({ over }) {
    setActiveId(null);
    if (!over) return;
    const overIndex = getIndex(over.id);
    if (activeIndex === overIndex) return;
    const orderedTodos = arrayMove(todos, activeIndex, overIndex);
    dispatch({ type: REDUCER_ACTIONS.ORDER_TODOS, payload: { orderedTodos } });
  }

  return !visibleTodos.length ? (
    <div className="no-state-todos">
      <p className="info">There is no {showState} todos</p>
    </div>
  ) : (
    <DndContext
      collisionDetection={closestCenter}
      sensors={sensors}
      accessibility={{
        announcements,
        screenReaderInstructions,
      }}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={() => setActiveId(null)}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
    >
      <SortableContext
        items={visibleTodos}
        strategy={verticalListSortingStrategy}
      >
        <ul className="todos-list" key={showState}>
          {visibleTodos.map((todo) => (
            <SortableTodoItem
              key={todo.id}
              todo={todo}
              dispatch={dispatch}
              animateLayoutChanges={animateLayoutChanges}
            />
          ))}
        </ul>
      </SortableContext>
      {createPortal(
        <DragOverlay adjustScale={false}>
          {activeId ? (
            <TodoItem
              todo={todos[activeIndex]}
              dispatch={dispatch}
              dragOverlay
            />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}

export default TodosList;
