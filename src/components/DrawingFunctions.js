
import React from 'react';
import { Marker, Polygon, Circle, Rectangle, Polyline } from "react-google-maps"
//import { onPolygonChange, onPolygonClick, onPolygonDrag, onMouseOver, onDrag,  } from './MyMapComponent'; //bindRef
import { onTestPolygonChange } from './PolygonFunctions'

export const willHandleDrawingComplete = (props, shapeList) => {

    let newDrawing

    //debugger 

    switch(props.type) {
      case "circle":
        newDrawing = <Circle 
                        props={props}
                        //key={key}
                        //id={key}
                        ref={this.bindRef} //.bind(this)
                        //ref={key}
                        //path={polygon.polygonCoords} //do i need to include this here?
                        //paths={polygon.polygonCoords}
                        strokeColor="#0000FF"
                        strokeOpacity={0.8}
                        strokeWeight={2}
                        fillColor="#0000FF"
                        fillOpacity={0.35} 
                        onClick={this.onPolygonClick} //.bind(this)}
                        onMouseUp={this.onPolygonChange} // .bind(this)
                        onMouseOver={this.onMouseOver} // .bind(this)
                        onDrag={this.onPolygonDrag}
                        options={{
                          editable: true, // this.state.editPolygon ? true : false, //this doesn't work and i don't know why 
                          draggable: true 
                        }}
                     />

        const newCircleList = Object.assign([], this.state.circles)
        newCircleList.push(newDrawing)

        //debugger 
        return (
          this.setState({
            circles: newCircleList
          })
        ) 
      case "polygon":
        debugger
        newDrawing = {polygon: <Polygon 
            props={props}
              //key={key}
              //id={key}
              //ref={bindRef}
              //ref={key}
              //path={polygon.polygonCoords} //do i need to include this here?
              //paths={polygon.polygonCoords}
              strokeColor="#0000FF"
              strokeOpacity={0.8}
              strokeWeight={2}
              fillColor="#0000FF"
              fillOpacity={0.35} 
              //onClick={onPolygonClick} //.bind(this)}
              onMouseUp={onTestPolygonChange} // .bind(this), key)}
              //onDrag={onPolygonDrag}
              options={{
                editable: true, // this.state.editPolygon ? true : false, //this doesn't work and i don't know why 
                draggable: true 
              }}
        />, track: ""}

        //const newPolygonList = Object.assign([], this.state.polygons)
        //newPolygonList.push(newDrawing)
        return newDrawing
        //debugger 
        /*
        return (
          this.setState({
            polygons: newPolygonList
          })
        ) 
        */
      case "polyline":
        newDrawing = <Polyline 
              props={props}
              //key={key}
              //id={key}
              ref={this.bindRef.bind(this)}
              //ref={key}
              //path={polygon.polygonCoords} //do i need to include this here?
              //paths={polygon.polygonCoords}
              strokeColor="#0000FF"
              strokeOpacity={0.8}
              strokeWeight={2}
              fillColor="#0000FF"
              fillOpacity={0.35} 
              onClick={this.onPolygonClick} //.bind(this)}
              onMouseUp={this.onPolygonChange.bind(this)} //, key)}
              onDrag={this.onPolygonDrag}
              options={{
                editable: true, // this.state.editPolygon ? true : false, //this doesn't work and i don't know why 
                draggable: true 
              }}
          />

          const newPolylineList = Object.assign([], this.state.polylines)
          newPolylineList.push(newDrawing)

          //debugger 
          return (
            this.setState({
              polylines: newPolylineList
            })
          ) 
      case "marker":
        newDrawing = <Marker 
              props={props}
          />

          const newMarkerList = Object.assign([], this.state.markers)
          newMarkerList.push(newDrawing)

          //debugger 
          return (
            this.setState({
              markers: newMarkerList
            })
          ) 
      case "marker":
        newDrawing = <Rectangle 
              props={props}
          />

          const newRectangleList = Object.assign([], this.state.rectangles)
          newRectangleList.push(newDrawing)

          //debugger 
          return (
            this.setState({
              rectangles: newRectangleList
            })
          ) 
      default:
        break 
    }

    //debugger 
  }
