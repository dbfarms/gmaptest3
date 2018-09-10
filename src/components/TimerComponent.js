import React from 'react';

export default class TimerComponent extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            elapsed: this.props.elapsed === undefined? 0 : this.props.elapsed, //this.props.elapsed,
            isRunning: this.props.isRunning,
            elapsedTime: this.props.elapsedTime,
          };
    }

    timerPassThrough = () => {
        //() => {
        const TIME_INTERVAL = 1000;
        const elapsed = this.state.elapsed
        //console.log("here now in timer pass through")
    
        if (this.state.isRunning) {
            //debugger 
            //console.log(elapsed)
            //this.state.elapsed(elapsed + TIME_INTERVAL)

            this.state.elapsedTime(elapsed + TIME_INTERVAL)
            this.setState({
                elapsed: elapsed + TIME_INTERVAL
            })
        } else {
            this.setState({
                elapsed: elapsed 
            })
        }
        //}
    }

  componentDidMount() {
    //console.log("timer comp did mount")
    console.log(this.state)
    const TIME_INTERVAL = 1000;
    this.intervalId = setInterval(this.timerPassThrough.bind(this), TIME_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    
    return (
        <div>
            <h3>timer on</h3>
        </div>
        
    );
  }
}


  /*
  componentWillReceiveProps(nextProps) {
      console.log(nextProps)
      const timer = this.state.timer 
      if (nextProps.timer) {
          //debugger 
          this.setState({
              //...this.state.timer,
              isRunning: true
          })
      } else if (nextProps.timer === false ) {
        this.setState({
            ...timer,
            isRunning: false
        })
      }
  } */
  

  /*
  handleCreateFormSubmit = timer => {
    const { timers } = this.state;

    this.setState({
      timers: [newTimer(timer), ...timers],
    });
  };

  handleFormSubmit = attrs => {
    const { timers } = this.state;

    this.setState({
      timers: timers.map(timer => {
        if (timer.id === attrs.id) {
          const { title, project } = attrs;

          return {
            ...timer,
            title,
            project,
          };
        }

        return timer;
      }),
    });
  };

  handleRemovePress = timerId => {
    this.setState({
      timers: this.state.timers.filter(t => t.id !== timerId),
    });
  };

  toggleTimer = timerId => {
    this.setState(prevState => {
      const { timers } = prevState;

      return {
        timers: timers.map(timer => {
          const { id, isRunning } = timer;

          if (id === timerId) {
            return {
              ...timer,
              isRunning: !isRunning,
            };
          }

          return timer;
        }),
      };
    });
    
  };
  */
