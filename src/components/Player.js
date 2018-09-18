import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { hot } from 'react-hot-loader'
//import screenfull from 'screenfull'

import './reset.css'
import './defaults.css'
import './range.css'
import '../App.css'

//import { version } from '../../package.json'
import ReactPlayer from 'react-player' //'../ReactPlayer'
import Duration from './Duration'
import track1 from '../jams/track1.mp3' ///  
import track2 from '../jams/track2.mp3'
import track3 from '../jams/track3.wav'
import track4 from '../jams/track4.wav'

class Player extends Component {
  constructor(props) {
    super(props)

    this.state = {
      url: this.props.activeTrack,
      playing: true,
      volume: this.props.effects.volume,
      muted: false,
      played: 0,
      loaded: 0,
      duration: 0,
      playbackRate: this.props.effects.playbackRate, //1.0,
      loop: this.props.effects.loop, //false,
      activeTrack: this.props.activeTrack,
      //allTracks: this.props.allTracks, //
      stopPlayingTest: this.props.stopPlayingTest,
      sequence: this.props.sequence,
      playIndex: null,
      effects: this.props.effects
    }
  }

  /*  to do:
    -start: basic track plays when you start, maybe a wash or something
    -sequence is built, but how?
      -hit polygons on map (in preloaded map... what about dynamic map?)
    -


  */
  

  componentWillReceiveProps(nextProps) { //dont know how to use prevState,
    //debugger 

    console.log("nextProps")
    console.log(nextProps)
    //NEED TO ACCEPT NEW SEQUENCE FROM NEXTPROPS AT SOME POINT JUST NEED TO FIX BELOW FIRST I GUESS

    if (nextProps.activeTrack !== undefined) {
      //debugger 
      //console.log(track1)
      //console.log(track2)
      //console.log(track3)
      //console.log(track4)

      const trackPath = this.setTrackPath(nextProps.activeTrack);
      console.log(trackPath)
      if (trackPath !== this.state.activeTrack || this.state.playing === false) {
        this.setState({
          activeTrack: trackPath,
          url: trackPath,
          playing: true,
          //volume: nextProps.effects.volume //this ain't working but prob changing how it's done anyway so fine
        })
      }
    }

    if (nextProps.playing === false) {
      this.setState({
        playing: false
      })
    }
  }

  setTrackPath(activeTrack) {
    //console.log(track1)

    switch(activeTrack) {
      case("track1"): 
        return "/static/media/track1.a468fde2.mp3"
      case("track2"):
        return "/static/media/track2.0334ef3d.mp3"
      case("track3"):
        return "/static/media/track3.db9366ce.wav"
      case("track2"):
        return "/static/media/track4.44d8193b.wav"
      default: 
        break 
    }
    //debugger 
    /*
    this.state.allTracks.map(track => {
      if (track === activeTrack) {
        return 
      }
    })
    */
  }

