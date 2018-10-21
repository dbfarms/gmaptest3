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

//keep imports below otherwise it don't work! ////////////////////////////
import drums_2 from '../jams/shaynasong/drums_2.mp3' ///  
import drums_3 from '../jams/shaynasong/drums_3.mp3'
import drums_main from '../jams/shaynasong/drums_main.mp3'
import heavy_synth_1 from '../jams/shaynasong/heavy_synth_1.mp3'
import heavy_synth_2 from '../jams/shaynasong/heavy_synth_2.mp3'
import strings_1 from '../jams/shaynasong/strings_1.mp3'
import synth_1 from '../jams/shaynasong/synth_1.mp3'
import synth_2 from '../jams/shaynasong/synth_2.mp3'
import weird_swell_1 from '../jams/shaynasong/weird_swell_1.mp3'
import clock_ticking from '../jams/clock_ticking.mp3';
import footsteps_on_fallen_leaves from '../jams/footsteps_on_fallen_leaves.mp3';
import title_theme from '../jams/metroid/sm01.mp3' //at polygon start
import boss_theme_1 from '../jams/metroid/sm05.mp3' //or inbetween places? or some in betweens
import space_pirates from '../jams/metroid/sm11.mp3' // title theme
import item_ambience from '../jams/metroid/sm13.mp3' // not sure yet
import success from '../jams/metroid/sm14.mp3' //successful sound
import jungle_floor from '../jams/metroid/sm15.mp3' //good long piece for general walking around, will play if you hit a 
//safe square and then maybe switches back to earlier theme or danger music
import undeground_depths from '../jams/metroid/sm16.mp3' // creepy music, longer
import boss_theme_2 from '../jams/metroid/sm17.mp3' // minor creepy
import boss_theme_3 from '../jams/metroid/sm19.mp3' // next level desperation, after first inbetween music time limit is up?
/////////////////////////////////////////////////////////
/*
out of shape music has a sequence, so it gets more and more intense with tracks
figure out which metroid tracks! and/or bring earbuds!
2) prologue minus intro for... something HAVEN'T USED THIS ONE YET CAUSE I HAVEN'T EDITED IT
*/

class Player extends Component {
  constructor(props) {
    super(props)
    console.log(props)
    /*
    console.log(title_theme) // from '../jams/metroid/sm01.mp3' //at polygon start
  console.log(boss_theme_1) // from '../jams/metroid/sm05.mp3' //or inbetween places? or some in betweens
  console.log(space_pirates) // from '../jams/metroid/sm11.mp3' // title theme
  console.log(item_ambience)// from '../jams/metroid/sm13.mp3' // not sure yet
  console.log(success) // from '../jams/metroid/sm14.mp3' //successful sound
  console.log(jungle_floor) // from '../jams/metroid/sm15.mp3' //good long piece for general walking around, will play if you hit a 
  //safe square and then maybe switches back to earlier theme or danger music
  console.log(undeground_depths) // from '../jams/metroid/sm16.mp3' // creepy music, longer
  console.log(boss_theme_2) // from '../james/metroid/sm17.mp3' // minor creepy
  console.log(boss_theme_3)
  */

    this.state = {
      url: this.props.activeTrack,
      playing: true,
      volume: this.props.effects.volume, 
      muted: false,
      played: 0,
      loaded: 0,
      duration: 0,
      playbackRate: this.props.effects.playbackRate, //1.0,
      loop: this.props.effects.loop, //
      activeTrack: this.props.activeTrack,
      //allTracks: this.props.allTracks, //
      stopPlayingTest: this.props.stopPlayingTest,
      trackSequence: this.props.trackSequence,
      playIndex: null,
      effects: this.props.effects,
      key: this.props.key,
    }
  }

  /*  to do:
    -start: basic track plays when you start, maybe a wash or something
    -sequence is built, but how?
      -hit polygons on map (in preloaded map... what about dynamic map?)
    -
  */
  
  componentWillReceiveProps(nextProps) { //dont know how to use prevState,
    /*
    console.log(drums_2) 
    console.log(drums_3) 
    console.log(drums_main )
    console.log(heavy_synth_1)
    console.log(heavy_synth_2)
    console.log(strings_1)
    console.log(synth_1)
    console.log(synth_2)
    console.log(weird_swell_1)
    console.log(clock_ticking)
    console.log(footsteps_on_fallen_leaves)
  debugger
  console.log(title_theme) // from '../jams/metroid/sm01.mp3' //at polygon start
  console.log(boss_theme_1) // from '../jams/metroid/sm05.mp3' //or inbetween places? or some in betweens
  console.log(space_pirates) // from '../jams/metroid/sm11.mp3' // title theme
  console.log(item_ambience)// from '../jams/metroid/sm13.mp3' // not sure yet
  console.log(success) // from '../jams/metroid/sm14.mp3' //successful sound
  console.log(jungle_floor) // from '../jams/metroid/sm15.mp3' //good long piece for general walking around, will play if you hit a 
  //safe square and then maybe switches back to earlier theme or danger music
  console.log(undeground_depths) // from '../jams/metroid/sm16.mp3' // creepy music, longer
  console.log(boss_theme_2) // from '../james/metroid/sm17.mp3' // minor creepy
  console.log(boss_theme_3)
 */

   //debugger 

    console.log("nextProps")
    console.log(nextProps)
    if (nextProps.key !== undefined ) { 
      debugger 
      //key not passing down in props for some reason... 
    }

    if (nextProps.activeTrack !== undefined) {  
      //debugger 
      const trackPath = nextProps.activeTrack //this.setTrackPath(nextProps.activeTrack); // this gets teh actual file path for the track
      //console.log(trackPath)
      if (trackPath !== this.state.activeTrack ) { // || this.state.playing === false) {
        //debugger 
        this.setState({
          activeTrack: trackPath,
          url: trackPath,
          playing: nextProps.playing, //true
          volume: nextProps.effects.volume, 
          playbackRate: nextProps.effects.playbackRate,
          trackSequence: nextProps.trackSequence,
        })
      } else { //this means trackPath === this.state.activeTrack 
        if (nextProps.trackSequence.baseTrack === "ticktock_song") {
          this.setState({
            //activeTrack: trackPath,
            //url: trackPath,
            playing: nextProps.playing, //true,
            volume: nextProps.effects.volume, 
            playbackRate: nextProps.effects.playbackRate,
          })
        }
      }
    } else { //if nextProps.activeTrack does equal undefined, none of the below needs to be updated becuase it's not a track to be played 
      //debugger 
      
      this.setState({
        activeTrack: undefined,
        url: undefined,
        playing: false, 
        volume: nextProps.effects.volume,
        playbackRate: nextProps.effects.playbackRate,
      })
    }

    if (nextProps.playing === false) {
      this.setState({
        playing: false
      })
    }
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
    } else if (this.state.trackSequence) {
      const index = this.state.playIndex 
      const url = this.state.trackSequence[index]
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
    const { url, key, activeTrack, playing, volume, muted, loop, played, loaded, duration, playbackRate } = this.state
    //const SEPARATOR = ' · '
    //console.log("this.state")
    //console.log(this.state)
    if (url !== undefined) {
      //debugger
      console.log(url)
      console.log(playing)
    }
    return (
      <div className='app'>
        <section className='section'>
          <h4>Player {key}</h4>
          <div className='player-wrapper'>
          <label>{url}</label>
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
              //muted={muted}
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

          
            {/*
            <table><tbody>
              <tr>
              <th>Played</th>
              <td><progress max={1} value={played} /></td>
            </tr>
          </tbody></table>
            */}
            
        </section>

        <section className='section'>
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