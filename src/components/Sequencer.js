/*

still not done:
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
            trackSequence: {baseTrack: undefined, sequence: []}, //for player1? when circle is hit, it adds a sequence from the track
            effectsSequence: [], //for player2? is this a sequence?
            activeTrack: null, //this will be from sequence, not from state unless i want to set state... ?
            preloadedTracks: ['track1', 
                       'track2', 
                       'track3', 
                       'track4'],
            effects: {volume: 0.5, playbackRate: 1, loop: false},
            playing: true,
            playIndex: 0,
            addTrack: this.props.addTrack,
            shapeType: undefined,
        }
    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps)

        /*

        how this should work:
        -receives updated location information
            -sequencing function checks shape
                -if different shape (but same kind of shape), react accordingly
                -if new kind of shape, etc
                -if in same sahpe (duration? or should that remain where it was)

        */

        //determines shape you're in, if you're in a shape, and sets this.state.trackSequence accordingly
        this.sequencing(nextProps); 

        const newTrackSequence = Object.assign([], this.state.trackSequence)
       // console.log(prevState) // for in-line if statement for setting state... 
        
        if (nextProps.addTrack) {
            console.log(nextProps.addTrack)
            newTrackSequence.push(nextProps.addTrack)
            this.setState({ sequence: newTrackSequence })
        }
        if (nextProps.activeTrack !== this.state.activeTrack) {
            //debugger
            this.setState({ 
                activeTrack: nextProps.activeTrack,
                shapeType: nextProps.shapeType 
            })
        }

    }

    sequencing(nextProps){
        //debugger 
        /*
        will need to parse sequence into player(s)
        -so there's an array of track objects with their effects... 
        -once one track is done (And isn't looping), the next in the sequence should be sent down to player
        -ok, so i need to check playing status in player from sequencer, and if it returns not-playing,
        -we get to the next in the list
        */

        //need base track that starts when you hit start , will be what?? i don't know
        //

        //checks to see if location is already in shape
        if (this.state.shapeType !== undefined ) {
            //debugger 
            const shape = this.state.shapeType.polygon.props.type //check on this
            this.typeOfShape(shape)
            //debugger 
        } else {
        // checks to see if will be entering location
            if (nextProps.shapeType !== undefined) {
                this.typeOfShape(nextProps.shapeType)
                this.setState({
                    shapeType: nextProps.shapeType,
                })
            }
            return this.state.trackSequence
        }
    }

    typeOfShape(shape){
        //debugger 
        switch(shape) {
            case("polygons"):
                //polygons, right now, reset sequence altogether
                // looks to see if currently playing track is teh same as the track hit by location
                //if not, it adds it
                console.log("in polygon case statement")
                if (this.state.trackSequence.baseTrack !== this.state.activeTrack) {
                    const newSequence = Object.assign({}, this.state.trackSequence)
                    newSequence.baseTrack = this.state.activeTrack
                    newSequence.sequence = [] //yes, the [] will be the layers
                    
                    this.setState({
                        trackSequence: newSequence
                    })
                    //debugger 
                    //console.log(newSequence.baseTrack)

                    //return newSequence
                    
                } else {
                    //debugger 
                    //break
                    return this.state.trackSequence
                }
                    //return newSequence
                //debugger 
            case("circles"):
                //
                // looks to see if currently playing track is teh same as the track hit by location
                //if not, it adds it
                if (this.state.trackSequence[this.state.playIndex] !== this.state.activeTrack) {
                    const newSequence = Object.assign([], this.state.trackSequence)
                    newSequence.push(this.state.activeTrack)
                    //debugger 
                    this.setState({
                        trackSequence: newSequence
                    })
                }
                
            default:
                //debugger
                console.log("not in shape")
                console.log(this.state.trackSequence)
                return this.state.trackSequence 
        }
    }

    render() {

        // calls sequence function...
        // should know where in sequence is playing
        // will update sequence as per map
        // 
        //const activeTrack = this.sequencing()  //moved to will receive props
        //console.log(activeTrack)
        //console.log(this.state.trackSequence)
        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className='player-wrapper'>
                                <Player 
                                    activeTrack={this.state.activeTrack}  //i don't think i wnat this here after all.... 
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