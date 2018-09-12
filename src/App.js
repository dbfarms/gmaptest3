/*
  notes: 
  polygons change track? trigger next sequence?
  rectanges add to sequence?
  circles do what?

*/

import React, { Component } from 'react';

//import MyMapComponent from './components/MyMapComponent';
import './App.css';
import MyFancyComponent from './components/MyMapComponent';
import Sequencer from './components/Sequencer';
//import Player from './components/Player';
//import Player2 from './components/Player2';

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
      effects: {volume: 0.5, playbackRate: 1, loop: false},
      playing: true,
    }

    this.nowPlaying = this.nowPlaying.bind(this)
    this.stopPlayingTest = this.stopPlayingTest.bind(this)
    this.startPlayer1 = this.startPlayer1.bind(this)

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

  componentWillReceiveProps(nextProps){
    console.log(nextProps)
  }

  nowPlaying = (polygonActive, effects) => {
    //debugger 
    this.setsTrack(polygonActive.track, effects)
  }

  setsTrack(track, effects) {

    //THIS IS WHERE I LEFT OFF
    //will this change track or add to sequence? different shapes do different things i guess?
    //see top for notes 
    /*
    this.setState({
      activeTrack: track,
      effects: effects,
      playing: true,
    })
    */
  }

  stopPlayingTest(){
    //debugger 
    this.setState({
      playing: false,
    })
  }

  startPlayer1(){
    //debugger 
    this.setState({
      playing: true,
    })
  }

  render() {
    return (
      <div className="App">
        <div>
          <Sequencer 
            activeTrack={this.state.activeTrack} 
            allTracks={this.state.preloadedTracks} 
            effects={this.state.effects}
            playing={this.state.playing}
            sounds={this.state.sounds}
          />
        </div>
        <div className="map">
          <MyFancyComponent 
            geoLoc={this.state.geoLoc} 
            tracks={this.state.preloadedTracks} 
            effects={this.state.effects}
            nowPlaying={this.nowPlaying}
            stopPlayingTest={this.stopPlayingTest}
            startPlayer1={this.startPlayer1}
          />
        </div>
      </div>
    );
  }
}

export default App;
