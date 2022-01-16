import {CallClient, CallAgent, LocalVideoStream, VideoStreamRenderer} from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import React, {useEffect, useRef} from 'react';
import {Button, Form} from "react-bootstrap";
import DataStore from './dataStore';
import {
  CameraButton,
  ControlBar,
  EndCallButton,
  GridLayout,
  MicrophoneButton,
  DevicesButton,
  ScreenShareButton,
  VideoGallery
} from '@azure/communication-react';

import { FluentThemeProvider, DEFAULT_COMPONENT_ICONS } from '@azure/communication-react';
import { registerIcons } from '@fluentui/react';
export default function AzureCaller() {
  const [callClient, setCallClient] = React.useState();
  const [callAgent, setCallAgent] = React.useState();
  const [deviceManager, setDeviceManager] = React.useState();
  const [userId, setUserId] = React.useState();
  const [currentCall, setCurrentCall] = React.useState();
  const [token, setToken] = React.useState('');
  const [number, setNumber] = React.useState('');
  const [identity, setIdentity] = React.useState({});
  const [localVideoStream, setLocalVideoStream] = React.useState();
  const [remoteVideoStream, setRemoteVideoStream] = React.useState();
  registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

  useEffect(() => {
    async function init() {
      setCallAgent(null);
      const identityToken = await fetch('/azure/authenticate', {
        method: 'POST',
        body: JSON.stringify({ name: DataStore.getName() }),
        headers: {
          'Content-Type': 'application/json'
        },
      }, ).then(res => res.json());
      setUserId(identityToken.user.communicationUserId);

      const callClient = new CallClient()
      console.log(token);
      const tokenCredential = new AzureCommunicationTokenCredential(token || identityToken.token);
      const callAgent = await callClient.createCallAgent(tokenCredential, { displayName: 'test' });

      const deviceManager = await callClient.getDeviceManager();
      await deviceManager.askDevicePermission({ video: true });
      await deviceManager.askDevicePermission({ audio: true });

      setCallClient(callClient);
      setDeviceManager(deviceManager);
      setCallAgent(callAgent);

      const camera = (await deviceManager.getCameras())[0];
      const stream = camera ? new LocalVideoStream(camera) : undefined;

      if (stream) {
        const renderer = new VideoStreamRenderer(stream);
        const view = await renderer.createView();
        setLocalVideoStream(view.target);
      }
    }
    init();
  }, [token]);
  useEffect(() => {
    async function init() {
      setIdentity(await fetch('/azure').then(res => res.json()));
    }
    setInterval(init, 2000);
  }, []);

  async function onIncomingCall(args) {
    console.log(args);
    const camera = (await deviceManager.getCameras())[0];
    const stream = camera ? new LocalVideoStream(camera) : undefined;

    if (stream) {
      const renderer = new VideoStreamRenderer(stream);
      const view = await renderer.createView();
      setLocalVideoStream(view.target);
    }
    const videoOptions = stream ? { localVideoStreams: [stream] } : undefined;

    const currentCall = await args.incomingCall.accept({ videoOptions });
    setCurrentCall(currentCall);
    addCallListeners(currentCall);
  }

  useEffect(() => {
    const callbackFn = e => {
      console.log(e);
      onIncomingCall(e);
    };
    if (deviceManager && callAgent) {
      callAgent.on('incomingCall', callbackFn);
      return () => {
        callAgent.off('incomingCall', callbackFn);
      };
    }
  }, [callAgent, deviceManager]);

  async function makeCall(num) {
    const camera = (await deviceManager.getCameras())[0];
    const stream = camera ? new LocalVideoStream(camera) : undefined;

    if (stream) {
      const renderer = new VideoStreamRenderer(stream);
      const view = await renderer.createView();
      setLocalVideoStream(view.target);
    }
    const videoOptions = stream ? { localVideoStreams: [stream] } : undefined;

    const currentCall = callAgent.startCall([{ communicationUserId: number }], { videoOptions });
    setCurrentCall(currentCall);
    addCallListeners(currentCall);
  }

  async function addCallListeners(currentCall) {
    console.log(currentCall);
    currentCall.on('idChanged', () => console.log(currentCall));
    currentCall.on('stateChanged', () => {
      if (currentCall.state === 'Disconnected') {
        hangUp();
      }
    });
    currentCall.on('localVideoStreamsUpdated', (e) => console.log(e, currentCall));
    currentCall.remoteParticipants.forEach(buddy => {
      addBuddyListeners(buddy);
    });
    currentCall.on('remoteParticipantsUpdated', (e) => {
      console.log(e, currentCall);
      e.added.forEach(buddy => {
        addBuddyListeners(buddy)
      });
    });
  }

  async function addBuddyListeners(buddy) {
    buddy.videoStreams.forEach(stream => {
      startRemoteVideo(stream);
    });
    buddy.on('videoStreamsUpdated', (e) => {
      e.added.forEach(stream => {
        startRemoteVideo(stream);
      });
    });
  }

  async function startRemoteVideo(stream) {
    const renderer = new VideoStreamRenderer(stream);
    const view = await renderer.createView();
    setRemoteVideoStream(view.target);
  }

  function hangUp() {
    currentCall.hangUp({ forEveryone: true });
    setCurrentCall(null);
    setRemoteVideoStream(null);
  }
  return <FluentThemeProvider style={{ height: '70%' }}>
    {callAgent == null && <p>Loading...</p>}
    {callAgent != null && <p>You are now ready to find your Study Buddy™!</p>}

    { callAgent != null && <div style={{ height: '75px' }}>
      <ControlBar styles={{ root: { height: '75px', justifyContent: 'center'} }}>
        {callAgent != null && typeof identity === 'object' && Object.keys(identity).length > 0 && <Form.Select onChange={(event) => {
          const e = event.target.value;
          setNumber(e == 'null' ? '' : e);
        }} style={{ width: '40%' }}>
          <option value={"null"}>Please select one...</option>
          {Object.keys(identity).filter(e => e !== DataStore.getName()).map(e => <option value={identity[e].user.communicationUserId} >{e}</option>)}
        </Form.Select>}
        <EndCallButton
          disabled={number == 'null'}
          styles={{
            root: currentCall == null ? { background: '#7FBA00' } : {},
            rootHovered: currentCall == null ? { background: '#7FBA00' } : {},
            rootChecked: currentCall == null ? { background: '#7FBA00' } : {},
            rootPressed: currentCall == null ? { background: '#7FBA00' } : {},
        }}
          onHangUp={currentCall == null ? makeCall : hangUp}
          strings={{ tooltipContent: currentCall == null ? 'Make Call' : 'Leave Call'}}
        />
        <CameraButton />
        <MicrophoneButton />
        <ScreenShareButton
        />
        <DevicesButton />
      </ControlBar>
    </div>}

    {callAgent != null && <VideoGallery
      localParticipant={{ userId: '1', displayName: 'You!', videoStream: { renderElement: localVideoStream } }}
      remoteParticipants={remoteVideoStream == null ? [] : [{ userId: '2', displayName: 'Study Buddy', videoStream: { isAvailable: true, renderElement: remoteVideoStream } }]}
      maxRemoteVideoStreams={99}
    />}
  </FluentThemeProvider>;
}
