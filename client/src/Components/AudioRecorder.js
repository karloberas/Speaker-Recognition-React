import React, { Component } from 'react';
import Recorder from './recorder.js';
import AudioPlayer from './AudioPlayer.js'

var audio_context;
var recorder;

class AudioRecorder extends Component {
    constructor(props) {
      super(props);
      this.state = {
        button_status:"Record",
        url:"",
        blob:null
      };
    }
  
    componentWillMount() {
      try {
        // Monkeypatch for AudioContext, getUserMedia and URL
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
        window.URL = window.URL || window.webkitURL;
  
        // Store the instance of AudioContext globally
        audio_context = new AudioContext();
        console.log('Audio context is ready !');
        console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
      } catch (e) {
          alert('No web audio support in this browser!');
      }
    }
  
    startRecording() {
      // Access the Microphone using the navigator.getUserMedia method to obtain a stream
      navigator.getUserMedia({ audio: true }, function(stream) {
        var input = audio_context.createMediaStreamSource(stream);
        console.log('Media stream succesfully created');
        recorder = new Recorder(input);
        console.log('Recorder initialised');
        recorder && recorder.record();
        console.log('Recording...');
      }, function(e) {
        console.error('No live audio input: ' + e);
      });
  
    }
  
    stopRecording() {
       // Stop the recorder instance
       recorder && recorder.stop();
       console.log("Stopped recording.")
       // create WAV download link using audio data blob
      
       recorder && recorder.exportWAV((blob) => {
        var url = URL.createObjectURL(blob);
        this.setState({url:url, blob:blob});
       });
  
      recorder.clear();
    }
  
    handleOnClick = () => {
      if(this.state.button_status === "Record") {
        this.setState({button_status:"Stop"});
        this.startRecording();
      }
      else {
        this.setState({button_status:"Record"});
        this.stopRecording();
      }
    }
  
    handleSubmit = () => {
      this.props.handleSubmit(this.state.blob);
      //this.setState({url:"",blob:null});
    }
  
    render() {
      return (
        <div>
          <div className="player">
            <AudioPlayer url={this.state.url}></AudioPlayer>
          </div>
          <button className="form-button" onClick={this.handleOnClick}>{this.state.button_status}</button>
          &nbsp;
          <button className="form-button" onClick={this.handleSubmit}>Submit</button>
        </div>
      );
    }
}

export default AudioRecorder;