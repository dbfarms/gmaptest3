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

    //this.parentPolygon = this.parentPolygon.bind(this)
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      const geoLoc = {lat: latitude, lng: longitude}
      //debugger 
      console.log(geoLoc)
      this.setState({
        geoLoc: geoLoc
      })
      
    });
  }

  render() {
    return (
      <div className="App">
        <div className='player-wrapper'>
          <Player />
        </div>
        <div>
          <MyFancyComponent geoLoc={this.state.geoLoc} />
        </div>
      </div>
    );
  }
}

export default App;
