import React, { Component } from 'react';
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default class ShapeMenu extends Component {
    constructor(props){
        super(props)

        this.state = {
            shape: this.props.shape,
            keyID: this.props.keyID,
            dropdownOpen: false,
            tracksList: this.props.tracks,
            chooseTrack: this.props.chosenTrack,
        }
    }

    componentDidUpdate(props) {
        //console.log(props)
    }

    componentWillReceiveProps(nextProps) {
        //console.log(nextProps)
        this.setState({
            key: nextProps.key,
            shape: nextProps.shape
        })
    }

    toggleDropdown = () => {
      this.setState({ dropdownOpen: !this.state.dropdownOpen });
    }

    render() {

        //debugger 
        const shape = this.state.shape 
        const dropdownOpen = this.state.dropdownOpen;

        let shapeSelected 
        let keyID = this.state.keyID 
        //debugger 
        //console.log(shape)
        //console.log(this.state.tracksList)

        return (
            <div className="container">
                <h2>Paths for polygon ID {shape.polygon.props.id}</h2>
                <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Vertex</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                    </tr>
                </thead>
                    {shape !== undefined && 
                    <tbody>
                        {shape.polygon.props.path.map((pcoord, index) => {
                        return (
                            <tr key={index}>
                            <td>{index + 1}</td>
                            <td key={index + "lat"}>{pcoord.lat}</td>
                            <td key={index + "lng"}>{pcoord.lng}</td>
                            </tr>
                        )
                        })
                        }
                    </tbody>
                    }
                </table>

                <div className="d-flex flex-wrap justify-content-center position-relative w-100 h-100 align-items-center align-content-center">
                    <ButtonDropdown isOpen={dropdownOpen} toggle={this.toggleDropdown}>
                        <Button id="caret" color="Primary">{shape.track || 'Custom'} track</Button>
                        <DropdownToggle caret size="lg" color="Danger" />
                        <DropdownMenu>
                        {/*trackOptions*/}
                        {this.state.tracksList.map((track, trackKey) => {
                            return <DropdownItem key={trackKey} onClick={e => this.state.chooseTrack(track, shape)}>{track}</DropdownItem>
                        })
                    }
                        </DropdownMenu>
                    </ButtonDropdown>
                    
                </div>
                
                <div>
                <h3>fill color</h3>
                <p>eventually dynamic</p>
                <label>color: {shape.polygon.props.fillColor}</label>
                <br />
                <label>opacity: {shape.polygon.props.fillOpacity}</label>
                </div>
            </div>
            )
    }
}