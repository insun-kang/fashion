import './App.css';
import React from 'react';
import { RecoilRoot } from 'recoil';
import { Route, Switch } from 'react-router-dom';
import ThemeConfig from './theme';
import ComponentsChart from './pages/ComponentsChart';

function App() {
  return (
    <div className="App">
      <RecoilRoot>
        <ThemeConfig>
          <Switch>
            <Route path="/" exact>
              <ComponentsChart />
              {/* login 되어있다면 main, 되어있지 않다면 home으로 처리 */}
            </Route>
          </Switch>
        </ThemeConfig>
      </RecoilRoot>
    </div>
  );
}

export default App;