  load = url => {
    this.setState({
      url,
      played: 0,
      loaded: 0
    })
  }
  playPause = () => {
    this.setState({ playing: !this.state.playing })
  }
  stop = () => {
    this.setState({ url: null, playing: false })
  }
  toggleLoop = () => {
    this.setState({ loop: !this.state.loop })
  }
  setVolume = e => {
    this.setState({ volume: parseFloat(e.target.value) })
  }
  toggleMuted = () => {
    this.setState({ muted: !this.state.muted })
  }
  setPlaybackRate = e => {
    this.setState({ playbackRate: parseFloat(e.target.value) })
  }
  onPlay = () => {
    console.log('onPlay')
    this.setState({ playing: true })
  }
  onPause = () => {
    console.log('onPause')
    this.setState({ playing: false })
  }
  onSeekMouseDown = e => {
    this.setState({ seeking: true })
  }
  onSeekChange = e => {
    this.setState({ played: parseFloat(e.target.value) })
  }
  onSeekMouseUp = e => {
    this.setState({ seeking: false })
    this.player.seekTo(parseFloat(e.target.value))
  }
  onProgress = state => {
    console.log('onProgress', state)
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState(state)
    }
  }
  onEnded = () => {
    console.log('onEnded')

    if (this.state.loop) {
      this.setState({ playing: this.state.loop })
    } else if (this.state.sequence) {
      const index = this.state.playIndex 
      const url = this.state.sequence[index]
      this.setState({
        url,
        played: 0,
        loaded: 0
      })
    } else {
      this.setState({ playing: false })
    }
    
  }
  onDuration = (duration) => {
    console.log('onDuration', duration)
    this.setState({ duration })
  }

  renderLoadButton = (url, label) => {
    return (
      <button onClick={() => this.load(url)}>
        {label}
      </button>
    )
  }
  ref = player => {
    this.player = player
  }

  render () {
    const { url, activeTrack, playing, volume, muted, loop, played, loaded, duration, playbackRate } = this.state
    const SEPARATOR = ' · '
    //console.log("this.state")
    //console.log(this.state)
    //debugger

    return (
      <div className='app'>
        <section className='section'>
          <h3>Player</h3>
          <div className='player-wrapper'>
            <ReactPlayer
              ref={this.ref}
              className='react-player'
              width='100%'
              height='100%'
              url={url}
              playing={playing}
              loop={loop}
              playbackRate={playbackRate}
              volume={volume}
              muted={muted}
              onReady={() => console.log('onReady')}
              onStart={() => console.log('onStart')}
              onPlay={this.onPlay}
              onPause={this.onPause}
              onBuffer={() => console.log('onBuffer')}
              onSeek={e => console.log('onSeek', e)}
              onEnded={this.onEnded}
              onError={e => console.log('onError', e)}
              onProgress={this.onProgress}
              onDuration={this.onDuration}
            />
          </div>

          <table><tbody>
            <tr>
              <th>Controls</th>
              <td>
                <button onClick={this.stop}>Stop</button>
                <button onClick={this.playPause}>{playing ? 'Pause' : 'Play'}</button>
                <button onClick={this.setPlaybackRate} value={1}>1</button>
                <button onClick={this.setPlaybackRate} value={1.5}>1.5</button>
                <button onClick={this.setPlaybackRate} value={2}>2</button>
              </td>
            </tr>
            <tr>
              <th>Seek</th>
              <td>
                <input
                  type='range' min={0} max={1} step='any'
                  value={played}
                  onMouseDown={this.onSeekMouseDown}
                  onChange={this.onSeekChange}
                  onMouseUp={this.onSeekMouseUp}
                />
              </td>
            </tr>
            <tr>
              <th>Volume</th>
              <td>
                <input type='range' min={0} max={1} step='any' value={volume} onChange={this.setVolume} />
              </td>
            </tr>
            <tr>
              <th>
                <label htmlFor='muted'>Muted</label>
              </th>
              <td>
                <input id='muted' type='checkbox' checked={muted} onChange={this.toggleMuted} />
              </td>
            </tr>
            <tr>
              <th>
                <label htmlFor='loop'>Loop</label>
              </th>
              <td>
                <input id='loop' type='checkbox' checked={loop} onChange={this.toggleLoop} />
              </td>
            </tr>
            <tr>
              <th>Played</th>
              <td><progress max={1} value={played} /></td>
            </tr>
            <tr>
              <th>Loaded</th>
              <td><progress max={1} value={loaded} /></td>
            </tr>
          </tbody></table>
        </section>

        <section className='section'>
          <table><tbody>
            <tr>
              <th>Files</th>
              <td>
                {this.renderLoadButton(track1, 'mp3')}
                {this.renderLoadButton(track2, 'mp3')}
                {this.renderLoadButton(track3, 'wav')}
                {this.renderLoadButton(track4, 'wav')}
              </td>
            </tr>
          </tbody></table>

          <table><tbody>
            
            <tr>
              <th>playing</th>
              <td>{playing ? 'true' : 'false'}</td>
            </tr>
            <tr>
              <th>volume</th>
              <td>{volume.toFixed(3)}</td>
            </tr>
            <tr>
              <th>played</th>
              <td>{played.toFixed(3)}</td>
            </tr>
            <tr>
              <th>loaded</th>
              <td>{loaded.toFixed(3)}</td>
            </tr>
            <tr>
              <th>duration</th>
              <td><Duration seconds={duration} /></td>
            </tr>
            <tr>
              <th>elapsed</th>
              <td><Duration seconds={duration * played} /></td>
            </tr>
            <tr>
              <th>remaining</th>
              <td><Duration seconds={duration * (1 - played)} /></td>
            </tr>
          </tbody></table>
        </section>
        
      </div>
    )
  }
}

export default hot(module)(Player)

