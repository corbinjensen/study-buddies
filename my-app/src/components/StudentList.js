import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Record = (props) => (
    <tr>
        <td><Link to="/chat">{props.record.firstName}</Link></td>
        <td>{props.record.lastName}</td>
        <td>{props.record.classes}</td>
        <td>
            <Link className="btn btn-link" to={`/edit/${props.record._id}`}>Edit</Link> |
            <button className="btn btn-link"
            onClick={() => {
                props.deleteRecord(props.record._id);
            }}
            >
            Delete
            </button>
         </td>
    </tr>
);


export default function StudentList() {
    const [records, setRecords] = useState([]);

     // This method fetches the records from the database.
     useEffect(() => {
        async function getRecords() {
          const response = await fetch(`/record/`);

          if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`;
            window.alert(message);
            return;
          }

          const records = await response.json();
          setRecords(records);
        }

        getRecords();

        return;
      }, [records.length]);

      // This method will delete a record
      async function deleteRecord(id) {
        await fetch(`http://localhost:5001/${id}`, {
          method: "DELETE"
        });

        const newRecords = records.filter((el) => el._id !== id);
        setRecords(newRecords);
      }

  // This method will map out the records on the table
  function recordList() {
    return records.map((record) => {
      return (
        <Record
          record={record}
          deleteRecord={() => deleteRecord(record._id)}
          key={record._id}
        />
      );
    });
  }

// This following section will display the table with the records of individuals.
return (
    <div>
      <h3 style={{ paddingTop: '25px', textAlign: 'center' }}>Student List</h3>
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Classes</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{recordList()}</tbody>
      </table>
    </div>
  );




}; // end StudentList()
