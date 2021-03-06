
import React, { Component } from 'react';

import Pulse from './Pulse';
import geolib from 'geolib'

import Timer from './Timer';
import { millisecondsToHuman } from '../utils/TimerUtils';

export default class LocationChcker extends Component {
    constructor(props) {
        super(props)

        this.getDurationInShape = this.getDurationInShape.bind(this)
        this.handleKey = this.handleKey.bind(this)
        this.state = {
            move: {dir: undefined, distance: undefined},
            marker: this.props.marker,
            markers: this.props.markers,
            polygons: this.props.polygons,
            polylines: this.props.polylines,
            nowPlaying: this.props.nowPlaying,
            updateMap: this.props.updateMap,
            effects: this.props.effects,
            startPlayer1: this.props.startPlayer1,
            startPlayer2: this.props.startPlayer2,
            timer: false,
            inShape: undefined, 
            durationEffects: {timeLimit: 1000, duration: 0, shape: undefined, playbackRate: 1, volume: 0.5}, //for playback rate 
            shapesList: {polygons: this.props.polygons, circles: this.props.circles,   
                 rectangles: this.props.rectangles},
            shapeTypeLocation: undefined,
            upSpeed: this.props.upSpeed,
            getInfo: this.props.getInfo,
        }

    }

    componentWillReceiveProps(nextProps) {
        //console.log(this.state.marker)
        console.log(nextProps)
        //debugger 
        const newShapesList = Object.assign({}, this.state.shapesList)
        newShapesList.polygons = nextProps.polygons
        newShapesList.rectangles = nextProps.rectangles
        newShapesList.circles = nextProps.circles 

        if (this.state.move.dir !== undefined ) {
            this.setState({move: {dir: undefined, distance: undefined}})
        }
        this.setState({
            marker: nextProps.marker,
            shapesList: newShapesList,
            markers: nextProps.markers,
            polylines: nextProps.polylines,
            //shapesList: newShapesList,
        })
    }

    checkLocation = () => {
    
        const latNow = this.state.marker.position.lat
        const lngNow = this.state.marker.position.lng 
        const listOfShapes = this.state.shapesList
        //console.log(listOfShapes)

        //debugger 
        //what if you can be in two shapes at once? for another day...
        let polygonActive = undefined 
        for (const key of Object.keys(listOfShapes)) {
            const shapeType = listOfShapes[key]
            if (shapeType.length > 0) {
                const shapeCoords = shapeType.map(shape => {
                    const arrayOfCoords = shape.polygon.props.path //for now its shape.polygon but that'll 
                                                                   //probably change when i actually use other shapes
                    return arrayOfCoords
                })
                
                for (let i=0; i<shapeCoords.length-1; i++) {
                    console.log("does it break here")
                    const inPolygonCheck = geolib.isPointInside(
                        {latitude: latNow, longitude: lngNow},
                        shapeCoords[i]
                    ); 
        
                    if (inPolygonCheck === true ) {
                        //debugger 
                        polygonActive = this.state.shapesList[key][i]
                        this.state.startPlayer1(); //this starts player but maybe it should only do that if there's something to play?
                        //debugger 
                    } 
                }
            }
        }

        if (polygonActive !== undefined ) {
            
            const effects = this.checkEffects(polygonActive); // this should only happen if it's a square? put that in. maybe.
            const durationEffects = this.state.durationEffects //unclear what i'm doing with this yet 
            //how effects should operate here is unclear... right now polygons can trigger track part AND effect but maybe some 
            //shapes should just be effects and some just track stuff
            if (effects !== this.state.effects) {
                this.setState({
                    effects: effects,
                })
            }
            this.setState({
                inShape: polygonActive
            })
            //console.log(effects)
            //debugger 
            this.state.nowPlaying(polygonActive, effects)
        } else {
            //not in a polygon
            //debugger  //HEY HERE~! maybe make inShape below in similar format to what it would be if it was in a polygon
            //that is to say see console.log of what it looks like with effects and other stuff? 
            //though not totally necessary I guess
            //just more like, pattern-like?
            //also in the case the tracks change for not-in-shape
            //right now i'll keep it this way though cause it's fine mostly

            this.setState({
                inShape: undefined //can move all that stuff here 
            })
            const shape = undefined 
            const effects=this.checkEffects(shape) //right now there are no effects for out-of-shape determined here but maybe one day
            
            /*
            if (this.state.durationEffects.duration > 0) {
                debugger 
                this.state.nowPlaying(shape, effects)
            }
            */ 

            this.state.nowPlaying(shape, effects)
        }
        this.distanceToNearestMarker(latNow, lngNow)
    }

    distanceToNearestMarker(latNow, lngNow){
        //this just checks to nearest marker, maybe one day i'll wnat to get distance to all
        //also maybe change to polygons instead
        const markers = {}
        this.state.markers.map((marker, key) => {
            //debugger 
            if (key > 0) { //marker at key 0 at present is geoLoc
                Object.assign(markers, {[marker.marker.props.name]: {latitude: marker.marker.props.position.lat, 
                    longitude: marker.marker.props.position.lng}})
            } else {
                Object.assign(markers, {"here": {latitude: latNow, longitude: lngNow}})
            }
        }) 

        //debugger 
        const closestMarker = geolib.findNearest(markers['here'], markers, 1)
        //avg walking speed 1.4 meters/sec so time to place should be closestMarker/1.4 
        const timeToNextMarker = closestMarker.distance / 1.4 //maybe this change depending on if you need to run to next one..?
        //but this should just be a suggestion 
        //debugger 
        const newDurationEffects = Object.assign({}, this.state.durationEffects)
        newDurationEffects.timeLimit = timeToNextMarker
        this.setState({
            durationEffects: newDurationEffects
        })
    }

