import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon } from "react-google-maps"

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

            {props.polygonList}

        </GoogleMap>
    </div>
  
)//)

export default class MyFancyComponent extends React.PureComponent {

  state = {
    isMarkerShown: false,
    geoLoc: this.props.geoLoc,
    markers: [],
  }

  componentDidMount() {
    this.delayedShowMarker()
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
      const testPolyLine = [
        {lat: geoLoc.lat, lng: geoLoc.lng },
        {lat: geoLoc.lat + .001, lng: geoLoc.lng + .002},
        {lat: geoLoc.lat + .001, lng: geoLoc.lng + .002},
      ]
      console.log(testPolyLine)

      this.setState ({
        markers: markerListHere,
        testPolyLine: testPolyLine
      })
    }
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true })
    }, 3000)
  }

  handleMarkerClick = () => {
    this.setState({ isMarkerShown: false })
    this.delayedShowMarker()
  }

  setMarkersNow = () => {
    const markers = this.state.markers.map((marker, key)=> {
        console.log(marker)
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

    
    console.log(ref)
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

    //debugger 
  }

  onPolygonClick = (props) => {
    //i think e is where i clicked, so probably can get rid of it
    
    const editingId = props.id; 
    const editedPolygon = this.state.markers[editingId]
    const polygon = this 
    console.log(editingId)
    console.log(props)

    debugger 

    function getPaths(polygon){
      var coordinates = (polygon.getPath().getArray());
      console.log(coordinates);
    }

    getPaths(polygon)

    const newCoords = []
    const polygonDetails = [this, editingId, newCoords]

    //this seems to work but i don't know why
    // - this.state.markers[at the position selected].polygonObject at whatever position is reflecting the correct
    //value for some reason 
    //eventually i'll need to do more than set state and post info to server... at which point i'll revisit this
    console.log(editedPolygon)
    for (let i=0; i<editedPolygon.polygonCoords.length; i++) {
      //debugger 
      console.log(editedPolygon.polygonObject.polygon.getPath()["b"][i].lat())
      console.log(editedPolygon.polygonObject.polygon.getPath()["b"][i].lng())
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
    console.log(this.state.editPolygon)
  }

  onPolygonDrag = () => {
      debugger 
      //eventually this will give option of saving state, but it should take marker with it, no? or maybe... not?
  }

  onPolygonChange = (polygon, props, event) => {
      debugger 
  }

  setPolygonsNow = () => {
    const polygonsDrawn = this.state.markers.map((polygon, key) => {

      const newRef = this.bindRef.bind(this) 

      const newPolygon = <Polygon
        key={key}
        id={key}
        ref={this.bindRef.bind(this)}
        //ref={key}
        paths={polygon.polygonCoords}
        strokeColor="#0000FF"
        strokeOpacity={0.8}
        strokeWeight={2}
        fillColor="#0000FF"
        fillOpacity={0.35} 
        onClick={this.onPolygonClick} //.bind(this)}
        onMouseUp={this.onPolygonChange} //.bind(this)}
        onDrag={this.onPolygonDrag}
        options={{
          editable: true, // this.state.editPolygon ? true : false, //this doesn't work and i don't know why 
          draggable: true 
        }}
      />

      return (
        newPolygon
      )
    })
    return polygonsDrawn
  }

  runsTest = () => {
    debugger 
  }

  render() {
    console.log(this.props.geoLoc)

    let markersList 
    let polygonList

    //debugger 
    if (this.state.markers.length > 0) {
      markersList = this.setMarkersNow();
      polygonList = this.setPolygonsNow();
    }

    if (this.props.geoLoc !== '') {
        this.state.markers.map(marker => {
            console.log(marker.polygonCoords)
        })
    }

    return (
        <div>
            <div>
                <button
                    onClick={this.runsTest}
                >
                test run
                </button>
            </div>
            {this.props.geoLoc !== '' && 
                <MyMapComponent
                    isMarkerShown={this.state.isMarkerShown}
                    onMarkerClick={this.handleMarkerClick}
                    geoLoc={this.props.geoLoc}
                    markersList={markersList}
                    polygonList={polygonList}

                />
            }
        </div>
      
    )
  }
}