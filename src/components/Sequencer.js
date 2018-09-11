/*

this will either be in Player or above Player and send down to Players(1-?)
-as things occur, duration/location cues/ etc
-the sequence list will be added to 

*/

export default class Sequencer extends Component {
    constructor(props){
        super(props)

        this.state = {
            sequence: []
        }
    }

    componentWillReceiveProps(nextProps){
        const newSequence = Object.assign([], this.state.sequence)

        if (nextProps.newThing) {
            newSequence.push(nextProps.newThing)
            this.setState({
                sequence: newSequence
            })
        }
        
    }

    render() {
        return (
            <div>
                {/*Players.... */}
            </div>
        )
    }
}