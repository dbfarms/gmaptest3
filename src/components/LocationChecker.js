
import React, { Component } from 'react';

import Pulse from './Pulse';
import geolib from 'geolib'

import Timer from './Timer';
import { millisecondsToHuman } from '../utils/TimerUtils';

export default class LocationChcker extends Component {
    constructor(props) {
        super(props)

        this.state = {
            marker: this.props.marker,
            markers: this.props.markers,
            polylines: this.props.polylines,
            nowPlaying: this.props.nowPlaying,
            updateMap: this.props.updateMap,
            effects: this.props.effects,
            startPlayer1: this.props.startPlayer1,
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
        //console.log(nextProps)
        //debugger 
        const newShapesList = Object.assign({}, this.state.shapesList)
        newShapesList.polygons = nextProps.polygons
        newShapesList.rectangles = nextProps.rectangles
        newShapesList.circles = nextProps.circles 

        this.setState({
            marker: nextProps.marker,
            shapesList: newShapesList,
            markers: nextProps.markers,
            polylines: nextProps.polylines,
            shapesList: newShapesList,
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
                        //debugger 
                    } 
                }
            }
        }

        if (polygonActive !== undefined ) {
            
            // this should only happen if it's a square? put that in
            const effects = this.checkEffects(polygonActive);

            //debugger 
            const durationStats = this.state.durationStats //unclear what i'm doing with this yet 
            
            //console.log("elapsed time in location checker")
            //console.log(this.state.elapsed)
            //debugger 

            //how effects should operate here is unclear... right now polygons can trigger track part AND effect but maybe some 
            //shapes should just be effects and some just track stuff
            if (effects !== this.state.effects) {
                this.setState({
                    effects: effects,
                })
            }
 
            //console.log("sets polygonActive: ")
            //console.log(polygonActive)
            this.setState({
                inShape: polygonActive
            })

            //console.log(effects)
            this.state.nowPlaying(polygonActive, effects)
        } else {
            //console.log(this.state.durationStats)
            //console.log("in polygon check")
            //console.log(polygonActive)
            if (this.state.durationStats.shape !== undefined) {
            this.setState({
                durationStats: {shape: undefined, duration: undefined} //likely i'll be deleting this... 
            })
            }
        }
    }

    checkEffects(polygon) {
        //speed?
        //something else?
        //THIS MIGHT BE MOVED TO EFFECTSLIST FOR POLYGON SOMEHOW...

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
    }

    startTestRun = () => {
        //console.log("running")

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
        