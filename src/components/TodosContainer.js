import TodosList from './TodosList';
import TodosControl from './TodosControl';

function TodosContainer(props) {
  return (
    <div className="todos-container">
      <TodosList {...props} />
      <TodosControl {...props} />
    </div>
  );
}

export default TodosContainer;
