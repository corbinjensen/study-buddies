import React from 'react';
import AzureCaller from '../AzureCaller';

const styles = {
  container:{
    display: "flex",
    flexDirection: "row"
  },
  videoCall:{
    width: "75vw"
  },
  chatBox: {
    width: "25vw",
    height: "100vh"
  }

}

export default function Chat() {
    return (
      <>
        <h2>Chat</h2>
        <div style={styles.container}>
          <div style={styles.videoCall}>
            <AzureCaller/>
          </div>
          <iframe src = "https://hackathonchat-9c4e9.web.app/" style={styles.chatBox} />
        </div>
      </>
    );
  }