/*


/// stuff i took out 

<tr>
              <th>SoundCloud</th>
              <td>
                {this.renderLoadButton('https://soundcloud.com/failed2012/march-8th-2017', 'Test A')}
                {this.renderLoadButton('https://soundcloud.com/failed2012/march-7th-2017', 'Test B')}
                {this.renderLoadButton('https://soundcloud.com/failed2012/march-4th-2017', 'Test C')}
                {this.renderLoadButton('https://soundcloud.com/failed2012/march-2nd-2017', 'Test D')}
              </td>
            </tr>
            <tr>
              <th>Custom URL</th>
              <td>
                <input ref={input => { this.urlInput = input }} type='text' placeholder='Enter URL' />
                <button onClick={() => this.setState({ url: this.urlInput.value })}>Load</button>
              </td>
            </tr>
            
<tr>
              <th>YouTube</th>
              <td>
                {this.renderLoadButton('https://www.youtube.com/watch?v=oUFJJNQGwhk', 'Test A')}
                {this.renderLoadButton('https://www.youtube.com/watch?v=jNgP6d9HraI', 'Test B')}
              </td>
            </tr>
            <tr>
              <th>SoundCloud</th>
              <td>
                {this.renderLoadButton('https://soundcloud.com/miami-nights-1984/accelerated', 'Test A')}
                {this.renderLoadButton('https://soundcloud.com/tycho/tycho-awake', 'Test B')}
              </td>
            </tr>
            <tr>
              <th>Facebook</th>
              <td>
                {this.renderLoadButton('https://www.facebook.com/facebook/videos/10153231379946729/', 'Test A')}
                {this.renderLoadButton('https://www.facebook.com/FacebookDevelopers/videos/10152454700553553/', 'Test B')}
              </td>
            </tr>
            <tr>
              <th>Vimeo</th>
              <td>
                {this.renderLoadButton('https://vimeo.com/90509568', 'Test A')}
                {this.renderLoadButton('https://vimeo.com/169599296', 'Test B')}
              </td>
            </tr>
            <tr>
              <th>Twitch</th>
              <td>
                {this.renderLoadButton('https://www.twitch.tv/videos/106400740', 'Test A')}
                {this.renderLoadButton('https://www.twitch.tv/videos/12783852', 'Test B')}
                {this.renderLoadButton('https://www.twitch.tv/kronovi', 'Test C')}
              </td>
            </tr>
            <tr>
              <th>Streamable</th>
              <td>
                {this.renderLoadButton('https://streamable.com/moo', 'Test A')}
                {this.renderLoadButton('https://streamable.com/ifjh', 'Test B')}
              </td>
            </tr>
            <tr>
              <th>Wistia</th>
              <td>
                {this.renderLoadButton('https://home.wistia.com/medias/e4a27b971d', 'Test A')}
                {this.renderLoadButton('https://home.wistia.com/medias/29b0fbf547', 'Test B')}
              </td>
            </tr>
            <tr>
              <th>DailyMotion</th>
              <td>
                {this.renderLoadButton('https://www.dailymotion.com/video/x5e9eog', 'Test A')}
                {this.renderLoadButton('https://www.dailymotion.com/video/x61xx3z', 'Test B')}
              </td>
            </tr>
            <tr>
              <th>Mixcloud</th>
              <td>
                {this.renderLoadButton('https://www.mixcloud.com/mixcloud/meet-the-curators/', 'Test A')}
                {this.renderLoadButton('https://www.mixcloud.com/mixcloud/mixcloud-curates-4-mary-anne-hobbs-in-conversation-with-dan-deacon/', 'Test B')}
              </td>
            </tr>



            <tr>
              <th>url</th>
              <td className={!url ? 'faded' : ''}>
                {(url instanceof Array ? 'Multiple' : url) || 'null'}
              </td>
            </tr>

            {this.renderLoadButton('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4', 'mp4')}
                {this.renderLoadButton('http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv', 'ogv')}
                {this.renderLoadButton('http://clips.vorwaerts-gmbh.de/big_buck_bunny.webm', 'webm')}
                {this.renderLoadButton('https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3', 'mp3')}
                {this.renderLoadButton(MULTIPLE_SOURCES, 'Multiple')}
                {this.renderLoadButton('https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8', 'HLS (m3u8)')}
                {this.renderLoadButton('http://dash.edgesuite.net/envivio/EnvivioDash3/manifest.mpd', 'DASH (mpd)')}


///


  /*
  state = {
    url: null,
    playing: true,
    volume: 0.8,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false
  }


*/