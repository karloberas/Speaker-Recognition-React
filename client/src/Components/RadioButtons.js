import React from 'react';

function RadioButtons(props) {
    var profileList = props.profileList.map(function(profile, i) {
      if(profile.enrolled) {
        return <p key={i} className="radio-label"><input className="option-input radio" key={i} type="radio" name={props.name} value={profile.identificationProfileId} onChange={props.onChange} />{profile.name} <i>(Enrolled)</i></p>
      }
      else {
        return <p key={i} className="radio-label"><input className="option-input radio" key={i} type="radio" name={props.name} value={profile.identificationProfileId} onChange={props.onChange} />{profile.name}</p>
      }
    });
    return <form>{profileList}</form>
}

export default RadioButtons;