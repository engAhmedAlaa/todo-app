import classNames from 'classnames';

function FilterButton({ state, showState, setShowState }) {
  function handleClickState(state) {
    setShowState(state);
  }

  return (
    <button
      type="button"
      className={classNames('filter-button', showState === state && 'active')}
      aria-label={`Show ${state} todos`}
      onClick={() => handleClickState(state)}
    >
      {state}
    </button>
  );
}

export default function FilterButtons(props) {
  const states = ['all', 'active', 'completed'];

  return (
    <div className="filter-buttons">
      {states.map((state) => (
        <FilterButton key={state} state={state} {...props} />
      ))}
    </div>
  );
}
