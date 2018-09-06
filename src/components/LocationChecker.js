
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
        }

    }

    componentWillReceiveProps(nextProps) {
        //sets state of latest shape to be entered 
        console.log(nextProps)
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
        for (let i =0; i<listOfPaths.length -1; i++) {
          //console.log(this.state.testMarker.marker.props.position)
          const inPolygonCheck = geolib.isPointInside(
            {latitude: latNow, longitude: lngNow},
            listOfPaths[i]
          ); // -> true 
          if (inPolygonCheck === true ) {
            //debugger 
            const polygonActive = this.state.polygons[i] 
            console.log(polygonActive)
            const effects = this.checkEffects(polygonActive);
            
            if (effects !== this.state.effects) {
                this.setState({
                    effects: effects
                })
            }
            
            console.log(effects)
            this.state.nowPlaying(polygonActive, i, effects)
            
          }
        }
    }

    checkEffects(polygon) {
        //speed?
        //something else?

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
            console.log("do i get here?")
            effectsSet.volume = 0.8 //not sure about what max should be, so I made it .8 out of 1
        } else if (distanceFromCenter <= 20 && distanceFromCenter > 10) {
            console.log("what about here?")
            effectsSet.volume = 0.5
        } else if (distanceFromCenter > 20) {
            effectsSet.volume = 0.3 //again, probably too low? not sure how to make the swell meaningful yet
        }
        //debugger 

        return effectsSet //{volume: , speed: , }
    }

    returnFunction = () => {
        console.log("running")

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

    render(){
        
        return (
            <div>
                <div>run scheme</div>
                {this.state.timer &&
                    <Timer timer={this.state.timer}/>
                }
                
                
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

/*

import geolib from 'geolib'

const CheckLocation1 = () => {
    debugger 
    console.log("in locationChecker")
    const latNow = this.state.marker.position.lat
    const lngNow = this.state.marker.position.lng 

    const listOfPaths = this.state.polygons.map(polygon => {
      const arrayOfCoords = polygon.polygon.props.path
      return arrayOfCoords
    })

    for (let i =0; i<listOfPaths.length -1; i++) {
      //console.log(this.state.testMarker.marker.props.position)
      const inPolygonCheck = geolib.isPointInside(
        {latitude: latNow, longitude: lngNow},
        listOfPaths[i]
      ); // -> true 
      if (inPolygonCheck === true ) {
        //debugger 
        const polygonActive = this.state.polygons[i] 

        this.state.nowPlaying(polygonActive, i)
        
      }
    }
  }

  export default CheckLocation1

*/