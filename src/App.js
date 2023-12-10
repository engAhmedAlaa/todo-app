import Background from './components/Background';
import Header from './components/Header';
import Content from './components/Content';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app">
      <Background />
      <div className="container">
        <Header />
        <Content />
        <Footer />
      </div>
    </div>
  );
}

export default App;
