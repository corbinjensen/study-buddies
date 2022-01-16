import {CallClient, CallAgent, LocalVideoStream, VideoStreamRenderer} from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import React, {useEffect, useRef} from 'react';
import {Button, Form} from "react-bootstrap";

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
      const identityToken = await fetch('/azure/authenticate', { method: 'POST' }).then(res => res.json());
      setUserId(identityToken.user.communicationUserId);

      const callClient = new CallClient();
      console.log(token);
      const tokenCredential = new AzureCommunicationTokenCredential(token || identityToken.token);
      const callAgent = await callClient.createCallAgent(tokenCredential, { displayName: 'test' });

      const deviceManager = await callClient.getDeviceManager();
      await deviceManager.askDevicePermission({ video: true });
      await deviceManager.askDevicePermission({ audio: true });

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
      localVideoRef.current.appendChild(view.target);
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
    if (deviceManager && buddyVideoRef.current && callAgent) {
      callAgent.on('incomingCall', callbackFn);
      return () => {
        callAgent.off('incomingCall', callbackFn);
      };
    }
  }, [callAgent, deviceManager, buddyVideoRef]);

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
    const currentCall = callAgent.startCall([{ communicationUserId: number }], { videoOptions });
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
    <Form.Control onChange={e => setNumber(e.target.value)} value={number}/>
    <Button 
    disabled={currentCall != null || callAgent == null || number.length === 0} 
    onClick={makeCall}>
      Call <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
</svg>
      </Button>
    <Button disabled={currentCall == null} onClick={hangUp}>Hangup <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone-x-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511zm9.261 1.135a.5.5 0 0 1 .708 0L13 2.793l1.146-1.147a.5.5 0 0 1 .708.708L13.707 3.5l1.147 1.146a.5.5 0 0 1-.708.708L13 4.207l-1.146 1.147a.5.5 0 0 1-.708-.708L12.293 3.5l-1.147-1.146a.5.5 0 0 1 0-.708z"/>
</svg></Button>
    <p>Your Video:</p>
    <div ref={localVideoRef} style={{ height: '100px', width: '180px' }}/>
    <p>Study Buddy Video:</p>
    <div ref={buddyVideoRef} style={{ height: '200px', width: '360px' }}/>
  </>;
}
