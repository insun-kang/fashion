import './App.css';
import React from 'react';
import { RecoilRoot } from 'recoil';
import { Route, Switch } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      <RecoilRoot>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
        </Switch>
      </RecoilRoot>
    </div>
  );
}

export default App;
