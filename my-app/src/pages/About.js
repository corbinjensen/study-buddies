import {Row, Form, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import DataStore from '../dataStore';

export default function About() {
    return (
      <main style={{ padding: "1rem 0" }}>
        <Row><Form.Label>Name: <Form.Control onChange={e => DataStore.setName(e.target.value)}/></Form.Label></Row>
        <Row><Form.Label>Course #1: <Form.Control/></Form.Label></Row>
        <Row><Form.Label>Course #2: <Form.Control/></Form.Label></Row>
        <Row><Form.Label>Course #3: <Form.Control/></Form.Label></Row>
        <Row><Form.Label>Course #4: <Form.Control/></Form.Label></Row>
        <Row><Form.Label>Course #5: <Form.Control/></Form.Label></Row>
        <Row><Form.Label>Course #6: <Form.Control/></Form.Label></Row>
          <Link to="/chat"><Button>Match with Classmates</Button></Link>
      </main>
    );
  }
