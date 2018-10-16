    /*
    -maybe relearn redux...
      -will want to once i start on backend so maybe get going now?

      top layer calls in player and map
      -receives information from map to send to player and other way around 
      
      map
      -right now map does too much within file
        -separate out functions (but, how again?)
          -relearn how to do this, probably importing some way
        -move drawingfunction functions to file? etc
      */ 

import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon, Circle, Rectangle, Polyline } from "react-google-maps"
import DrawingManager from "react-google-maps/lib/components/drawing/DrawingManager";
//import { connect } from 'react-redux'
//import { bindActionCreators } from 'redux';

//import Pulse from './Pulse';
import ShapeMenu from './ShapeMenu';
import { willHandleDrawingComplete } from './DrawingFunctions';

import geolib from 'geolib'
//still to make or maybe not i dunno
import {onTestPolygonChange} from './PolygonFunctions'
//import checkLocation from './TestFunctions';
import PolylinenFunctions from './PolylineFunctions';
import LocationChecker from "./LocationChecker";

const google = window.google;

const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=" + process.env.REACT_APP_API_URL + "&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100vh` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
    <div>
        {console.log(props)}
        <GoogleMap
            defaultZoom={18}
            defaultCenter={{ lat: props.geoLoc.lat, lng: props.geoLoc.lng }}
        >
            {props.isMarkerShown && 
                <Marker position={{ lat: props.geoLoc.lat, lng: props.geoLoc.lng }} onClick={props.onMarkerClick} />
            }
            
            {props.markersList.map((marker, key) => {
                return marker.marker
            })}

            {props.polygonToDraw}
            <Polyline
                  path={props.polylines}
                  strokeColor="#0000FF"
                  strokeOpacity={0.8}
                  strokeWeight={2} 
                />

            {props.testMarker.show === true &&
              <div>
                {/*console.log(props.testMarker)*/}
                <Marker position={{lat: props.testMarker.position.lat, lng: props.testMarker.position.lng}} />
                
                {props.thisTestMarker}
              </div>
            }

            {props.running !== false &&
              <DrawingManager
                onCircleComplete={props.onDrawingComplete} 
                onMarkerComplete={props.onDrawingComplete}
                onOverlayComplete={props.onDrawingComplete}
                onPolygonComplete={props.onDrawingComplete}
                onPolylineComplete={props.onDrawingComplete}
                onRectangleComplete={props.onDrawingComplete}
              />
            }

        </GoogleMap>
    </div>
  
)//)

export default class MyFancyComponent extends React.PureComponent {
  constructor(props) {
    super(props)

    //debugger

    this.handleDrawingComplete = this.handleDrawingComplete.bind(this)
    this.onTestPolygonChange = onTestPolygonChange.bind(this)
    this.chooseTrack = this.chooseTrack.bind(this)
    //this.onRadioChange = this.onRadioChange.bind(this)
    this.state = {
      isMarkerShown: true,
      polyMenu: {key: '', type: ''},
      geoLoc: this.props.geoLoc,
      testMarker: {position: "", marker: "", show: false},
      markers: [],
      polygons: [],
      rectangles: [],
      polylines: [],
      circles: [],
      //timer: 0,
      running: false,
      shapeMenu: null,
      nowPlaying: this.props.nowPlaying,
      tracks: this.props.tracks,
      effects: this.props.effects,
      stopPlayingTest: this.props.stopPlayingTest,
      startPlayer1: this.props.startPlayer1,
      startPlayer2: this.props.startPlayer2,
      upSpeed: this.props.upSpeed,
      menuSet: false,
      gameSet: "lee",
      users: ["lee", "matt"]
    }
  }

  componentWillMount() { //THIS IS IN PLACE OF COMPONENTWILLRECEIVEPROPS BECAUSE THERE'S A SET GEOLOC FOR NOW 111111111111111
    //debugger 

    if (this.props.geoLoc) { //used to be nextProps.geoLoc
      
      let geoLoc = this.state.geoLoc 
      let createTestMarker = {};
      let actualMarker; 
      //debugger
      if (this.state.testMarker.position !== "" ) {
        //console.log("this one")
        //debugger 
        createTestMarker = this.state.testMarker
       // console.log(createTestMarker)
      } else { 
        //console.log(this.state.geoLoc)
        //debugger 
        createTestMarker = {position: {lat: this.state.geoLoc.lat - .0000005, lng: this.state.geoLoc.lng - .0000005}, 
        marker: "", show: false}
        actualMarker = <Marker 
        position= {{lat: this.state.geoLoc.lat - .0000008, lng: this.state.geoLoc.lng - .0000008}} latLng={this.latLng} lat={this.lat} lng={this.lng}/>
        createTestMarker.marker = actualMarker

        /*
        plan: have a few markers as points to work/walk towards
        how: enter miles to travel?
        -map out route with api?
        -pointers? suggest routes?
        -if no map (i.e. woods) then what?
        -have volume drop if going in wrong direction... or... lose tracks from sequence! but that can be confusing if path
        is windy

        by what means should proxmity be measured? lat/lng and...? 

        new plan:
        -baseTrack plays for x-duration. 
        -slowly shifts over time(adds tracks? subtracts tracks?)
        -hit triggers that make additional sounds (swells?)
        -randomly place effects as you walk?
        -control panel on phone to change track when you want as well?
        -arrows pointing you in possible directions to do things
        -create 'sets' of tracks that build... so 1,2,3 then 1,2,3,4, then etc... if you move away from
        marker effects or something triggers? affects sequences? slows down?
        how does the above work with duration affecting sequences? 
        -success sounds?
        */ 

        //debugger //HERE, 10.11 - this.state.markers is the polygon and location of marker, but not marker props
        //so maybe you want to make that something else and keep this.state.markers what is at

        //const center = geolib.getCenter([{lat: 40.87618528878572, lng: -73.88435958684386}, {lat: 40.8762258505083, lng: -73.8844561463684}, {lat: 40.876152839389775, lng: -73.88447089851798}])
        //debugger 

        // EVNTUALLY THE BELOW WILL BE FETCHED FROM SERVER
        if (this.state.gameSet=="lee") {

        } else if (this.state.gameSet="matt") {

        }
        const type = "polygons"
        const center0 = geolib.getCenter([{lat: 40.87618528878572, lng: -73.88435958684386}, {lat: 40.8762258505083, lng: -73.8844561463684}, {lat: 40.876152839389775, lng: -73.88447089851798}])
        const polygon0 = [{lat: 40.87618528878572, lng: -73.88435958684386}, {lat: 40.8762258505083, lng: -73.8844561463684}, {lat: 40.876152839389775, lng: -73.88447089851798}]
        const center1 = geolib.getCenter([{lat: 40.87588628646609, lng: -73.88355468029476}, {lat: 40.875772712997694, lng: -73.88368342632748}, {lat: 40.875752432000695, lng: -73.88348226065136}])
        const polygon1 = [{lat: 40.87588628646609, lng: -73.88355468029476}, {lat: 40.875772712997694, lng: -73.88368342632748}, {lat: 40.875752432000695, lng: -73.88348226065136}]
        const center2 = geolib.getCenter([{lat: 40.875048635084084, lng: -73.88400480372002}, {lat: 40.87493911642865, lng: -73.88411745649864}, {lat: 40.87496751017153, lng: -73.88384923559715}])
        const polygon2 = [{lat: 40.875048635084084, lng: -73.88400480372002}, {lat: 40.87493911642865, lng: -73.88411745649864}, {lat: 40.87496751017153, lng: -73.88384923559715}]
        const markersForMapping = [[center0, polygon0], [center1, polygon1], [center2, polygon2]]
        //const newRef = this.bindRef.bind(this) 
        let markerListHere = markersForMapping.map((marker, key)=> {
          return {marker: <Marker name={"marker" + key} position={marker[0]} 
                            onClick={this.onMarkerClick.bind(this)} key={key}/>, 
                    polygon: {
                    position: marker[0],
                    polygonCoords: marker[1], 
                    polygonObject: <Polygon key={key}
                      id={key}
                      ref={undefined} //newRef ... wait for mapping to bind 
                      type={"polygons"}
                      //ref={key}
                      path={marker[1]} //see below
                      paths={marker[1]} //not sure what difference use is between the two
                      strokeColor="#0000FF"
                      strokeOpacity={0.8}
                      strokeWeight={2}
                      fillColor="#0000FF"
                      fillOpacity={0.35} 
                      onClick={this.onPolygonClick} //.bind(this)}
                      onMouseUp={this.onPolygonChange.bind(this, key) } // this.onTestPolygonChange
                      onDrag={this.onPolygonDrag}
                      onMouseOver={this.onMouseOver.bind(this, key, type)}
                      options={{
                        editable: true, // this.state.editPolygon ? true : false, //this doesn't work and i don't know why 
                        draggable: true 
                      }}
                  />}}//, trackSequence: {baseTrack: 'shayna_song', tracks: []}, trackEffects: {duration: 3, visits: 2, sequence: 1, speed: 1}} /// see below
        })                     
        //debugger //marker and polygon above are incomplete
        //keep making marker/'gons along set path for demo purpose
                                
          /*                  
        for (let i = 0; i<5; i++) {
          let markerObject = {position: [], polygonCoords: [], polygonObject: []}; 
          let newMarker = []
          let polygonCoordsSketch
          if (i === 0 ) {
            newMarker[0] = this.state.geoLoc.lat;
            newMarker[1] = this.state.geoLoc.lng;
            markerObject.position = newMarker 
            polygonCoordsSketch = [
              {lat: newMarker[0] + .00003, lng: newMarker[1] - .00003},
              {lat: newMarker[0] + .00005, lng: newMarker[1] - .00003},
              {lat: newMarker[0] - .00005, lng: newMarker[1] + .00005},
            ];
          } else {
            let newPosition = i * .00006
            newMarker[0] = this.state.geoLoc.lat + newPosition;
            newMarker[1] = this.state.geoLoc.lng + newPosition;
            markerObject.position = newMarker 
            polygonCoordsSketch = [
              {lat: newMarker[0] + .00003, lng: newMarker[1] - .00003},
              {lat: newMarker[0] - .00005, lng: newMarker[1] - .00003},
              {lat: newMarker[0] - .00005, lng: newMarker[1] + .00005},
            ];
          }

          const marker = <Marker 
              name={"marker" + i}
              position={{lat: newMarker[0], lng: newMarker[1]}}
              onClick={this.onMarkerClick.bind(this)}
              key={i}
            />
          markerObject.polygonCoords = polygonCoordsSketch
          markerListHere.push({marker: marker, polygon: markerObject})
        } */


        /*
          creates circles which do what?
        */

        this.createCircles();

        //debugger 
        const testPolyLine = [ 
          {lat: this.state.geoLoc.lat, lng: this.state.geoLoc.lng },
          {lat: this.state.geoLoc.lat + .001, lng: this.state.geoLoc.lng + .002},
          {lat: this.state.geoLoc.lat + .001, lng: this.state.geoLoc.lng + .002},
        ]
        //console.log(testPolyLine)
        //console.log(createTestMarker)
        //debugger 
        this.setState ({
          markers: markerListHere,
          polylines: testPolyLine,
          testMarker: createTestMarker,
          menuSet: true,
        })
      }
    }
  }

  /*
  componentDidUpdate(prevState, props) {
    //debugger
    //console.log(prevState)
    //console.log(props)
  }
  */

  componentWillReceiveProps(nextProps){
    //console.log(this)
    //console.log(nextProps)
    debugger 
    this.setState({
      geoLoc: nextProps.geoLoc
    })

    //eventually this will load from the server from saved maps, or will not exist for new maps **********************888
    //right now it just sets to state predetermined positions based on location
    //also it creates the polygon here though it'll have to be done elsewhere soon
    debugger 
    if (this.state.geoLoc) { //used to be nextProps.geoLoc
      console.log("geo loc works")

      let createTestMarker;
      let actualMarker; 
      //debugger
      if (this.state.testMarker.position !== "" ) {
        //console.log("this one")
        //debugger 
        createTestMarker = this.state.testMarker
       // console.log(createTestMarker)
      } else { 
        createTestMarker = {position: {lat: nextProps.geoLoc.lat - .0000005, lng: nextProps.geoLoc.lng - .0000005}, 
        marker: "", show: false}
        actualMarker = <Marker 
        position= {{lat: nextProps.geoLoc.lat - .0000008, lng: nextProps.geoLoc.lng - .0000008}} latLng={this.latLng} lat={this.lat} lng={this.lng}/>
        createTestMarker.marker = actualMarker

        /*
        plan: have a few markers as points to work/walk towards
        how: enter miles to travel?
        -map out route with api?
        -pointers? suggest routes?
        -if no map (i.e. woods) then what?
        -have volume drop if going in wrong direction... or... lose tracks from sequence! but that can be confusing if path
        is windy

        by what means should proxmity be measured? lat/lng and...? 

        new plan:
        -baseTrack plays for x-duration. 
        -slowly shifts over time(adds tracks? subtracts tracks?)
        -hit triggers that make additional sounds (swells?)
        -randomly place effects as you walk?
        -control panel on phone to change track when you want as well?
        -arrows pointing you in possible directions to do things
        -create 'sets' of tracks that build... so 1,2,3 then 1,2,3,4, then etc... if you move away from
        marker effects or something triggers? affects sequences? slows down?
        how does the above work with duration affecting sequences? 
        -success sounds?
        */ 

        //debugger //HERE, 10.11 - this.state.markers is the polygon and location of marker, but not marker props
        //so maybe you want to make that something else and keep this.state.markers what is at

        let markerListHere = []
        for (let i = 0; i<5; i++) {
          let markerObject = {position: [], polygonCoords: [], polygonObject: []}; 
          let newMarker = []
          let polygonCoordsSketch
          if (i === 0 ) {
            newMarker[0] = nextProps.geoLoc.lat;
            newMarker[1] = nextProps.geoLoc.lng;
            markerObject.position = newMarker 
            polygonCoordsSketch = [
              {lat: newMarker[0] + .0003, lng: newMarker[1] - .0003},
              {lat: newMarker[0] + .0005, lng: newMarker[1] - .0003},
              {lat: newMarker[0] - .0005, lng: newMarker[1] + .0005},
            ];
          } else {
            let newPosition = i * .0006
            newMarker[0] = nextProps.geoLoc.lat + newPosition;
            newMarker[1] = nextProps.geoLoc.lng + newPosition;
            markerObject.position = newMarker 
            polygonCoordsSketch = [
              {lat: newMarker[0] + .0003, lng: newMarker[1] - .0003},
              {lat: newMarker[0] - .0005, lng: newMarker[1] - .0003},
              {lat: newMarker[0] - .0005, lng: newMarker[1] + .0005},
            ];
          }

          const marker = <Marker 
              name={"marker" + i}
              position={{lat: newMarker[0], lng: newMarker[1]}}
              onClick={()=> console.log("test")}//{this.onMarkerClick.bind(this)}
              key={i}
            />
          markerObject.polygonCoords = polygonCoordsSketch
          markerListHere.push({marker: marker, polygon: markerObject})
        }

        /*
          creates circles which do what?
        */

        this.createCircles();

        const geoLoc = nextProps.geoLoc
        //debugger 
        const testPolyLine = [ 
          {lat: geoLoc.lat, lng: geoLoc.lng },
          {lat: geoLoc.lat + .001, lng: geoLoc.lng + .002},
          {lat: geoLoc.lat + .001, lng: geoLoc.lng + .002},
        ]
        //console.log(testPolyLine)
        //console.log(createTestMarker)
        //debugger 
        this.setState ({
          markers: markerListHere,
          polylines: testPolyLine,
          testMarker: createTestMarker,
          menuSet: true,
        })
      }
    }
  }

  createCircles() {

    //circles will affect effects, so volume? speed? maybe 
    // how to execute this? i don't know. i don't know! I DONT KNOW. gah. so you walk around and you hit a trigger and the song
    //starts and then you keep walking and it evolves so it needs some kind of meaningful designation of song parts?
    //
    //debugger 
  }

  /*
  handleDrawingComplete(props) {
    //debugger 
    
    switch(props.type) {
      case "circle":
        const newCircleList = Object.assign([], this.state.circles)

        //debugger 
        return (
          this.setState({
            circles: newCircleList
          })
        ) 
      case "polygon":
      //how to get functions that require this (and do they really require this or not?)
        const polygonList = Object.assign([], this.state.polygons)
        const newList = willHandleDrawingComplete(props, polygonList)

              
              debugger 
        return ( this.setState({ polygons: newList}))
      case "polyline":
          const polylineList = Object.assign([], this.state.polylines)
          //newPolylineList.push(newDrawing)
          return willHandleDrawingComplete(props, polylineList)
      
      case "marker":
        const markersList = Object.assign([], this.state.markers)
        //debugger 
        return willHandleDrawingComplete(props, markersList)
      default:
        break 
    } 
    //willHandleDrawingComplete(props) //.bind(this)
  }
  */  

  handleDrawingComplete = (props) => {

    let newDrawing

    //debugger 

    switch(props.type) {
      case "circle":
        newDrawing = <Circle 
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
                        onMouseOver={this.onMouseOver.bind(this)}
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

          //debugger //DRAWN POLYGON FUNCTIONS NOT WORKING
        const key = this.state.polygons.length 
        const polygon = props 
        const polygonPaths = [] //props.overlay.getPaths().getArray()[0].b[0].lng()
        for (let i=0;i<props.overlay.getPaths().getArray()[0].length;i++) {
          //debugger 
          const newPath = {lat: props.overlay.getPaths().getArray()[0].b[i].lat(), lng: props.overlay.getPaths().getArray()[0].b[i].lng()}
          polygonPaths.push(newPath)
        }
        //debugger 
        console.log(polygonPaths)
        debugger 
        const type="polygons"
        const newRef = this.bindRef.bind(this) 
        //console.log(newRef)
        const newPolygon = {polygon: <Polygon
          key={key}
          id={key}
          ref={newRef}
          type={type}
          //ref={key}
          path={polygonPaths} //see below
          paths={polygonPaths} //not sure what difference use is between the two
          strokeColor="#0000FF"
          strokeOpacity={0.8}
          strokeWeight={2}
          fillColor="#0000FF"
          fillOpacity={0.35} 
          onClick={this.onPolygonClick} //.bind(this)}
          onMouseUp={this.onPolygonChange.bind(this, key) } // this.onTestPolygonChange
          onDrag={this.onPolygonDrag}
          onMouseOver={this.onMouseOver.bind(this, key, type)}
          options={{
            editable: true, // this.state.editPolygon ? true : false, //this doesn't work and i don't know why 
            draggable: true 
          }}
        />, trackSequence: {baseTrack: 'shayna_song', tracks: []}, trackEffects: {duration: 3, visits: 2, sequence: 1, speed: 1}} /// see below
        
        const newPolygonList = Object.assign([], this.state.polygons)
        newPolygonList.push(newDrawing)

        //debugger 
        return (
          this.setState({
            polygons: newPolygonList
          })
        ) 
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
  }

  onMouseOver(key, type, props) {
    debugger 

    let shapeSelected
    switch(type) {
      case("polygons"):
          shapeSelected = this.state.polygons
          const shape = shapeSelected[key]
          console.log("polygon mouse over")
          this.setState({
            shapeMenu: { menu: <ShapeMenu shape={shape} keyID={key} tracks={this.state.tracks} chosenTrack={this.chooseTrack}/>, shape: shape, key: key}
          })
      case("circles"):
          shapeSelected = this.state.circles
      case ("polylines"):
          shapeSelected = this.state.polylines 
      case ("rectangles"):
          shapeSelected = this.state.rectangles
      case ("markers"):
          shapeSelected = this.state.markers 
      default:
          break 
    }

    this.setState({
      polyMenu: {key: key, type: type}
    })
  }

  showShapeMenuDeets = () => {

    const {key, type} = this.state.polyMenu
    let shapeSelected

    switch(type) {
      case("polygons"):
          shapeSelected = this.state.polygons
          const shape = shapeSelected[key]
          if (this.state.shapeMenu.shape !== shape && this.state.shapeMenu.key !== key) {
            this.setState({
              shapeMenu: { menu: <ShapeMenu shape={shape} keyID={key} tracks={this.state.tracks} chosenTrack={this.chooseTrack}/>, shape: shape, key: key}
            })
          }
      case("circles"):
          shapeSelected = this.state.circles
      case ("polylines"):
          shapeSelected = this.state.polylines 
      case ("rectangles"):
          shapeSelected = this.state.rectangles
      case ("markers"):
          shapeSelected = this.state.markers 
      default:
          break 
      }
  }

  handleMarkerClick = (e) => {
    //this.setState({ isMarkerShown: false })
    debugger 
  }

  /*
  setMarkersNow = () => {
    debugger 
    const markers = this.state.markers.map((marker, key)=> {
      //console.log(marker)
      return (
        <Marker 
          name={"marker" + key}
          position={{lat: marker.position[0], lng: marker.position[1]}}
          //onClick={this.onMarkerClick.bind(this)}
          key={key}
          
        />
      )
    })
    //debugger 
    return markers 
  }
  */

  onMarkerClick = (props, marker, e) => {

    debugger 
    const selectedMarkerLatLng = [props.position.lat, props.position.lng]

    const selectedMarkerProps = this.state.markers.filter(marker => {
      if (marker.position[0] === selectedMarkerLatLng[0] && marker.position[1] === selectedMarkerLatLng[1]) {
        return marker //debugger
      }
    })

    console.log(selectedMarkerProps)

    const selectedMP = selectedMarkerProps[0]

    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
      selectedMarker: selectedMP,
      //showingMakerWindow: true
    });
  }

  bindRef = (ref) => {
    //debugger 

    this.ref = ref
    const addedPolygonMarkers = Object.assign([], this.state.markers)

    //maybe collect all ref individually and add them to this.refs?    
    //console.log(ref)
    if (ref != null) {
      //debugger 
      for (let i=0; i < addedPolygonMarkers.length; i++) {
        if (i === ref.props.id) {
          //debugger //haven't checked the below yet with the new this.state.markers
          addedPolygonMarkers[i].polygon.polygonObject = ref //this line might be unnecessary...?

          if (this.state.markers[i] !== addedPolygonMarkers[i]) { //this 
            this.setState({
              markers: addedPolygonMarkers
            })
          }
        }
      }
    }
    return ref 

  }

  onPolygonClick = (props) => {
    //i think e is where i clicked, so probably can get rid of it
    
    const editingId = props.id; 
    const editedPolygon = this.state.markers[editingId] //need to update this to reflect new this.state.markers
    const polygon = this 
    //console.log(editingId)
    //console.log(props)

    debugger 

    function getPaths(polygon){
      var coordinates = (polygon.getPath().getArray());
      //console.log(coordinates);
    }

    getPaths(polygon)

    const newCoords = []
    const polygonDetails = [this, editingId, newCoords]

    //this seems to work but i don't know why
    // - this.state.markers[at the position selected].polygonObject at whatever position is reflecting the correct
    //value for some reason 
    //eventually i'll need to do more than set state and post info to server... at which point i'll revisit this
    //console.log(editedPolygon)
    for (let i=0; i<editedPolygon.polygonCoords.length; i++) {
      //debugger 
      //console.log(editedPolygon.polygonObject.polygon.getPath()["b"][i].lat())
      //console.log(editedPolygon.polygonObject.polygon.getPath()["b"][i].lng())
      debugger
      editedPolygon.polygonObject.props.paths[i].lat = editedPolygon.polygonObject.polygon.getPath()["b"][i].lat()
      editedPolygon.polygonObject.props.paths[i].lng = editedPolygon.polygonObject.polygon.getPath()["b"][i].lng()
    }

    debugger 

    const updatedPolygon = editedPolygon.polygonObject.polygon.getPath()["b"].forEach(latLng => {
      
      debugger 
      
      return latLng 
      
    }, polygonDetails)

    const markersWithNewPolygonCoords = Object.assign([], this.state.markers)
    //markersWithNewPolygonCoords[editingId].polygonObject = updatedPolygon 

    //debugger 


    this.setState({
      editPolygon: !this.state.editPolygon
      
    })
    //console.log(this.state.editPolygon)
  }

  onPolygonDrag = () => {
      debugger 
      //eventually this will give option of saving state, but it should take marker with it, no? or maybe... not?
  }

  onPolygonChange(key, props) {

      //const newPolygonDeets = Object.assign({}, this.state.markers[key])
      //debugger 
      const updatedMarkers = Object.assign([], this.state.markers)
      updatedMarkers[key].polygonCoords[props.vertex].lat = props.latLng.lat()
      updatedMarkers[key].polygonCoords[props.vertex].lng = props.latLng.lng()

      this.setState({
        markers: updatedMarkers
      })
  }

  setPolygonsNow = () => {
    //debugger 
    const polygonsDrawn = this.state.markers.map((polygon, key) => {
      //debugger 
      const type="polygons"
      const newRef = this.bindRef.bind(this) 
      //console.log(newRef)
      const newPolygon = {polygon: <Polygon
        key={key}
        id={key}
        ref={newRef}
        type={type}
        //ref={key}
        path={polygon.polygon.polygonCoords}
        paths={polygon.polygon.polygonCoords}
        strokeColor="#0000FF"
        strokeOpacity={0.8}
        strokeWeight={2}
        fillColor="#0000FF"
        fillOpacity={0.35} 
        onClick={this.onPolygonClick} //.bind(this)}
        onMouseUp={this.onPolygonChange.bind(this, key) } // this.onTestPolygonChange
        onDrag={this.onPolygonDrag}
        onMouseOver={this.onMouseOver.bind(this, key, type)}
        options={{
          editable: true, // this.state.editPolygon ? true : false, //this doesn't work and i don't know why 
          draggable: true 
        }}
      />, trackSequence: {baseTrack: 'shayna_song', tracks: []}, trackEffects: {duration: 3, visits: 2, sequence: 1, speed: 1}} /// see below
      //baseTrack hard-coded at the moment
      //oh wait, maybe sequence should be used... polygons add track and add a sequencing event?
      //- how would sequence work? it would be associated with a set of 
      //meh come back to this later
      
      // how should effectsList operate? 
      //check for the following
      //number of times in polygon(?) 
      //duration in polygon
      //sequence(?)
      //then have in Player(#?) what will happen 

      return (newPolygon)
    })

    //randomly assigns track to polygon, eventually this will be thought out
    polygonsDrawn.map(polygon => {
      let preloadedTracks = {baseTrack: 'shayna_song', sequence: ['drums_2', 
      'drums_3', 
      'drums_main', 
      'heavy_synth_1',
      'heavy_synth_2',
      'strings_1',
      'synth_1',
      'synth_2',
      'weird_swell_1']}
      
      //eventually baseTrack won't be preloaded 
      const tracksCheck = []
      const n = Math.floor(Math.random() * 7 + 1)
      for (let j = 0; j <= n; j++) {
        const i = Math.floor(Math.random() * 9)
        if (!tracksCheck.includes(preloadedTracks.sequence[i])) {
          tracksCheck.push(preloadedTracks.sequence[i])
          polygon.trackSequence.tracks.push({track: preloadedTracks.sequence[i], effects: {volume: 0.5, playbackRate: 1, loop: true}})
        } 
      }
    })
    //debugger 
    return polygonsDrawn
  }

  savesChanges = () => {
    //should the button only show up if there's a change? how to check

    debugger 
  }

  chooseTrack = (track, shape) => {

    const id = Number(shape.key)
    switch(shape.polygon.props.type) {
      case("polygons"):
        //const updatedPolygon = Object.assign ({}, shape)
        //updatedPolygons.props.track = track
        const polygonList = Object.assign ([], this.state.polygons)
        polygonList.forEach((polygon, i) => {
          //debugger 
          if (polygon.polygon.props.id === shape.polygon.props.id) {
            polygonList[i].track = track
          }
        })

        this.setState({
          polygons: polygonList 
        })
        //console.log(polygonList[id])
        //console.log(shape)
        break
    }
    //debugger 
  }

  setPolygonState(polygonList){
    //debugger 
    if (this.state.polygons.length === 0) {
      this.setState({
        polygons: polygonList
      })
    } else {
      for (let i=0; i<polygonList.length; i++) {
        if (this.state.polygons[i].polygon.props.path !== polygonList[i].polygon.props.path) {
          //debugger 
          this.setState({
            polygons: polygonList
          })
        }
      }
    }
  }

  updateMap = (marker) => {
    //console.log(marker)
    this.setState({
      testMarker: marker
    })
  }

  handleMapClick = () => {
    debugger 
  }

  getInfo(){
    //debugger 
    const markerPositions = this.state.markers.map((marker, key) => {
      //debugger 
      return [key, marker.marker.props.position]
    })

    const distances = [] 
    for (let j=0; j<markerPositions.length-1; j++) { //right now it'll go in order cause that's easier but maybe shortsighted 
    //there's a getcurrentPosition for when it's the phone app
      //debugger 
      const distance = geolib.getDistance(
        {latitude: markerPositions[j][1].latitude, longitude: markerPositions[j][1].longitude}, //switched from lat/lng 
        {latitude: markerPositions[j+1][1].latitude, longitude: markerPositions[j+1][1].longitude}
      );
      distances.push(distance)

      //the below is for when it's not in order
      /*
      for (let i=0; i<markerPositions.length; i++) {
        geolib.getDistance(
          {latitude: markerPositions[j][1].lat, longitude: markerPositions[j][1].lng},
          {latitude: markerPositions[j][1].lat, longitude: markerPositions[j][1].lng}
        );
      }
      */
      
    }

    return distances //debugger 
  }

  showMenu() {
    //NEVER FINISHED THIS, NOT SURE WHAT INFO I WANT TO SEE IN MENU SO YEAH
    //debugger //next up, 10.14: be able to move polygons onPolygonDrag and then setState for new place
    //how to deal with long distances between polygons... 
    //maybe get rid of positions of paths on polygon...? it's kind of annoying
    //then we'll need backend to save it 
    const showMenuSet = this.state.menuSet 
    if (showMenuSet === true ) {
      const distanceBtwMarkers = this.getInfo()

      const distanceMenu = distanceBtwMarkers.map((distance, key) => {
        const timeToTravel = (distance / 1.4).toFixed(2)
        return (
          <div>
            <p>marker {key} to marker{key + 1}: {distance} meters</p> <p>and time alloted: {timeToTravel} secs</p>
          </div>
        )
      })
      return distanceMenu
    }
  }

  onRadioChange(user){
    if (user !== this.state.gameSet) {
      this.setState({gameSet: user})
    }
  }

  render() {
    let markersList 
    let polygonList
    let polygonToDraw = []

    if (this.state.markers.length > 0) {
      //markersList = this.setMarkersNow();
      //debugger 
      polygonList = this.setPolygonsNow(); 
      polygonList.forEach(polygon => {
        polygonToDraw.push(polygon.polygon)
      })
      //debugger  ///this is causing the warning 
      this.setPolygonState(polygonList);
    }

    if (this.props.geoLoc !== '') {
        this.state.markers.map(marker => {
            //console.log(marker.polygonCoords)
        })
    } else {
      //debugger 
      console.log("geoloc not updating")
    }
    
    const showingDeets = this.showShapeMenuDeets() //apparently this isn't being used?
    const showMenu = this.showMenu();
    //if (this.state.markers.length >0) debugger 
    return (
        <div>
            <br />
            <div className="container">
              <div className="row">
                <div className="col">

                  <LocationChecker 
                    marker={this.state.testMarker} 
                    nowPlaying={this.state.nowPlaying} 
                    updateMap={this.updateMap}
                    effects={this.state.effects}
                    stopPlayingTest={this.state.stopPlayingTest}
                    startPlayer1={this.state.startPlayer1}
                    startPlayer2={this.state.startPlayer2}
                    markers={this.state.markers} 
                    //keeping the below because LocationChecker sets shapesList in comonentwillreceiveprops 
                    polygons={this.state.polygons} 
                    rectangles={this.state.rectangles}
                    circles={this.state.circles}
                    polylines={this.state.polylines}
                    upSpeed={this.state.upSpeed}
                    getInfo={this.getInfo}
                  />
                </div>
                <div className="col-sm-">
                  <label>user: </label>
                  {this.state.users.map((user, key) => {
                    return (
                      <label>
                      <input type="radio"
                          key={key}
                          name="user"
                          value={user}
                          checked={user === this.state.gameSet}
                          onChange={() => this.onRadioChange(user)}
                        />
                        {user}
                      </label>
                    )
                        
                  })}
                  <br />
                  
                  <button
                    onClick={this.savesChanges.bind(this)}
                  >
                    save changes
                  </button>
                </div>
                <div className="col">
                  <h3>menu</h3>
                  {showMenu}
                  {this.state.polyMenu.type !== '' &&
                    <div>
                      { <ShapeMenu shape={this.state.shapeMenu.shape} keyID={this.state.shapeMenu.key} tracks={this.state.tracks} chosenTrack={this.chooseTrack}/>}
                    </div>
                  }
                </div>
              </div>
            </div>
            {this.props.geoLoc !== '' && 
                <MyMapComponent
                    isMarkerShown={this.state.isMarkerShown}
                    onMarkerClick={this.handleMarkerClick}
                    onClick={this.handleMapClick} // doesn't work 
                    geoLoc={this.props.geoLoc}
                    markersList={this.state.markers}
                    polygonToDraw={polygonToDraw}
                    onDrawingComplete={this.handleDrawingComplete}
                    circleList={this.state.circles}
                    testMarker={this.state.testMarker}
                    thisTestMarker={this.state.thisTestMarker}
                    polylines={this.state.polylines}
                />
            }
        </div>
      
    )
  }
}

/*
    if (this.state.markers.length > 0) {
      return (
        <div>
          {this.state.markers.map(marker => {
            <div>
              key: {marker.props.name}


            </div>
            debugger 
          })}
        </div>
      )
    }
    if (this.state.polygons.length > 0) {
      return (
        <div>
          {this.state.polygons.map(marker => {
            debugger 
          })}
        </div>
      )
    }
    */

//export default MyFancy
/*
const mapStateToProps = (state) => {
  //debugger 
  //state.farmGoods.data[0].relationships.farmer.data.id
  return ({
      farmGoods: state.farmGoods.all, //maybe add another {} in fg reducer for specific farmer?
      days: state.days,
      //user: state.user
  })
}


export default connect()
*/

///// SCRAPS //////

  /*
  returnFunction = () => {
    console.log("running")

    const newMarkerLocation = Object.assign({}, this.state.testMarker)

    //MOVES MARKER AS FOLLOWS, EVENTUALLY THIS SHOULD BE MORE MEANINGFUL 
    newMarkerLocation.position.lat = this.state.testMarker.position.lat + .00004
    newMarkerLocation.position.lng = this.state.testMarker.position.lng + .00005

    newMarkerLocation.show = true; 

    //debugger 
    //this.checkLocation() //(); 
    //<LocationChecker marker={newMarkerLocation} polygons={this.state.polygons} nowPlaying={this.state.nowPlaying}/>
    //CheckLocation1()

    this.setState({
      testMarker: newMarkerLocation
    })
  }
  */
/*

    geolib.isPointInside(
      {latitude: latNow, longitude: lngNow},
      [
          {latitude: 51.50, longitude: 7.40},
          {latitude: 51.555, longitude: 7.40},
          {latitude: 51.555, longitude: 7.625},
          {latitude: 51.5125, longitude: 7.625}
      ]
    ); // -> true 
    */


  /*
  showDeets = () => {
    
    const type = this.state.polyMenu.type 
    const key = this.state.polyMenu.key
    let shapeSelected
    switch(this.state.polyMenu.type) {
      case("polygons"):
          shapeSelected = this.state.polygons
          const shape = shapeSelected[key]
          //console.log(shape)
          return <ShapeMenu shape={shape} keyID={key} tracks={this.state.tracks} chosenTrack={this.chooseTrack}/>
      case("circles"):
          shapeSelected = this.state.circles
      case ("polylines"):
          shapeSelected = this.state.polylines 
      case ("rectangles"):
          shapeSelected = this.state.rectangles
      case ("markers"):
          shapeSelected = this.state.markers 
      default:
          break 
      }

    //debugger
    
  }
  */


  /*
  latLng(position) {
    //debugger 
    //this.lat(position.lat)
    return position 
  }

  lat() {
    debugger 
    //return testMarker //.position.lat 
  }

  lng() {
    //debugger
    //return testMarker
  }
  */

  /*
      let markerListHere = []
      for (let i = 1; i<5; i++) {
        let markerObject = {position: [], polygonCoords: [], polygonObject: []}; 
        let newMarker = []
        let newPosition = i * .0007
        newMarker[0] = nextProps.geoLoc.lat + newPosition;
        newMarker[1] = nextProps.geoLoc.lng + newPosition;
        markerObject.position = newMarker 
        let polygonCoordsSketch = [
          {lat: newMarker[0] + .0003, lng: newMarker[1] + .0003},
          {lat: newMarker[0] - .0003, lng: newMarker[1] - .0003},
          {lat: newMarker[0] - .0002, lng: newMarker[1] + .0002},
        ];

        markerObject.polygonCoords = polygonCoordsSketch
        markerListHere.push(markerObject)
      }

      const geoLoc = nextProps.geoLoc
      //debugger 
      const testPolyLine = [ //HAVENT DONE ANYTHING WITH THIS YET
        {lat: geoLoc.lat, lng: geoLoc.lng },
        {lat: geoLoc.lat + .001, lng: geoLoc.lng + .002},
        {lat: geoLoc.lat + .001, lng: geoLoc.lng + .002},
      ]
      //console.log(testPolyLine)
      //console.log(createTestMarker)


      this.setState ({
        markers: markerListHere,
        testPolyLine: testPolyLine,
        testMarker: createTestMarker
      }) */