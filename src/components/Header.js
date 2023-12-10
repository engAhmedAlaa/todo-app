import ThemeToggle from './ThemeToggle';

function Header() {
  return (
    <header className="main-header">
      <a href="./" className="logo">
        <span translate="no">Todo</span>
      </a>
      <ThemeToggle />
    </header>
  );
}

export default Header;
