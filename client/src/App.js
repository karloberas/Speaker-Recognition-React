import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route } from 'react-router-dom';

import Profile from './Pages/Profile.js';
import Identification from './Pages/Identification.js';
import Enrollment from './Pages/Enrollment.js';

import Button from './Components/Button.js';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active:""
    };
  }

 handleClick = (menu) => {
   if(menu === "Profile") {
    this.setState({active:"Profile"});
   }
   else if(menu === "Enrollment") {
    this.setState({active:"Enrollment"});
   }
   else {
    this.setState({active:"Identification"});
   }
 }

 render() {
    return (
      <div>
        <div>
          <Button className={this.state.active === "Profile" ? 'menu-button button button-active' : 'menu-button button'} value="Profile" action="/profile" onClick={() => this.handleClick("Profile")}/>
          <Button className={this.state.active === "Enrollment" ? 'menu-button button button-active' : 'menu-button button'} value="Enrollment" action="/enrollment" onClick={() => this.handleClick("Enrollment")} />
          <Button className={this.state.active === "Identification" ? 'menu-button button button-active' : 'menu-button button'} value="Identification" action="/identification" onClick={() => this.handleClick("Identification")} />
        </div>
        <Route path="/profile" component={Profile} />
        <Route path="/enrollment" component={Enrollment} />
        <Route path="/identification" component={Identification} />
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title"><a href="/">Speaker Recognition</a></h1>
        </header>
        <BrowserRouter>
          <Menu />
        </BrowserRouter>
      </div>
    );
  }
}


export default App;
