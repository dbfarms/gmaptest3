export const onTestPolygonChange = (key, props) => {

    debugger 
    const updatedMarkers = Object.assign([], this.state.markers) // breaks here for some reason!!!!!!!!!!!!!!!!
    updatedMarkers[key].polygonCoords[props.vertex].lat = props.latLng.lat()
    updatedMarkers[key].polygonCoords[props.vertex].lng = props.latLng.lng()

    //debugger 

    //debugger 
    this.setState({
      markers: updatedMarkers
    })
}