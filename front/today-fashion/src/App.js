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
            {/* login 되어있다면 main, 되어있지 않다면 home으로 처리 */}
          </Route>
        </Switch>
      </RecoilRoot>
    </div>
  );
}

export default App;
