/*

9/12/
-when start is hit on pulse, what plays?
-

this will either be in Player or above Player and send down to Players(1-?)
-as things occur, duration/location cues/ etc
-the sequence list will be added to 

*/

import React, {Component} from 'react';
import Player from './Player';
import Player2 from './Player2';


export default class Sequencer extends Component {
    constructor(props){
        super(props)

        this.state = {
            trackSequence: [], //for player1? eventually it will be components of a track? or...? 
            effectsSequence: [], //for player2? is this a sequence?
            activeTrack: null, //this will be from sequence, not from state unless i want to set state... ?
            preloadedTracks: ['track1', 
                       'track2', 
                       'track3', 
                       'track4'],
            effects: {volume: 0.5, playbackRate: 1, loop: false},
            playing: true,
            playIndex: 0,
        }
    }

    componentWillReceiveProps(prevState, nextProps){
        const newTrackSequence = Object.assign([], this.state.trackSequence)
        console.log(prevState) // for in-line if statement for setting state... 
        if (nextProps.newThing) {
            newTrackSequence.push(nextProps.newThing)
            this.setState({
                sequence: newTrackSequence
            })
        }

    }

    sequencing(){
        //debugger 
        /*
        will need to parse sequence into player(s)
        -so there's an array of track objects with their effects... 
        -once one track is done (And isn't looping), the next in the sequence should be sent down to player
        -ok, so i need to check playing status in player from sequencer, and if it returns not-playing,
        -we get to the next in the list
        */
       if (this.state.trackSequence.length > 0 ) {
           
       } else {
           return null
       }

    }

    render() {

        // calls sequence function...
        // should know where in sequence is playing
        // will update sequence as per map
        // 
        const activeTrack = this.sequencing()  //no not really this though

        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className='player-wrapper'>
                                <Player 
                                    activeTrack={activeTrack}  //i don't think i wnat this here after all.... 
                                    //allTracks={this.state.preloadedTracks} 
                                    effects={this.state.effects} 
                                    playing={this.state.playing}
                                    sequence={this.state.trackSequence}
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
            </div>
        )
    }
}