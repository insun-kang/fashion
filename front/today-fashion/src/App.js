import './App.css';
import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  useEffect(() => {}, []);
  return (
    <div className="App">
      <Switch>
        <Route path="/" exact>
          <Home />
          {/* login 되어있다면 main, 되어있지 않다면 home으로 처리 */}
        </Route>
      </Switch>
    </div>
  );
}

export default App;
