import React from "react";
import PropTypes from "prop-types";
//import style from "./styles.css";

export default class Pulse extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false
    };

    this.preparePulse = this.preparePulse.bind(this);
    this.sendPulse = this.sendPulse.bind(this);
    this.stopPulse = this.stopPulse.bind(this);
  }

  componentWillMount() {
    this.setState({
      active: this.props.defaultActive === true || global.pulse != null ? true : false,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      active: nextProps.defaultActive || global.pulse != null ? true : false,
    });
  }

  preparePulse() {
    const date = new Date();

    // Send function when the button is clicked
    this.props.onClickFunction && this.props.onClickFunction(date.getTime());

    if (this.state.active) {
      this.setState({active: false});
      this.stopPulse();
      this.props.onChangeFunction && this.props.onChangeFunction({ state: "inactive", time: date.getTime() });
    } else {
      this.setState({active: true});
      this.props.onChangeFunction && this.props.onChangeFunction({ state: "active", time: date.getTime() });
    }
  }

  sendPulse() {
    global.pulse = setInterval(() => {
      const date = new Date();
      this.props.pulseFunction && this.props.pulseFunction({ state: "active", time: date.getTime() })
    }, (this.props.pulseTime * 1000));
  }

  stopPulse() {
    clearInterval(global.pulse);
    global.pulse = null;
  }

  render() {
    const { active } = this.state;
    const { defaultLabel, activeLabel, className, disabled } = this.props;

    active && global.pulse == null && this.sendPulse(); // When state is active, call function

    return <button className={className || "pulse-button"} onClick={this.preparePulse} disabled={disabled}>
      {active ? activeLabel : defaultLabel }
    </button>
  }
}

Pulse.defaultProps = {
  defaultLabel: "Start",
  activeLabel: "Running...",
  pulseTime: 30,
  disabled: false
};

Pulse.propTypes = {
  defaultLabel: PropTypes.string,
  activeLabel: PropTypes.string,
  defaultActive: PropTypes.bool,
  pulseFunction: PropTypes.func,
  pulseTime: PropTypes.number, // Seconds
  onClickFunction: PropTypes.func,
  onChangeFunction: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

