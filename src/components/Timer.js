import React from 'react';

import TimerComponent from './TimerComponent';
import { millisecondsToHuman } from '../utils/TimerUtils';

export default class Timer extends React.Component {
  state = {
    elapsed: 0,
    durationStart: 0,
    isRunning: this.props.isRunning,
    getDuration: this.props.getDuration,
    inShape: this.props.inShape,
    latestShape: undefined, 
  };

  componentWillReceiveProps(nextProps) {
      //console.log(nextProps)
      if (nextProps.isRunning !== this.state.isRunning || nextProps.inShape !== this.state.inShape) {
        this.setState({
            isRunning: nextProps.isRunning,
            inShape: nextProps.inShape, //.polygon,
        })
      }
  }

  elapsedTime = (elapsed) => {
      //console.log("hits elapsedTime") this works
      this.setState({
          elapsed: elapsed
      })
  }

  render() {

    const elapsed = millisecondsToHuman(this.state.elapsed)

    const duration = this.elapsedTime
    const latestShape = this.state.latestShape
    const inShape = this.state.inShape

    //if in a shape return true for the first time, mark down elapsed time for the start
    //if no longer in a shape or in a different shape, reset
    //hoist info to LocationChecker 

    //im keeping this here because this is a function of timer itself and this way i dont have to keep setting state 
    //re: timer in multiple locations
    if (inShape !== undefined ) {
      /* 
      console.log("inShape")
      console.log(inShape)
      console.log("latestShape")
      console.log(latestShape)
      */
    }
    
    
    if (inShape !== undefined) {
        if (latestShape !== inShape) {
          //// this will check if the latestShape you're in is no longer the same shape you had been in
          //debugger
          console.log("new shape, resetting (allegedly) durationStart")
         
          this.setState({
            durationStart: this.state.elapsed,
            latestShape: inShape 
          })

          
        } else {
          //still in shape... checks and hoists
          console.log("same shape")
          const duration = this.state.elapsed - this.state.durationStart 
          //debugger 
          //console.log(duration)
          if (duration > 1) {

            this.state.getDuration(latestShape, duration)
          }
          
        }
    } /*else {
        //

        this.setState({
          durationStart: 0,
          latestShape: null //??
        })
    } */
      

    return (
        <div>
            <div>
                <h3>timer</h3>
            </div>
            <label>elapsed: {elapsed}</label>
            {this.state.isRunning &&
                <div>
                    <TimerComponent elapsedTime={this.elapsedTime} isRunning={this.state.isRunning} elapsed={this.state.elapsed}/>
                </div>
            }
            <br />            
        </div>
        
    );
  }
}


  /*
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
  */

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
