import React, { Component } from 'react';

import MyMapComponent from './components/MyMapComponent';
import './App.css';
import MyFancyComponent from './components/MyMapComponent';
import Player from './components/Player';

class App extends Component {
  constructor() {
    super()

    this.state = {
      geoLoc: '',
      preloadedTracks: ['https://soundcloud.com/failed2012/march-8th-2017', 
                       'https://soundcloud.com/failed2012/march-7th-2017', 
                       'https://soundcloud.com/failed2012/march-4th-2017', 
                       'https://soundcloud.com/failed2012/march-2nd-2017'],
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
          <MyFancyComponent geoLoc={this.state.geoLoc} tracks={this.state.preloadedTracks}/>
        </div>
      </div>
    );
  }
}

export default App;
