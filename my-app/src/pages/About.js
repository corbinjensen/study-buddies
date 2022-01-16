import {Row, Form, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import DataStore from '../dataStore';

export default function About() {
    return (
      <main style={{ padding: "1rem 0" }}>
        <p>Pandemic bringing your mood down? Need some social interaction safely?</p>
        <p>This is the place for you!</p>
        <p>Find a Study Buddy™ within seconds and start finding friends online!</p>
      </main>
    );
  }