    checkEffects(polygon) {
        //THIS MIGHT BE MOVED TO EFFECTSLIST FOR POLYGON SOMEHOW...
        //debugger 
        if (polygon !== undefined ) {
            //debugger 
            const center = geolib.getCenter(polygon.polygon.props.path)
            const distanceFromCenter = geolib.getDistance(
                this.state.marker.position,
                center
            );
            let effectsSet = this.state.effects //{volume: 0.5, playbackRate: 1.0, loop: false}
            
            if (distanceFromCenter <= 10) {
                //console.log("do i get here?")
                effectsSet.volume = 0.8 //not sure about what max should be, so I made it .8 out of 1
            } else if (distanceFromCenter <= 20 && distanceFromCenter > 10) {
                //console.log("what about here?")
                effectsSet.volume = 0.5
            } else if (distanceFromCenter > 20) {
                effectsSet.volume = 0.3 //again, probably too low? not sure how to make the swell meaningful yet
            }

            const bounds = geolib.getBounds(polygon.polygon.props.path)

            //debugger 
            //eventually! come up with some means of measuring rate of closing in on center or some inside-boundary and have volume adjust
            //accordingly?
            /// how should check effects work here?
            // 1) squares
            // 2) 

            return effectsSet //{volume: , speed: , }
        } else {
            //what effects here?
            return this.state.effects 
        }
    }

    handleKey(e){
        e.preventDefault()
        switch(e.key) {
            case("ArrowUp"):
                this.setState({move: {dir: "lat", distance: .00004}})
                break //return .00004
            case("ArrowRight"):
                this.setState({move: {dir: "lng", distance: .00004}})
                break
            case("ArrowLeft"):
                this.setState({move: {dir: "lng", distance: -.00004}})
                break 
            case("ArrowDown"):
                this.setState({move: {dir: "lat", distance: -.00004}})
                break
            default:
                this.setState({move: {dir: undefined, distance: undefined}})
                break
        }
    }

    startTestRun = () => {
        //moves testMarker around at pace you feel like going to better test music
        const movement = document.addEventListener('keydown', this.handleKey)
        const newMarkerLocation = Object.assign({}, this.state.marker)

        if (this.state.move.dir !== undefined) {
            if (this.state.move.dir === "lat") {
                newMarkerLocation.position.lat = this.state.marker.position.lat + this.state.move.distance
            } else if (this.state.move.dir === "lng") {
                newMarkerLocation.position.lng = this.state.marker.position.lng + this.state.move.distance
            }

            newMarkerLocation.show = true; 
            this.checkLocation() //checks location for player update
            this.state.updateMap(newMarkerLocation)

            this.setState({
                marker: newMarkerLocation
            })
        }
    }

    timerFunction = () => {
        //debugger 
        this.setState({
            timer: !this.state.timer 
        })
    }

    getDurationInShape = (latestShape, duration) => {
        //just an example of how it would work
        //eventually the duration would be meaningfully determined by track and polygon

        //debugger 
        const durationToSeconds = duration/1000
        console.log(latestShape)
        //console.log(this.state.durationEffects.duration)
        //console.log(durationToSeconds)
        if (latestShape !== undefined ) {
            if (durationToSeconds >= latestShape.trackEffects.duration) {
                //if you're in a shape for a certain amount of time, what happens? 
                //hoist to Player
                //console.log("DURATION TRIGGERS BUT HAVENT DEFINED YET")
                //debugger 
            }
        } else {
            const timeLimit = this.state.durationEffects.timeLimit

            //below used to be: durationToSeconds % 3 === 0 && durationToSeconds !== this.state.durationEffects.duration
            console.log(durationToSeconds)
            if (durationToSeconds % 10 === 0 && durationToSeconds !== this.state.durationEffects.duration) {
                debugger 
                //how far should each polygon be from each other? probably a good idea
                //to come up with an upper limit of distance per means of movement (i.e. car, bike, walking, etc)
                //so can/should this inform automated marker-maker in mymapcomp?
                //which is where menu comes in handy. how far is one marker to the next?
                //ok here's something
                //it's for map making purposes that this matters

                const newDurationEffects = Object.assign({}, this.state.durationEffects)
                newDurationEffects.duration = durationToSeconds 
                //console.log(this.state.durationEffects)
                newDurationEffects.playbackRate = this.state.durationEffects.playbackRate + 1 
                newDurationEffects.volume = this.state.durationEffects.volume + 0.1 
                //console.log(newDurationEffects.playbackRate)
                if (newDurationEffects.playbackRate > 5) {
                    console.log("out of time, now what?")
                    //it's been 12 seconds,  probably should be more time? maybe there should be a custom amount of
                    //time between ... so, how to do that?
                    //options for out-of-shape tracks
                    //so like, instead of defining inShape as undefined when not in shape, define it as a baseTrack?
                    //does that make sense? or if it's out of shape, then you get the option to define it as a baseTrack
                    //so different sequences can happen
                    ///but maybe it should all be the same. hm...

                    //anyway so what now?
                    //end game? subtract something like... health? or... whatever.
                    
                    //debugger 
                } else {
                    this.state.upSpeed(newDurationEffects)
                    this.setState({ 
                        durationEffects: newDurationEffects,
                    })
                }
            }
        }
    }

    render(){
        return (
            <div>
                <div>run scheme</div>
                <Timer isRunning={this.state.timer} getDuration={this.getDurationInShape} inShape={this.state.inShape}/>
                {<Pulse 
                    pulseTime={1} // In Seconds
                    pulseFunction={this.startTestRun}
                    stopPlayingTest={this.props.stopPlayingTest}
                    timerFunction={this.timerFunction}
                 />
                }
            </div>
        )
    }
}
