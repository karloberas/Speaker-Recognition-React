import React, { Component } from 'react';
import Axios from 'axios';

import AudioRecorder from '../Components/AudioRecorder.js';

const url = "";

class Identification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: "",
      status: "",
      identificationProfileId: "",
      confidence: "",
      message: ""
    };
  }

  handleSubmit = (blob) => {
    var bodyFormData = new FormData();
    bodyFormData.set('blob', blob);
    Axios.post(
      `${url}/identification`,
      bodyFormData,
      {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      }
    ).then(
      (response) => {
        alert('Profile Identification Submitted');
        this.setState({location:response.data})
      },
      (err) => {
        console.log(err);
      }
    );

  }

  handleCheck = () => {
    if(this.state.location !== "") {
      Axios.post(`${url}/status`, {
        url:this.state.location
      }).then(
        (response) => {
          if(response.data.status === "succeeded") {
            var message;
            if(response.data.name !== "") {
              message = "Hello " + response.data.name + "!";
            }
            else {
              message = "Sorry, I can't recognise you.";
            }
            this.setState({status:response.data.status, identificationProfileId:response.data.identificationProfileId, confidence:response.data.confidence, message:message});
          }
          else {
            this.setState({status:response.data.status});
            alert(response.data.message);
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
    else {
      alert("Please record and submit your audio first.");
    }
  }

  render() {
    return(
      <div className="page-content">
        <h1>Identification</h1>
        <h2>Record Audio</h2>
        <AudioRecorder handleSubmit={(blob) => this.handleSubmit(blob)} />
        <div className="identification-result">
          <h2>Result</h2>
          <button className="form-button" onClick={this.handleCheck}>Check Status</button>
          <ul>
            <li>Status: {this.state.status}</li>
            <li>Profile ID: {this.state.identificationProfileId}</li>
            <li>Confidence: {this.state.confidence}</li>
          </ul>
          <h1>{this.state.message}</h1>
        </div>
      </div>
    );
  }
}

export default Identification;