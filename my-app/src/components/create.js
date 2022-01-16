import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Form, Button } from "react-bootstrap";

export default function Create() {
    const [form,setForm] = useState({
        firstName :"",
        lastName : "",
        classes : "",
    }); 


const navigate = useNavigate();

// These methods will update the state properties.
function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission
  async function onSubmit(e) {
    e.preventDefault();

   // When a post request is sent to the create url,
   // we'll add a new record to the database.
   const newPerson = {...form};

   await fetch("http://localhost:5001/record/add", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(newPerson),
   })
   .catch(error => {
     window.alert(error);
     return;
   });

   setForm({ firstName: "", lastName: "", classes: "" });
   navigate("/");
}; // end onSubmit()

 // This following section will display the form that takes 
 // the input from the user.
// This following section will display the form that takes the input from the user.
return (
    <>
        <h3>Sign Up New Student</h3>
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
        
           
            <Button variant="primary" type="submit">
                Create Student
            </Button>

        </Form>

    </>
  );
 
};