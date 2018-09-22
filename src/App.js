/*
  notes: 
  polygons change track? trigger next sequence?
  rectanges add to sequence?
  circles do what?
  markers should be new songs altogether? mark of progress?

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
      //has baseTrack and sequence, because some sequences from one baseTrack can work in baseTrack from another
      preloadedTracks: {baseTrack: 'shayna_song', sequence: ['drums_2', 
                       'drums_3', 
                       'drums_main', 
                       'heavy_synth_1',
                       'heavy_synth_2',
                       'strings_1',
                       'synth_1',
                       'synth_2',
                       'weird_swell_1']},
      shapeType: undefined,
      activeTrack: undefined,
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
    //console.log(nextProps)
  }

  nowPlaying = (polygonActive, effects) => { //poorly named, should be something like hitsCue and then determines what to do based on that
    //debugger 
    this.setsTrack(polygonActive, effects)
  }

  setsTrack(polygonActive, effects) {
    //will: erase sequence (right?), start new track-base 
    //what if anything to do about effects

    //debugger 
    this.setState({
      activeTrack: polygonActive.trackSequence.baseTrack, //will also erase sequence but haven't done that yet
      activeSquence: polygonActive.trackSequence.tracks,
      shapeType: polygonActive, //for sequencer case statement 
      //effects: effects, //setting effects now its own function though not hooked up yet
      playing: true,
    })
  }

  /*

  setsSequence(track){
    this.setState({
      addTrack: track,
      //effects: effects, //I DON'T THINK EFFECTS SHOULD TRAVEL WITH THIS
      playing: true,
    })
  }
  */

  setsEffects(effects){
    //things that trigger effects go through hre
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
            activeTrack={this.state.activeTrack} //this will trigger only when a new track is loaded and clears(?) sequence
            shapeType={this.state.shapeType} //include shapeType so the case statement in sequencer knows what to do with new track info
            addTrack={this.state.addTrack} //this adds a track or whatever to sequence
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
