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
      preloadedTracks: ['track1', 
                       'track2', 
                       'track3', 
                       'track4'],
      activeTrack: null,
    }

    this.nowPlaying = this.nowPlaying.bind(this)

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

  nowPlaying = (polygonActive, i) => {
    //debugger 

    //return polygonActive.track 
    this.setsTrack(polygonActive.track)
    /*
    this.setState({
      activeTrack: polygonActive.track  
    })
    */
  }

  setsTrack(track) {
    this.setState({
      activeTrack: track
    })
  }

  render() {
    return (
      <div className="App">
        <div className='player-wrapper'>
          <Player activeTrack={this.state.activeTrack} allTracks={this.state.preloadedTracks}/>
        </div>
        <div>
          <MyFancyComponent geoLoc={this.state.geoLoc} tracks={this.state.preloadedTracks} nowPlaying={this.nowPlaying}/>
        </div>
      </div>
    );
  }
}

export default App;
