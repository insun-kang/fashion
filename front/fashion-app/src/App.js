import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBarComponent from './components/NavBar';
import FooterComponent from './components/Footer';

function App() {
  return (
    <div className="App">
      <NavBarComponent />
      내용
      <FooterComponent />
    </div>
  );
}

export default App;
