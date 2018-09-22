/*

need to send props to baseTrack from app via locationchecker

still not done:
-when start is hit on pulse, what plays?
-


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
            activeTrack: undefined, //this will be from sequence, not from state unless i want to set state... ?
            activeSequence: undefined,
            //baseTrack: undefined, //still need to get this from locationChecker 
            preloadedTracks: {baseTrack: 'shayna_song', sequence: ['drums_2', 
                       'drums_3', 
                       'drums_main', 
                       'heavy_synth_1',
                       'heavy_synth_2',
                       'strings_1',
                       'synth_1',
                       'synth_2',
                       'weird_swell_1']},
            effects: {volume: 0.5, playbackRate: 1, loop: false},
            playing: true,
            playIndex: 0,
            addTrack: this.props.addTrack, //i don't think this does anything? not sure
            shapeType: undefined,
        }
    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps)

        //determines shape you're in, if you're in a shape, and sets this.state.trackSequence accordingly
        if (nextProps.activeTrack !== undefined){ // checks if you will be entering a location trigger
            this.sequencing(nextProps); 
        } else {
            console.log("nextProps.activeTrack is undefined")
            if (this.state.activeTrack !== undefined) {
                //right now it shouldn't reach here because activeTrack, once defined, is never undefined again
                //but that might change, i dunno
                debugger 
            }
        }
    }

    sequencing(nextProps){
        /*
        will need to parse sequence into player(s)
        -so there's an array of track objects with their effects... 
        -once one track is done (And isn't looping), the next in the sequence should be sent down to player
        -ok, so i need to check playing status in player from sequencer, and if it returns not-playing,
        -we get to the next in the list
        */

        //need base track that starts when you hit start , will be what?? i don't know
       
        const nextSequence = nextProps.shapeType.trackSequence.tracks 
        //console.log("next song next song next song")
        //console.log(nextProps)
        const nextSong = nextProps.shapeType.trackSequence.baseTrack
        

        //checks to see if location is already in shape
        if (this.state.shapeType !== undefined ) {

            //debugger 
             //check on this
             const shape = this.state.shapeType.polygon.props.type
            this.typeOfShape(shape, nextSequence, nextSong)
            //debugger 
        } else {
        // checks to see if will be entering location
            if (nextProps.shapeType !== undefined) {
                //debugger 
                const shape = nextProps.shapeType.polygon.props.type 
                this.typeOfShape(shape, nextSequence, nextSong)
                //debugger 
                this.setState({
                    shapeType: nextProps.shapeType,
                })
            }
            //return this.state.trackSequence
        }
    }

    typeOfShape(shape, nextSequence, nextSong){
        //debugger 
        console.log(shape)
        switch(shape) {
            case("polygons"):
                //polygons, right now, reset sequence altogether
                // looks to see if currently playing track is teh same as the track hit by location
                //if not, it adds it

                console.log("in polygon case statement")
                console.log("this.state.activeTrack")
                console.log(this.state.activeTrack)
                console.log("this.state.trackSequence.baseTrack")
                console.log(this.state.trackSequence.baseTrack)
                
                console.log(this.state.trackSequence.baseTrack == this.state.activeTrack)

                //this checks for new baseTrack 
                //if found it updates state with baseTrack and current polygons tracks
                if (this.state.trackSequence.baseTrack !== nextSong) {
                    //debugger  //NOT UPDATING STATE CORRECTLY, SEE CONSOLE.LOG 
                    const newTrackAndSequence = Object.assign({}, this.state.trackSequence)
                    newTrackAndSequence.baseTrack = nextSong //this.state.activeTrack
                    newTrackAndSequence.sequence = nextSequence //this.state.trackSequence.sequence  //yes, the [] will be the layers
                    
                    //debugger 
                    this.setState({
                        trackSequence: newTrackAndSequence
                    })
                    //debugger 
                    //console.log(newSequence.baseTrack)

                    //return newSequence
                    
                } else {
                //this means it's the same baseTrack and will only update tracks
                    //debugger 
                    //break
                    if (this.state.activeTrack !== nextSong) {
                        this.setState({ activeTrack: nextSong})
                    }
                    if (this.state.trackSequence.sequence !== nextSequence) {
                        const newSequence = Object.assign({}, this.state.trackSequence)
                        //debugger 
                        newSequence.sequence = nextSequence  

                        this.setState({
                            trackSequence: newSequence
                        })
                        //debugger 
                    }
                    //return this.state.trackSequence
                }
                    //return newSequence
                //debugger 
                break 
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
                //should never actually get here since shape has to be definable to get to this function
                debugger
                console.log("not in shape")
                console.log(shape)
                console.log(this.state.trackSequence)
                return this.state.trackSequence 
        }
    }

    setTrackPath(sequence) {
        console.log(sequence)
        if (sequence.sequence.length > 0 ) {
            const trackPaths = sequence.sequence.map(track => {
                switch(track) {
                  case("drums_2"): 
                    return "/static/media/drums_2.847758bc.mp3"
                  case("drums_3"):
                    return "/static/media/drums_3.f08fb955.mp3"
                  case("drums_main"):
                    return "/static/media/drums_main.095fe340.mp3"
                  case("heavy_synth_1"):
                    return "/static/media/heavy_synth_1.626cdb88.mp3"
                  case("heavy_synth_2"):
                    return "/static/media/heavy_synth_2.626cdb88.mp3"
                  case("strings_1"):
                    return "/static/media/strings_1.363f003e.mp3"
                  case("synth_1"):
                    return "/static/media/synth_1.bd1fb0dc.mp3"
                  case("synth_2"):
                    return "/static/media/synth_2.df4a61eb.mp3"
                  case("weird_swell_1"):
                    return "/static/media/weird_swell_1.9a4ae47f.mp3"
                  default: 
                    break 
                }
            })
            return trackPaths
        }
        
    }

    createPlayers(playerPaths) {
        //console.log(playerPaths)
        if (playerPaths !== undefined ) {
            
            //if only one player though eventually i might have all players viewable and only activate the ones being used or
            //i might not show players at all? dunno
            //debugger 
            if (playerPaths.length < 2 ) {
                playerPaths.map((player) => { 
                    return (
                        <div className="row">
                            <div className="col">
                                <div className="player-wrapper">
                                    <Player 
                                        activeTrack={player}  // 
                                        effects={this.state.effects} //this will be more specific to the part i think
                                        playing={this.state.playing}
                                    />
                                </div>
                            </div>
                        </div>
                    )
                })
            }

            //debugger 
            /*
                HERE 
                so right now we'll only ever have a max of 8 players (split array evenly later)
                -match index of mapping to index position of player props

                1) make else statement inherit props from a list of const i define below. they'll
                either be undefined (from state? or...?) or have information from polygon. 
            */
            
            const allThePlayers = playerPaths.map((player, index) => {
                //debugger 
                return (<div className="col">
                            <Player key={index} activeTrack={player} playing={true}/>
                        </div>
                        )
            })

            const firstHalfPlayers = allThePlayers.slice(0, 3)
            const secondHalfPlayers = allThePlayers.slice(4,7)

            debugger //this return statement... doesn't seem to be working

               return (
                    <div>
                        <div className="row">
                            {firstHalfPlayers.map(player => { 
                                player
                            })
                            }
                        </div>
                        <div className="row">
                        {secondHalfPlayers.length > 0 && 
                            <div className="row">
                            {secondHalfPlayers.map(player => { 
                                player
                            })
                            }
                            </div>
                        }
                        </div>
                    </div>
                )
            //})

            /*
                return (
                    <div className={index == 0 || index % 3 === 0 ? "row" : "notRow"}> {/* not working yet}
                        <div className="col">
                            <div className="player-wrapper">
                                <Player 
                                    activeTrack={player}  // 
                                    effects={this.state.effects} //this will be more specific to the part i think
                                    playing={this.state.playing}
                                />
                            </div>
                        </div>
                    </div>
                )
            */
            //debugger
        } else {
            return (
                <div>
                    <div className="row">
                        <div className="col">
                            <Player activeTrack={undefined} effects={this.state.effects} playing={undefined}/>
                        </div>
                        <div className="col">
                            <Player activeTrack={undefined} effects={this.state.effects} playing={undefined}/>
                        </div>
                        <div className="col">
                            <Player activeTrack={undefined} effects={this.state.effects} playing={undefined}/>
                        </div>
                        <div className="col">
                            <Player activeTrack={undefined} effects={this.state.effects} playing={undefined}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <Player activeTrack={undefined} effects={this.state.effects} playing={undefined}/>
                        </div>
                        <div className="col">
                            <Player activeTrack={undefined} effects={this.state.effects} playing={undefined}/>
                        </div>
                        <div className="col">
                            <Player activeTrack={undefined} effects={this.state.effects} playing={undefined}/>
                        </div>
                        <div className="col">
                            <Player activeTrack={undefined} effects={this.state.effects} playing={undefined}/>
                        </div>
                    </div>
                </div>
            )
        }
    }

    /*
    dividePlayers(playersFromPlayerPaths){
        const playersCount = playersFromPlayerPaths.length 
        if (playersCount < 2) 
            return playersFromPlayerPaths
        
        if (playersCount % 2 === 0) {

        }

        return (
            <div></div>
        )
    }
    */

    render() {

        //console.log(activeTrack)

        const playerPaths = this.setTrackPath(this.state.trackSequence) //gets address of tracks
        const playersFromPlayerPaths = this.createPlayers(playerPaths)  //takes address of tracks and builds Players to be
        if (playersFromPlayerPaths !== undefined ) {
            //OK NOW PLAYER NEEDS TO REFLECT NEW PROPS IT WILL BE RECEIVING, SEE 217
            //debugger 

        }
        //rendered below in return statement 
        console.log("CURRENT TRACK SEQUENCE")
        console.log(this.state.trackSequence)
        return (
            <div>
                <div className="container">
                    {playersFromPlayerPaths}
                </div>
            </div>
        )
    }
}

/*

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
                                    trackSequence={this.state.trackSequence}
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

///

        //not sure what of the below i'm keeping !!!!!1 
        
        /*
        const newTrackSequence = Object.assign([], this.state.trackSequence)
       // console.log(prevState) // for in-line if statement for setting state... 
        
        if (nextProps.addTrack) {
            debugger 
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

*/