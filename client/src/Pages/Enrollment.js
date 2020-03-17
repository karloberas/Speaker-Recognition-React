import React, { Component } from 'react';
import Axios from 'axios';

import SampleText from '../Components/SampleText.js';
import RadioButtons from '../Components/RadioButtons.js';
import AudioRecorder from '../Components/AudioRecorder.js';

const url = "";

class Enrollment extends Component {
    constructor(props) {
      super(props);
      this.state = {
        identificationProfileId: "",
        profileList:[],
        location: "",
        status: "",
        enrollmentStatus: ""
      };
  
    }
  
    componentDidMount() {
      this.retrieveProfiles();
    }

    retrieveProfiles = () => {
      Axios.get(`${url}/profile`).then(
        (response) => {
          this.setState({profileList:response.data});
        },
        (err) => {
          console.log(err);
        }
      );
    }
  
    handleChange = (event) => {
      this.setState({identificationProfileId:event.currentTarget.value});
    }
  
    handleSubmit = (blob) => {
      var bodyFormData = new FormData();
      bodyFormData.set('blob', blob);
      Axios.post(
        `${url}/enrollment/${this.state.identificationProfileId}`,
        bodyFormData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
      ).then(
        (response) => {
          alert('Profile Enrollment Submitted');
          this.setState({location:response.data});
          this.retrieveProfiles();
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
              this.setState({status:response.data.status, enrollmentStatus:response.data.processingResult.enrollmentStatus});
            }
            else {
              this.setState({status:response.data.status});
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

    handleReset = () => {
      Axios.put(`${url}/profile`,
        {id:this.state.identificationProfileId}
      ).then(
        (response) => {
          this.retrieveProfiles();
        },
        (err) => {
          console.log(err);
        }
      );
    }

    handleDelete = () => {
      Axios.delete(`${url}/profile`,
        {params:{id:this.state.identificationProfileId}}
      ).then(
        (response) => {
          this.retrieveProfiles();
        },
        (err) => {
          console.log(err);
        }
      );
    }
  
    render() {
      return(
        <div className="page-content">
          <h1>Enrollment</h1>
          <div className="enrollment-content">
            <div className="enrollment-profile">
              <h2>Select Profile</h2>
              <RadioButtons profileList={this.state.profileList} name="profiles" onChange={this.handleChange} />
              <button className="form-button-warning" onClick={this.handleReset}>Reset Enrollment</button>
              <button className="form-button-delete" onClick={this.handleDelete}>Delete Profile</button>
            </div>
            <div className="enrollment-recorder">
              <h2>Record Audio</h2>
              <i>Sample text:</i>
              <SampleText />
              <AudioRecorder handleSubmit={(blob) => this.handleSubmit(blob)} />
            </div>
            <div className="enrollment-status">
              <h2>Result</h2>
              <button className="form-button" onClick={this.handleCheck}>Check Status</button>
              <ul>
                <li>Status: {this.state.status}</li>
                <li>Enrollment Status: {this.state.enrollmentStatus}</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }
}

export default Enrollment;