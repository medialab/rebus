import React, { Component } from 'react';
import { HashRouter as Router } from "react-router-dom";
import Container from './components/Container';
import './App.scss';

class App extends Component {
  render() {
    return (
      <Router>
        <Container />
      </Router>
    );
  }
}

export default App;
