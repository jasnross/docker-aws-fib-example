import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { FibPage } from './FibPage';
import { OtherPage } from './OtherPage';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path="/" component={FibPage} exact />
          <Route path="/otherPage" component={OtherPage} />
        </div>
      </Router>
    );
  }
}

export default App;
