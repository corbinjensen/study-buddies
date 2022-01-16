import {CallClient, CallAgent, LocalVideoStream, VideoStreamRenderer} from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import React, {useEffect, useRef} from 'react';
import AzureIdentity from './azureIdentity';

export default function AzureCaller() {
  const [callClient, setCallClient] = React.useState();
  const [callAgent, setCallAgent] = React.useState();
  const [deviceManager, setDeviceManager] = React.useState();
  const [userId, setUserId] = React.useState();
  const [currentCall, setCurrentCall] = React.useState();
  const [token, setToken] = React.useState('');
  const [number, setNumber] = React.useState('');
  const localVideoRef = useRef();
  const buddyVideoRef = useRef();

  useEffect(() => {
    async function init() {
      setCallAgent(null);
      const identityToken = await AzureIdentity.getIdentityToken();
      console.log(identityToken);
      setUserId(identityToken.user.communicationUserId);

      const callClient = new CallClient();
      console.log(token);
      const tokenCredential = new AzureCommunicationTokenCredential(token || identityToken.token);
      const callAgent = await callClient.createCallAgent(tokenCredential, { displayName: 'test' });

      const deviceManager = await callClient.getDeviceManager();
      await deviceManager.askDevicePermission({ video: true });
      await deviceManager.askDevicePermission({ audio: true });

      callAgent.on('incomingCall', e => {
        console.log(e);
        onIncomingCall(e);
      });

      setCallClient(callClient);
      setDeviceManager(deviceManager);
      setCallAgent(callAgent);
    }
    init();
  }, [token]);

  async function onIncomingCall(args) {
    console.log(args);
    const camera = (await deviceManager.getCameras())[0];
    const stream = camera ? new LocalVideoStream(camera) : undefined;

    if (stream) {
      const renderer = new VideoStreamRenderer(stream);
      const view = await renderer.createView();
      buddyVideoRef.current.appendChild(view.target);
    }
    const videoOptions = stream ? { localVideoStreams: [stream] } : undefined;

    const currentCall = args.incomingCall.accept({ videoOptions });
    setCurrentCall(currentCall);
    addCallListeners(currentCall);
  }

  async function makeCall() {
    const camera = (await deviceManager.getCameras())[0];
    const stream = camera ? new LocalVideoStream(camera) : undefined;

    if (stream) {
      const renderer = new VideoStreamRenderer(stream);
      const view = await renderer.createView();
      localVideoRef.current.appendChild(view.target);
    }
    const videoOptions = stream ? { localVideoStreams: [stream] } : undefined;


    console.log([{ communicationUserId: number }], { videoOptions });
    const currentCall = callAgent.createCall([{ communicationUserId: number }], { videoOptions });
    setCurrentCall(currentCall);
    addCallListeners(currentCall);
  }

  async function addCallListeners(currentCall) {
    console.log(currentCall);
    currentCall.on('idChanged', () => console.log(currentCall));
    currentCall.on('stateChanged', () => console.log(currentCall));
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
    buddyVideoRef.current.appendChild(view.target);
  }

  function hangUp() {
    currentCall.hangUp({ forEveryone: true });
    setCurrentCall(null);
    localVideoRef.current.innerHTML = '';
    buddyVideoRef.current.innerHTML = '';
  }

  return <>
    {callAgent == null && <p>Loading...</p>}
    {callAgent != null && <p>Your user ID is: {userId}</p>}
    <input onChange={e => setToken(e.target.value)} value={token}/>
    <input onChange={e => setNumber(e.target.value)} value={number}/>
    <button disabled={currentCall != null || callAgent == null || number.length === 0} onClick={makeCall}>Call</button>
    <button disabled={currentCall == null} onClick={hangUp}>Hangup</button>
    <p>Your Video:</p>
    <div ref={localVideoRef} style={{ height: '200px' }}/>
    <p>Study Buddy Video:</p>
    <div ref={buddyVideoRef} style={{ maxHeight: '500px' }}/>
  </>;
}
