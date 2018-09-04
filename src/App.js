import React, { Component } from 'react';

import MyMapComponent from './components/MyMapComponent';
import './App.css';
import MyFancyComponent from './components/MyMapComponent';
import Player from './components/Player';
import Player2 from './components/Player2';

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
      effects: {volume: 0.5, playbackRate: 1, loop: false}
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

  nowPlaying = (polygonActive, i, effects) => {
    //debugger 

    this.setsTrack(polygonActive.track, effects)

    /*
    this.setState({
      activeTrack: polygonActive.track  
    })
    */
  }

  setsTrack(track, effects) {
    this.setState({
      activeTrack: track,
      effects: effects
    })
  }

  render() {
    return (
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="col">
            <div className='player-wrapper'>
              <Player 
                activeTrack={this.state.activeTrack} 
                allTracks={this.state.preloadedTracks} 
                effects={this.state.effects}
              />
            </div>
            </div>
            <div className="col">
              <div className='player-wrapper2'>
                <Player2 sounds={this.state.sounds} />
              </div>
            </div>
          </div>
        </div>
        <div className="map">
          <MyFancyComponent 
            geoLoc={this.state.geoLoc} 
            tracks={this.state.preloadedTracks} 
            nowPlaying={this.nowPlaying}
            effects={this.state.effects}
          />
        </div>
      </div>
    );
  }
}

export default App;
