
import React, { Component } from 'react';

import Pulse from './Pulse';
import geolib from 'geolib'

import Timer from './Timer';
import { millisecondsToHuman } from '../utils/TimerUtils';

export default class LocationChcker extends Component {
    constructor(props) {
        super(props)
        console.log(props)

        this.state = {
            marker: this.props.marker,
            //shape: this.props.shape,
            //location: this.props.location,
            polygons: this.props.polygons, // combine all shapes together in one object?
            nowPlaying: this.props.nowPlaying,
            //returnFunction: this.props.returnFunction,
            updateMap: this.props.updateMap,
            effects: this.props.effects,
            timer: false,
            elapsed: undefined, //if the below works do i need this?
            inShape: undefined, 
            durationStats: {shape: undefined, duration: undefined}, //don't know if i'm gonna use this one
        }

    }

    componentWillReceiveProps(nextProps) {
        //sets state of latest shape to be entered 
        //console.log(nextProps)
        //debugger 
        this.setState({
            marker: nextProps.marker,
            polygons: nextProps.polygons, 
        })
    }



    checkLocation = () => {
    
        //console.log(" im ade it this far")
        const latNow = this.state.marker.position.lat
        const lngNow = this.state.marker.position.lng 
    
        const listOfPaths = this.state.polygons.map(polygon => {
          const arrayOfCoords = polygon.polygon.props.path
          return arrayOfCoords
        })
        
        //debugger 

        let polygonActive = undefined; 

        for (let i=0; i<listOfPaths.length -1; i++) {
            //console.log(this.state.testMarker.marker.props.position)

            const inPolygonCheck = geolib.isPointInside(
                {latitude: latNow, longitude: lngNow},
                listOfPaths[i]
            ); 

            if (inPolygonCheck === true ) {
                //debugger 
                polygonActive = this.state.polygons[i] 
                console.log(polygonActive)
                console.log("in polygon check")
                console.log(inPolygonCheck)
            } 
        }

        if (polygonActive !== undefined ) {
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
 
            //console.log("sets polygonActive: ")
            //console.log(polygonActive)
            this.setState({
                inShape: polygonActive
            })

            //console.log(effects)
            this.state.nowPlaying(polygonActive, effects)
        } else {
            console.log(this.state.durationStats)
            console.log("in polygon check")
            console.log(polygonActive)
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

    returnFunction = () => {
        //console.log("running")

        const newMarkerLocation = Object.assign({}, this.state.marker)

        //MOVES MARKER AS FOLLOWS, EVENTUALLY THIS SHOULD BE MORE MEANINGFUL 
        newMarkerLocation.position.lat = this.state.marker.position.lat + .00004
        newMarkerLocation.position.lng = this.state.marker.position.lng + .00005

        newMarkerLocation.show = true; 

        this.checkLocation()

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
        if (durationToSeconds >= latestShape.effectsList.duration) {

            debugger 
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
                  pulseFunction={this.returnFunction}
                  stopPlayingTest={this.props.stopPlayingTest}
                  timerFunction={this.timerFunction}
                />}
            </div>
            

        )
    }
}

//////////////////////////////scrap

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
        