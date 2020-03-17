import React, { Component } from 'react';
import Axios from 'axios';

const url = "";

class Profile extends Component {
    constructor(props) {
      super(props);
      this.state = {
        value: ''
      };
    }
  
    handleChange = (event) => {
      this.setState({value: event.target.value});
    }
  
    handleSubmit = (event) => {
      Axios.post(`${url}/profile`, {
        name:this.state.value
      }).then(
        (response) => {
          alert("Profile Registered");
          this.setState({value:""});
        },
        (err) => {
          console.log(err);
        }
      );
      event.preventDefault();
    }
  
    render() {
      return(
        <div className="page-content">
          <h1>Profile</h1>
          <form onSubmit={this.handleSubmit}>
            <div><input type="text" className="form-text" value={this.state.value} onChange={this.handleChange} placeholder="Name" /></div>
            <div><button type="submit" className="form-button">Submit</button></div>
          </form>
        </div>
      );
    }
}

export default Profile;