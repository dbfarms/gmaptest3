import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=" + process.env.REACT_APP_API_URL + "&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `800px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
    <div>
        {console.log(props)}
        <GoogleMap
            defaultZoom={8}
            defaultCenter={{ lat: props.geoLoc.lat, lng: props.geoLoc.lng }}
        >
            {props.isMarkerShown && <Marker position={{ lat: props.geoLoc.lat, lng: props.geoLoc.lng }} onClick={props.onMarkerClick} />}
        </GoogleMap>
    </div>
  
)//)

export default class MyFancyComponent extends React.PureComponent {

  state = {
    isMarkerShown: false,
    geoLoc: this.props.geoLoc
  }

  componentDidMount() {
    this.delayedShowMarker()
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

  render() {
    console.log(this.props.geoLoc)
    return (
        <div>
            {this.props.geoLoc !== '' && 
                <MyMapComponent
                    isMarkerShown={this.state.isMarkerShown}
                    onMarkerClick={this.handleMarkerClick}
                    geoLoc={this.props.geoLoc}
                />
            }
        </div>
      
    )
  }
}