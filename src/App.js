import React, { Component } from 'react';

import MyMapComponent from './components/MyMapComponent';
import './App.css';
import MyFancyComponent from './components/MyMapComponent';
import Player from './components/Player';

class App extends Component {
  constructor() {
    super()

    this.state = {
      geoLoc: ''
    }

    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      const geoLoc = {lat: latitude, lng: longitude}
      //debugger 
      this.setState({
        geoLoc: geoLoc
      })
      console.log(geoLoc)
    });
  }
  

  render() {
    return (
      <div className="App">
        <div className='player-wrapper'>
          <Player />
        </div>
        <div>
          <MyFancyComponent geoLoc={this.state.geoLoc}/>
        </div>
      </div>
    );
  }
}

export default App;
