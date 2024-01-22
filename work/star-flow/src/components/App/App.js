import { Component } from 'react';
import Header from '../Menu/Menu';
import routes from './../../routes';
import { Switch, Route, HashRouter } from 'react-router-dom';
import bg_image from '../../assets/images/bg/bg-coinmap2.jpg';

class App extends Component {
  render() {
    return (
      <HashRouter>
        <div style={{ backgroundImage: `url(${bg_image})` }}>
          <Header />
          <div className="row">{this.showContentMenus(routes)}</div>
        </div>
      </HashRouter>
    );
  }

  showContentMenus = (routes) => {
    var result = null;
    if (routes.length > 0) {
      result = routes.map((route, index) => {
        return (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            component={route.main}
          />
        );
      });
    }

    return <Switch>{result}</Switch>;
  };
}

export default App;
