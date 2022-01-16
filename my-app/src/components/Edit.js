import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {Form, Button} from 'react-bootstrap';

export default function Edit() {

const [form, setForm] = useState({
    firstName :"",
    lastName : "",
    classes : "",
    records : [],
});

const params = useParams();
const navigate = useNavigate();

useEffect(() => {
    async function fetchData() {
      const id = params.id.toString();
      const response = await fetch(`/record/${params.id.toString()}`);

      if (!response.ok) {
        const message = `An error has occured: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const record = await response.json();
      if (!record) {
        window.alert(`Record with id ${id} not found`);
        navigate("/");
        return;
      }

      setForm(record);
    }

    fetchData();

    return;
  }, [params.id, navigate]);

   // These methods will update the state properties.
 function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    const editedPerson = {
      name: form.name,
      position: form.position,
      level: form.level,
    };

    // This will send a post request to update the data in the database.
    await fetch(`http://localhost:5001/update/${params.id}`, {
      method: "POST",
      body: JSON.stringify(editedPerson),
      headers: {
        'Content-Type': 'application/json'
      },
    });

    navigate("/student-list");
  }




  return(
    <>
    <h3>Edit Student</h3>
    <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlID="formBasicText">
            <Form.Label>First Name</Form.Label>
            <Form.Control
            type="text"
            placeholder="Enter First Name"
            className="form-control"
            id="firstName"
            value={form.firstName}
            onChange={(e) => updateForm({ firstName: e.target.value })}
            ></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlID="formBasicText2">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
            type="text"
            placeholder="Enter Last Name"
            className="form-control"
            id="lastName"
            value={form.lastName}
            onChange={(e) => updateForm({ lastName: e.target.value })}
            ></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlID="formBasicText3">
            <Form.Label>Classes</Form.Label>
            <Form.Control
            type="text"
            placeholder="Enter Classes"
            className="form-control"
            id="classes"
            value={form.classes}
            onChange={(e) => updateForm({ classes: e.target.value })}
            ></Form.Control>
        </Form.Group>
        <Button
            type="submit"
            className="btn btn-primary"
        >Edit Profile</Button>


    </Form>

</>
  );



}; // end Edit()
