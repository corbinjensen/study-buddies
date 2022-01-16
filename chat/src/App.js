import React, {useEffect, useState, useRef} from 'react';
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyBsr5ga2yL8h-A-MiO4nL3o1mGlPiXHjgY",
  authDomain: "hackathonchat-9c4e9.firebaseapp.com",
  projectId: "hackathonchat-9c4e9",
  storageBucket: "hackathonchat-9c4e9.appspot.com",
  messagingSenderId: "1046300479465",
  appId: "1:1046300479465:web:f02f5db0b5b52f3872c578",
  measurementId: "G-ZPKXPYEXYJ"

})



const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
        <h1>Study Buddies chat room</h1>
        <SignOut/>
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn/>}
      </section>
    </div>
  );
}


function SignIn(){
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (<>
    <button onClick={signInWithGoogle}>Sign in with Google</button>
 </> )
}


function SignOut(){
  return auth.currentUser && (

    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom(){

  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limitToLast(25);
  const [messages] = useCollectionData(query, {idField: 'id'});

const[formValue,setFormValue] = useState('');
  const sendMessage = async(e) => {
    e.preventDefault();
    const {uid, photoURL} = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');
    dummy.current.scrollIntoView({behavior: 'smooth'});
  }

  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={dummy}></span>
      </main>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="type your message here"/>
        <button type="submit">🕊️</button>



      </form>
    </>
  )

}

function ChatMessage(props){


  
  const { text, uid, photoURL, createdAt } = props.message;
  var n = new Date(createdAt * 1000).toLocaleTimeString();
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (<>
    <div className={'message: ${messageClass}'}>
      <img src={photoURL}/>
      <p1>{n}</p1>
      <p>{text}</p>
    </div>
 </> )
}
export default App;