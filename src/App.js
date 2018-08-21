import React, { Component } from 'react';

import MyMapComponent from './components/MyMapComponent';
import './App.css';
import MyFancyComponent from './components/MyMapComponent';

class App extends Component {
  render() {
    return (
      <div className="App">
        <MyFancyComponent />
      </div>
    );
  }
}

export default App;
