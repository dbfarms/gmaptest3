//app notes DO THIS NEXT STOP WHAT YOU'RE DOING GET SHIT IN ORDER  
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

      player 
        -haven't really done anything here yet

      */ 

import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon, Circle, Rectangle, Polyline } from "react-google-maps"
import DrawingManager from "react-google-maps/lib/components/drawing/DrawingManager";
//import { connect } from 'react-redux'
//import { bindActionCreators } from 'redux';

import Pulse from './Pulse';
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
            defaultZoom={17}
            defaultCenter={{ lat: props.geoLoc.lat, lng: props.geoLoc.lng }}
        >
            {props.isMarkerShown && 
                <Marker position={{ lat: props.geoLoc.lat, lng: props.geoLoc.lng }} onClick={props.onMarkerClick} />
            }
            
            {props.markersList.map((marker, key) => {
                return marker
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
                {console.log()}
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
    }
  }

  componentWillMount() {
    //debugger 
    //this.delayedShowMarker()
  }

  componentDidUpdate(prevState, props) {
    //debugger
    //console.log(prevState)
    //console.log(props)
  }

  componentWillReceiveProps(nextProps){
    //console.log(this)
    //console.log(nextProps)
    this.setState({
      geoLoc: nextProps.geoLoc
    })

    //eventually this will load from the server from saved maps, or will not exist for new maps **********************888
    //right now it just sets to state predetermined positions based on location
    //also it creates the polygon here though it'll have to be done elsewhere soon
    if (nextProps.geoLoc) {
      //debugger 
      
      //debugger
      
      console.log("geo loc works")


      //debugger 
      let createTestMarker;
      let actualMarker; 
      //debugger
      
      if (this.state.testMarker.position !== "" ) {
        console.log("this one")
        //debugger 
        createTestMarker = this.state.testMarker
       // console.log(createTestMarker)
      } else { 
        //(this.state.testMarker.position === "") 
        //console.log("should only happen once")

        createTestMarker = {position: {lat: nextProps.geoLoc.lat - .0000005, lng: nextProps.geoLoc.lng - .0000005}, 
        marker: "", show: false}

        actualMarker = <Marker 
        position= {{lat: nextProps.geoLoc.lat - .0000008, lng: nextProps.geoLoc.lng - .0000008}} latLng={this.latLng} lat={this.lat} lng={this.lng}/>
      
        createTestMarker.marker = actualMarker

        //debugger 
        //const testLatLng = props.google.maps.geometry.poly.containsLocation( actualMarker.latLng, this.state.markers[0].polygonObject.props.getPath())
        //const thisWork = actualMarker.props.lat(actualMarker.props.position.lat)
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
        const testPolyLine = [ 
          {lat: geoLoc.lat, lng: geoLoc.lng },
          {lat: geoLoc.lat + .001, lng: geoLoc.lng + .002},
          {lat: geoLoc.lat + .001, lng: geoLoc.lng + .002},
        ]
        //console.log(testPolyLine)
        //console.log(createTestMarker)


        this.setState ({
          markers: markerListHere,
          polylines: testPolyLine,
          testMarker: createTestMarker
        })

      }
    }
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
        newDrawing = {polygon: <Polygon 
            props={props}
            track="test"
        />, track: ""}

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

    //debugger 
  }

  onMouseOver(key, type, props) {
    //debugger 

    let shapeSelected
    switch(type) {
      case("polygons"):
          shapeSelected = this.state.polygons
          const shape = shapeSelected[key]
          console.log("polygon mouse over")
          //console.log(shape)
          //debugger 
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

    //load <ShapeMenu here 
    
  }

  showShapeMenuDeets = () => {

    const {key, type} = this.state.polyMenu

    //console.log(key)
    //console.log(type)
    let shapeSelected

    switch(type) {
      case("polygons"):
          shapeSelected = this.state.polygons
          const shape = shapeSelected[key]
          //console.log(shape) //THESE BOTH CHECK OUT OK
          //console.log(key)

          if (this.state.shapeMenu.shape !== shape && this.state.shapeMenu.key !== key) {
            this.setState({
              shapeMenu: { menu: <ShapeMenu shape={shape} keyID={key} tracks={this.state.tracks} chosenTrack={this.chooseTrack}/>, shape: shape, key: key}
            })
          }
          
          //return (<ShapeMenu shape={shape} keyID={key} tracks={this.state.tracks} chosenTrack={this.chooseTrack}/>)
          
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

  setMarkersNow = () => {
    const markers = this.state.markers.map((marker, key)=> {
      //console.log(marker)
      return (
        <Marker 
          position={{lat: marker.position[0], lng: marker.position[1]}}
          //onClick={this.onMarkerClick.bind(this)}
          key={key}
          
        />
      )
    })
    return markers 
  }

  onMarkerClick = (props, marker, e) => {

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
          addedPolygonMarkers[i].polygonObject = ref 

          if (this.state.markers[i] !== addedPolygonMarkers[i]) {
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
    const editedPolygon = this.state.markers[editingId]
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
      
      const updatedMarkers = Object.assign([], this.state.markers)
      updatedMarkers[key].polygonCoords[props.vertex].lat = props.latLng.lat()
      updatedMarkers[key].polygonCoords[props.vertex].lng = props.latLng.lng()

      //debugger 

      //debugger 
      this.setState({
        markers: updatedMarkers
      })
  }

  setPolygonsNow = () => {
    const polygonsDrawn = this.state.markers.map((polygon, key) => {

      const type="polygons"
      const newRef = this.bindRef.bind(this) 
      //console.log(newRef)
      const newPolygon = {polygon: <Polygon
        key={key}
        id={key}
        ref={newRef}
        type={type}
        //ref={key}
        path={polygon.polygonCoords}
        paths={polygon.polygonCoords}
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
      />, track: "empty", effectsList: {duration: 3, visits: 2, sequence: 1}}
      // how should effectsList operate? 
      //check for the following
      //number of times in polygon(?) 
      //duration in polygon
      //sequence(?)
      //then have in Player(#?) what will happen 
      

      //debugger 

      return (newPolygon)
    })

    //randomly assigns track to polygon, eventually this will be thought out
    polygonsDrawn.map(polygon => {
      let preloadedTracks = ['track1', 'track2', 'track3', 'track4'] 
      
      const i = Math.floor(Math.random() * 4)

      polygon.track = preloadedTracks[i]
    })

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

  render() {
    //console.log(this.props.geoLoc)

    let markersList 
    let polygonList
    let polygonToDraw = []

    //debugger 
    if (this.state.markers.length > 0) {
      markersList = this.setMarkersNow();
      polygonList = this.setPolygonsNow(); 
      //debugger 
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
      console.log("geoloc not updating")
    }

    
    const showingDeets = this.showShapeMenuDeets() //apparently this isn't being used?

    return (
        <div>
            <br />
            <div className="container">
              <div className="row">
                <div className="col">

                  <LocationChecker 
                    marker={this.state.testMarker} 
                    polygons={this.state.polygons} 
                    nowPlaying={this.state.nowPlaying} 
                    updateMap={this.updateMap}
                    effects={this.state.effects}
                    stopPlayingTest={this.state.stopPlayingTest}
                    startPlayer1={this.state.startPlayer1}
                  />
                </div>
                <div className="col-sm-">
                  <button
                    onClick={this.savesChanges.bind(this)}
                  >
                    save changes
                  </button>
                </div>
                <div className="col">
                  <h3>menu</h3>
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
                    markersList={markersList}
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