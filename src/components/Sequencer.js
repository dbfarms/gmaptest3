/*
still not done:
-when start is hit on pulse, what plays?
*/

import React, {Component} from 'react';
import Player from './Player';
import Player2 from './Player2';

export default class Sequencer extends Component {
    constructor(props){
        super(props)

        this.state = {
            trackSequence: {baseTrack: undefined, sequence: []}, //for player1? when circle is hit, it adds a sequence from the track
           // effectsSequence: [], //for player2? is this a sequence?
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
            inBetweenTracks: {baseTrack: 'ticktock_song', 
                              sequence: [{track: 'clock_ticking', 
                              effects: {volume: 0.5, playbackRate: 1, loop: true}}, 
                              {track: 'footsteps_on_fallen_leaves', 
                              effects: {volume: 0.5, playbackRate: 1, loop: true}}]}, //, trackEffects: {duration: 3, visits: 2, sequence: 1, speed: 1}
            effects: this.props.effects, //{volume: 0.5, playbackRate: 1, loop: true}, //is this redundant or what!?
            playing: this.props.playing,
            playIndex: 0,
            addTrack: this.props.addTrack, //i don't think this does anything? not sure
            shapeType: undefined,
            //baseTrack: undefined,
        }
    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps)
        //determines shape you're in, if you're in a shape, and sets this.state.trackSequence accordingly
        this.sequencing(nextProps)
    }

    sequencing(nextProps){
        /*
        will need to parse sequence into player(s)
        -once one track is done (And isn't looping), the next in the sequence should be sent down to player,
        right now it changes right away... but that might be fine?
        -ok, so i need to check playing status in player from sequencer, and if it returns not-playing,
        -we get to the next in the list
        */

        //need base track that starts when you hit start , will be what?? i don't know
        //console.log(nextProps)
        let nextSequence = undefined 
        let nextSong = undefined 
        let shape = undefined 
        if (nextProps.shapeType !== undefined ) { //checks to see if you will be in shape 
            if (this.state.shapeType !== nextProps.shapeType) { //sets state for shapeType if needed
                this.setState({ shapeType: nextProps.shapeType,
                                trackSequence: 
                                    {baseTrack: nextProps.shapeType.trackSequence.baseTrack, 
                                    sequence: nextProps.shapeType.trackSequence.tracks},
                                playing: nextProps.playing,
                })
            }

            shape = nextProps.shapeType.polygon.props.type //works with polygons, not sure about other shapes 
            nextSequence = nextProps.shapeType.trackSequence.tracks 
            nextSong = nextProps.shapeType.trackSequence.baseTrack
            this.typeOfShape(shape, nextSequence, nextSong)
        } else { //checks to see if you will be exiting shape
            //debugger   //HERE- sound design, listen to clock tick and figure out what else is needed

            //sets effects for each individual track to overall effects.. 
            //keeping it this way in case i eventually do want each track to be affected differently.. which I think I do
            const newInBetweenTracks = Object.assign({}, this.state.inBetweenTracks)
            for (let i=0; i<this.state.inBetweenTracks.sequence.length; i++) {
                //debugger 
                newInBetweenTracks.sequence[i].effects = this.state.effects
            }
            //debugger 
            //does NOT set state for each individual track of inBetweenTracks, just in trackSequence. for now anyway
            this.setState({ 
                trackSequence: 
                    {baseTrack: this.state.inBetweenTracks.baseTrack, 
                     sequence: this.state.inBetweenTracks.sequence},
                     playing: nextProps.playing,
            })
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
                    //console.log(newSequence.baseTrack)
                    //return newSequence
                } else { //this means it's the same baseTrack and will only update tracks
                    //debugger 
                    if (this.state.activeTrack !== nextSong) {
                        this.setState({ activeTrack: nextSong})
                    }
                    if (this.state.trackSequence.sequence !== nextSequence) {
                        const newSequence = Object.assign({}, this.state.trackSequence)
                        newSequence.sequence = nextSequence  

                        this.setState({
                            trackSequence: newSequence
                        })
                    }
                }
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
            //debugger 
            if (sequence.baseTrack == "ticktock_song") {
                //debugger 
                const ticktockPaths = sequence.sequence.map(track => {
                   //debugger 
                    switch(track.track) {
                        case("clock_ticking"): 
                            return ["/static/media/clock_ticking.018d1ec5.mp3", track.effects]
                        case("footsteps_on_fallen_leaves"):
                            return ["/static/media/footsteps_on_fallen_leaves.e4c17d10.mp3", track.effects]
                        default: 
                            break 
                    }
                    //still need to get duration up here for when not in polygon
                    //HERE
                    //-need tracks, import em above, then console.log for actual file path
                    //set ticktockPaths (perhaps change name...)
                    //then have this set players
                })
                return ticktockPaths 
                //debugger
            } else {
                //still need to test metroid tracks...
                const trackPaths = sequence.sequence.map(track => { //when you feel like it make the below all 
                                                                    //objects and make path, name, effects as keys
                    switch(track.track) {
                      case("drums_2"): 
                        return ["/static/media/drums_2.47d4832d.mp3", track.effects]
                      case("drums_3"):
                        return ["/static/media/drums_3.218cdb0f.mp3", track.effects]
                      case("drums_main"):
                        return ["/static/media/drums_main.3384accf.mp3", track.effects]
                      case("heavy_synth_1"):
                        return ["/static/media/heavy_synth_1.89e2c3da.mp3", track.effects]
                      case("heavy_synth_2"):
                        return ["/static/media/heavy_synth_2.8cde8bed.mp3", track.effects]
                      case("strings_1"):
                        return ["/static/media/strings_1.2e9c364e.mp3", track.effects]
                      case("synth_1"):
                        return ["/static/media/synth_1.343f14c6.mp3", track.effects]
                      case("synth_2"):
                        return ["/static/media/synth_2.76c1a280.mp3", track.effects]
                      case("weird_swell_1"):
                        return ["/static/media/weird_swell_1.ec27bfe8.mp3", track.effects]
                      case("title_theme"): 
                        return ["/static/media/sm01.9a0b42e8.mp3", track.effects]
                      case("boss_theme_1"): 
                        return ["/static/media/sm05.ff4bf716.mp3", track.effects]
                      case("space_pirates"):
                        return ["/static/media/sm11.2d804c8c.mp3", track.effects] 
                      case("item_ambience"): 
                        return ["/static/media/sm13.16d3a161.mp3", track.effects]
                      case("success"):
                        return ["/static/media/sm14.d618523e.mp3", track.effects]
                      case("jungle_floor"):
                        return ["/static/media/sm15.fbcc2cec.mp3", track.effects] 
                      case("undeground_depths"):
                        return ["/static/media/sm16.cb0f49ec.mp3", track.effects]
                      case("boss_theme_2"):
                        return ["/static/media/sm17.876ee180.mp3", track.effects]
                      case("boss_theme_3"): 
                        return ["/static/media/sm19.11f91494.mp3", track.effects]
                      default: 
                        break 
                    }
                })
                return trackPaths
            }
        }
    }

    createPlayers(playerPaths) {
        //console.log(playerPaths)
        if (playerPaths !== undefined ) {
            //if only one player though eventually i might have all players viewable and only activate the ones being used or
            //i might not show players at all? dunno
            //debugger 
            if (playerPaths.length < 2 ) {
                //debugger 
                playerPaths.map((player) => { 
                    return (
                        <div className="row">
                            <div className="col">
                                <div className="player-wrapper">
                                    <Player 
                                        key={0}
                                        activeTrack={player[0]}  // 
                                        effects={player[1]} //this will be more specific to the part i think
                                        playing={this.state.playing}
                                        trackSequence={this.state.trackSequence} 
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
            const testPlayers = [] 
            console.log(playerPaths)
            //debugger //HERE! 10.2 -- KEY ISN'T WORKING AND ALSO PLAYERS AREN'T UPDATING CORRECTLY THAT IS ALL (NO THERE'S WAY MORE)
            for (let i = 0; i < 8; i++) {
                //console.log(playerPaths[i])
                if (playerPaths[i] !== undefined ) {
                    const newPlayer = <Player trackSequence={this.state.trackSequence} 
                                              activeTrack={playerPaths[i][0]} 
                                              key={i} 
                                              effects={playerPaths[i][1]} 
                                              playing={this.state.playing}/>
                    //console.log(playerPaths[i])
                    testPlayers.push(newPlayer)
                } else {
                    const otherPlayer = <Player trackSequence={this.state.trackSequence} 
                                                key={i} 
                                                activeTrack={undefined} 
                                                effects={this.state.effects} 
                                                playing={undefined}/>
                    testPlayers.push(otherPlayer)
                }
            }
            console.log(testPlayers)
            return (
                <div>
                    <div className="row">
                        <div className="col">
                            {testPlayers[0]}
                        </div>
                        <div className="col">
                            {testPlayers[1]}
                        </div>
                        <div className="col">
                            {testPlayers[2]}
                        </div>
                        <div className="col">
                            {testPlayers[3]}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            {testPlayers[4]}
                        </div>
                        <div className="col">
                            {testPlayers[5]}
                        </div>
                        <div className="col">
                            {testPlayers[6]}
                        </div>
                        <div className="col">
                            {testPlayers[7]}
                        </div>
                    </div>
                </div>
            )
        } else {
            //for some reason if i delete the below it starts playing the out-of-shape tracks automatically... 
            return (
                <div>
                    <div className="row">
                        <div className="col">
                            <Player key={0} activeTrack={undefined} effects={this.state.effects} playing={undefined}/>
                        </div>
                        <div className="col">
                            <Player key={1} activeTrack={undefined} effects={this.state.effects} playing={undefined}/>
                        </div>
                        <div className="col">
                            <Player key={2} activeTrack={undefined} effects={this.state.effects} playing={undefined}/>
                        </div>
                        <div className="col">
                            <Player key={3} activeTrack={undefined} effects={this.state.effects} playing={undefined}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <Player key={4} activeTrack={undefined} effects={this.state.effects} playing={undefined}/>
                        </div>
                        <div className="col">
                            <Player key={5} activeTrack={undefined} effects={this.state.effects} playing={undefined}/>
                        </div>
                        <div className="col">
                            <Player key={6} activeTrack={undefined} effects={this.state.effects} playing={undefined}/>
                        </div>
                        <div className="col">
                            <Player key={7} activeTrack={undefined} effects={this.state.effects} playing={undefined}/>
                        </div>
                    </div>
                </div>
            )
        } 
    }

    render() {
        const playerPaths = this.setTrackPath(this.state.trackSequence) 
        //gets address of tracks
        const playersFromPlayerPaths = this.createPlayers(playerPaths)  
        //takes address of tracks and builds Players to be rendered below in return statement 
        
        //debugger 
        return (
            <div>
                <div className="container">
                    {playersFromPlayerPaths}
                </div>
            </div>
        )
    }
}
