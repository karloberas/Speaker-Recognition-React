import React from 'react';

function AudioPlayer(props) {
    if(props.url !== "") {
      return(
        <audio controls src={props.url} className={props.className}></audio>
      );
    }
    else {
      return null;
    }
}

export default AudioPlayer;