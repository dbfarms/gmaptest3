
import React, { Component } from 'react';

import Pulse from './Pulse';
import geolib from 'geolib'

import Timer from './Timer';
import { millisecondsToHuman } from '../utils/TimerUtils';

export default class LocationChcker extends Component {
    constructor(props) {
        super(props)

        this.handleKey = this.handleKey.bind(this)
        this.state = {
            move: {dir: undefined, distance: undefined},
            marker: this.props.marker,
            markers: this.props.markers,
            polylines: this.props.polylines,
            nowPlaying: this.props.nowPlaying,
            updateMap: this.props.updateMap,
            effects: this.props.effects,
            startPlayer1: this.props.startPlayer1,
            startPlayer2: this.props.startPlayer2,
            timer: false,
            elapsed: undefined, //if the below works do i need this?
            inShape: undefined, 
            durationStats: {shape: undefined, duration: undefined}, //don't know if i'm gonna use this one
            shapesList: {polygons: this.props.polygons, circles: this.props.circles,   
                 rectangles: this.props.rectangles},
            shapeTypeLocation: undefined,
        }

    }

    componentWillReceiveProps(nextProps) {
        //console.log(this.state.marker)
        //console.log(nextProps)
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
            const durationStats = this.state.durationStats //unclear what i'm doing with this yet 
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
            this.state.nowPlaying(polygonActive, effects)
        } else {
            //not in a polygon
            //debugger  //HEY HERE~! maybe make inShape below in similar format to what it would be if it was in a polygon
            //that is to say see console.log of what it looks like with effects and other stuff? 
            //though not totally necessary I guess
            //just more like, pattern-like?

            //debugger 
            this.setState({
                inShape: undefined //can move all that stuff here 
            })
            //debugger 
            const shape = undefined 
            const effects=this.checkEffects(shape)
            this.state.nowPlaying(this.state.inShape, effects)

            //the below hasn't been set up yet
            if (this.state.durationStats.shape !== undefined) {
                this.setState({
                    durationStats: {shape: undefined, duration: undefined} //likely i'll be deleting this... 
                })
            }

            this.state.startPlayer1(); //this is here but... maybe it should be in check location like the other one?
        }
    }

    checkEffects(polygon) {
        //speed?
        //something else?
        //THIS MIGHT BE MOVED TO EFFECTSLIST FOR POLYGON SOMEHOW...
        if (polygon !== undefined ) {
            const center = geolib.getCenter(polygon.polygon.props.path)
            const distanceFromCenter = geolib.getDistance(
                this.state.marker.position,
                center
            );

            const bounds = geolib.getBounds(polygon.polygon.props.path)
            let effectsSet = this.state.effects //{volume: 0.5, playbackRate: 1.0, loop: false}
            //eventually! come up with some means of measuring rate of closing in on center or some inside-boundary and have volume adjust
            //accordingly?

            /// how should check effects work here?
            // 1) squares
            // 2) 
            //
            //

            //

            //console.log(distanceFromCenter)
            if (distanceFromCenter <= 10) {
                //console.log("do i get here?")
                effectsSet.volume = 0.8 //not sure about what max should be, so I made it .8 out of 1
            } else if (distanceFromCenter <= 20 && distanceFromCenter > 10) {
                //console.log("what about here?")
                effectsSet.volume = 0.5
            } else if (distanceFromCenter > 20) {
                effectsSet.volume = 0.3 //again, probably too low? not sure how to make the swell meaningful yet
            }
            //debugger 

            return effectsSet //{volume: , speed: , }
        } else {
            //eventually i need to get this going but first to debug
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
        

        /*
        const newMarkerLocation = Object.assign({}, this.state.marker)

        //MOVES MARKER AS FOLLOWS, EVENTUALLY THIS SHOULD BE MORE MEANINGFUL 
        newMarkerLocation.position.lat = this.state.marker.position.lat + .00004
        newMarkerLocation.position.lng = this.state.marker.position.lng + .00005

        newMarkerLocation.show = true; 

        this.state.startPlayer1()
        this.checkLocation() //checks location for player update
        this.state.updateMap(newMarkerLocation)

        this.setState({
            marker: newMarkerLocation
        })
        */
    }

    timerFunction = () => {
        //debugger 
        this.setState({
            timer: !this.state.timer 
        })
    }

    getDurationInShape = (latestShape, duration) => {

        //debugger 

        //just an example of how it would work
        //eventually the duration would be meaningfully determined by track and polygon
        //

        const durationToSeconds = duration/1000
        if (durationToSeconds >= latestShape.trackEffects.duration) {
            //hoist to Player
            //console.log("DURATION TRIGGERS BUT HAVENT DEFINED YET")
            //debugger 
        }

        /* i don't need to set state here, just hoist the consquences to player
        if (latestShape !== this.state.durationStats.shape || duration !== this.state.durationStats.duration) {
            this.setState({
                durationStats: {shape: latestShape, duration: duration} //see this.state.inShape
            })
        }
        */
    }

    //{//this.state.timer &&
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

//////////////////////////////scrap



        /*
        const pathsList = Object.entries(listOfShapes).forEach(
           ([key, shapeType]) => {
                if (shapeType.length > 0) {
                    const shapeCoords = shapeType.map(shape => {
                        
                        const arrayOfCoords = shape.polygon.props.path //for now its shape.polygon but that'll 
                                                                       //probably change when i actually use other shapes
                        return arrayOfCoords
                    })
                    
                    const shapeTypeAndCoords =[]
                    for (let i=0; i<shapeCoords.length-1; i++) {
                        const inPolygonCheck = geolib.isPointInside(
                            {latitude: latNow, longitude: lngNow},
                            shapeCoords[i]
                        ); 
            
                        if (inPolygonCheck === true ) {
                            return shapeTypeAndCoords.push(key, shapeCoords)
                        } 
                    }
                    return shapeTypeAndCoords
                }
            }
        )

        console.log(pathsList)
        if (pathsList !== undefined) {

            debugger //can i concatenate this.state.___ below?
            //polygonActive = this.state.polygons[i]  //no not necessarily polygons this has to change
            console.log(polygonActive)
        }
        */
        //debugger 

        /* 
            for (let i=0; i<pathsList.length-1; i++) {
            //console.log(this.state.testMarker.marker.props.position)
            //debugger 
            const inPolygonCheck = geolib.isPointInside(
                {latitude: latNow, longitude: lngNow},
                pathsList[i]
            ); 

            if (inPolygonCheck === true ) {
                //debugger 
                debugger //can i concatenate this.state.___ below?
                polygonActive = this.state.polygons[i]  //no not necessarily polygons this has to change
                console.log(polygonActive)
                console.log("in polygon check")
                console.log(inPolygonCheck)

            } 
        }
        */

        //debugger 
//////////////////////////////////////////////// need to fold the below into the above, specifically the for loops at line 91 
        /*
        const listOfPaths = this.state.polygons.map(polygon => {
          const arrayOfCoords = polygon.polygon.props.path
          return arrayOfCoords
        })
        
        let polygonActive = undefined; 
        */
        
        //const listOfPaths=["temporary holder of place"]
        /*
        for (let i=0; i<listOfPaths.length -1; i++) {
            //console.log(this.state.testMarker.marker.props.position)

            const inPolygonCheck = geolib.isPointInside(
                {latitude: latNow, longitude: lngNow},
                listOfPaths[i]
            ); 

            if (inPolygonCheck === true ) {
                //debugger 

                //how to check kind of polygon 
                debugger 
                polygonActive = this.state.polygons[i]  //no not necessarily polygons this has to change
                console.log(polygonActive)
                console.log("in polygon check")
                console.log(inPolygonCheck)
            } 
        } */
        /*
        for (let i =0; i<listOfPaths.length -1; i++) {
          //console.log(this.state.testMarker.marker.props.position)

          const inPolygonCheck = geolib.isPointInside(
            {latitude: latNow, longitude: lngNow},
            listOfPaths[i]
          ); 

          console.log("in polygon check")
          console.log(inPolygonCheck)
          if (inPolygonCheck === true ) {
            //debugger 
            const polygonActive = this.state.polygons[i] 
            //console.log(polygonActive)
            const effects = this.checkEffects(polygonActive);
            const durationStats = this.state.durationStats
            
            console.log("elapsed time in location checker")
            console.log(this.state.elapsed)
            //debugger 

            if (effects !== this.state.effects) {
                this.setState({
                    effects: effects,
                })
            }

            if (this.state.durationStats.shape !== polygonActive) {

                this.setState({
                    durationStats: {
                        shape: polygonActive
                    }
                })
            }


            if (durationStats.du) { ////////////////////////////// 
                this.setState({
                    durationStats: {shape: polygonActive, duration: this.state.elapsed}  //see this.state.inShape 
                })
                
            }
            
            //console.log(effects)
            this.state.nowPlaying(polygonActive, i, effects)
            
          } else {
              console.log(this.state.durationStats)
              if (this.state.durationStats.shape !== null) {
                this.setState({
                    durationStats: {shape: null, duration: null}
                })
                  //debugger  //GETTING FALSE INPOLYGONCHECK HERE EVEN WHEN TI'S TRUE
              }
          }
        } */
        