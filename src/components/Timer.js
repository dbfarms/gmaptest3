import React from 'react';

//import { newTimer } from '../utils/TimerUtils';
//import EditableTimer from './components/EditableTimer';
//import ToggleableTimerForm from './components/ToggleableTimerForm';

export default class Timer extends React.Component {
  state = {
    
    elapsed: 0,
    isRunning: this.props.timer
  };

  componentDidMount() {
      console.log("timer comp did mount")
      console.log(this.state)
    const TIME_INTERVAL = 1000;

    this.intervalId = setInterval(() => {

      const { elapsed, isRunning } = this.state //this.state.timer;

      //debugger 
      if (isRunning) {
          //debugger 
          console.log(elapsed)
          this.setState({
              elapsed: elapsed + TIME_INTERVAL
          })
      } else {
          this.setState({
              elapsed: elapsed 
          })
      }
    }, TIME_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {

    return (
        <div>
            <div>
                <h3>timer</h3>
            </div>
            <label>elapsed: {this.state.elapsed}</label>
            <br />            
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
