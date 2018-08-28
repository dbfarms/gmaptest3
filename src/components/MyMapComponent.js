import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon, Circle, Rectangle, Polyline } from "react-google-maps"
import DrawingManager from "react-google-maps/lib/components/drawing/DrawingManager";

import Pulse from './Pulse';
import ShapeMenu from './ShapeMenu';

import PolylinenFunctions from './PolylineFunctions';

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
            defaultZoom={16}
            defaultCenter={{ lat: props.geoLoc.lat, lng: props.geoLoc.lng }}
        >
            {props.isMarkerShown && 
                <Marker position={{ lat: props.geoLoc.lat, lng: props.geoLoc.lng }} onClick={props.onMarkerClick} />
            }
            
            {props.markersList.map((marker, key) => {
                return marker
            })}

            {props.polygonToDraw}

            {props.testMarker.show === true &&
              <div>
              {console.log(props.testMarker)}
              <Marker position={{lat: props.testMarker.position.lat, lng: props.testMarker.position.lng}} />
              </div>
            }

            <DrawingManager
              onCircleComplete={props.onDrawingComplete} 
              onMarkerComplete={props.onDrawingComplete}
              onOverlayComplete={props.onDrawingComplete}
              onPolygonComplete={props.onDrawingComplete}
              onPolylineComplete={props.onDrawingComplete}
              onRectangleComplete={props.onDrawingComplete}
            />

        </GoogleMap>
    </div>
  
)//)

export default class MyFancyComponent extends React.PureComponent {
  constructor(props) {
    super(props)

    //debugger

    this.handleDrawingComplete = this.handleDrawingComplete.bind(this)
    this.chooseTrack = this.chooseTrack.bind(this)
    this.state = {
      isMarkerShown: false,
      polyMenu: {key: '', type: ''},
      geoLoc: this.props.geoLoc,
      testMarker: {position: "", polygon: "", show: false},
      markers: [],
      polygons: [],
      rectangles: [],
      polylines: [],
      circles: [],
      tracks: this.props.tracks,
      timer: 0,
      running: false,
    }
  }

  componentDidMount() {
    this.delayedShowMarker()
  }

  componentDidUpdate(prevState, props) {
    //debugger
    //console.log(prevState)
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps)
    this.setState({
      geoLoc: nextProps.geoLoc
    })

    //eventually this will load from the server from saved maps, or will not exist for new maps **********************888
    //right now it just sets to state predetermined positions based on location
    //also it creates the polygon here though it'll have to be done elsewhere soon
    if (nextProps.geoLoc) {
      //debugger 
      const createTestMarker = {position: {lat: nextProps.geoLoc.lat - .0000005, lng: nextProps.geoLoc.lng - .0000005}, 
          polygon: "", show: false}
      
      let markerListHere = []
      for (let i = 1; i<5; i++) {
        let markerObject = {position: [], polygonCoords: [], polygonObject: []}; 
        let newMarker = []
        let newPosition = i * .001
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
      console.log(createTestMarker)
      this.setState ({
        markers: markerListHere,
        testPolyLine: testPolyLine,
        testMarker: createTestMarker
      })
    }
  }

  delayedShowMarker = () => {
    //this is a dumb function i need to do something else with
    setTimeout(() => {
      this.setState({ isMarkerShown: true })
    }, 3000)
  }

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

    this.setState({
      polyMenu: {key: key, type: type}
    })
  }

  handleMarkerClick = () => {
    this.setState({ isMarkerShown: false })
    this.delayedShowMarker()
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
        onMouseUp={this.onPolygonChange.bind(this, key)}//this.state.parentPolygon(polygon, key)} //onPolygonChange.bind(this)} //.bind(this)}
        onDrag={this.onPolygonDrag}
        onMouseOver={this.onMouseOver.bind(this, key, type)}
        options={{
          editable: true, // this.state.editPolygon ? true : false, //this doesn't work and i don't know why 
          draggable: true 
        }}
      />, track: "empty"}

      //debugger 

      return (newPolygon)
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

  returnFunction = () => {
    console.log("running")

    const newMarkerLocation = Object.assign({}, this.state.testMarker)

    newMarkerLocation.position.lat = this.state.testMarker.position.lat + .00005
    newMarkerLocation.position.lng = this.state.testMarker.position.lng + .00005

    newMarkerLocation.show = true; 

    this.setState({
      testMarker: newMarkerLocation
    })
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
      
      this.setPolygonState(polygonList);
    }

    if (this.props.geoLoc !== '') {
        this.state.markers.map(marker => {
            //console.log(marker.polygonCoords)
        })
    } else {
      console.log("geoloc not updating")
    }

    let showingDeets 
    if (this.state.polyMenu.type !== '') {
      showingDeets = this.showDeets()
    }
    return (
        <div>
            <div>
              {<Pulse 
                pulseTime={1} // In Seconds
                pulseFunction={this.returnFunction}
              />}
            </div>
            <div>
              <button
                onClick={this.savesChanges.bind(this)}
              >
                save changes
              </button>
            </div>
            <div className="menu">
            <h3>menu</h3>
            {this.state.polyMenu.type !== '' &&
              <div>
                {showingDeets}
              </div>
            }
            </div>
            {this.props.geoLoc !== '' && 
                <MyMapComponent
                    isMarkerShown={this.state.isMarkerShown}
                    onMarkerClick={this.handleMarkerClick}
                    geoLoc={this.props.geoLoc}
                    markersList={markersList}
                    polygonToDraw={polygonToDraw}
                    onDrawingComplete={this.handleDrawingComplete}
                    circleList={this.state.circles}
                    testMarker={this.state.testMarker}
                />
            }
        </div>
      
    )
  }
}