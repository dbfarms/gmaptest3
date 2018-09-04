
/*

    -will receive a shape props on testmarker entry
    -will check center, then check distance to?
    -when x-percentage from center volume increases
    -cool 

geolib.getCenter([
  {latitude: 52.516272, longitude: 13.377722},
  {latitude: 51.515, longitude: 7.453619},
  {latitude: 51.503333, longitude: -0.119722}
]);

    */

import React, { Component } from 'react';

import Pulse from './Pulse';
import geolib from 'geolib'

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
            console.log("checking location correctly")
            const polygonActive = this.state.polygons[i] 
            console.log(polygonActive)
            this.state.nowPlaying(polygonActive, i)
            
          }
        }
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


    render(){
        
        return (
            <div>
                <div>run scheme</div>
                {<Pulse 
                  pulseTime={1} // In Seconds
                  pulseFunction={this.returnFunction}
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