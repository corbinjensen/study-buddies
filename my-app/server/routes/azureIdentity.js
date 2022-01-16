const express = require("express");

// routes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const routes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");
const {CommunicationIdentityClient} = require('@azure/communication-identity');

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

const identityClient = new CommunicationIdentityClient(process.env.REACT_APP_AZURE_CONNECTION_STRING);

// This section will help you get a list of all the records.
routes.route("/azure/authenticate").post(async function (req, res) {
  console.log('Generating Azure identity');
  res.json(await identityClient.createUserAndToken(["voip"]));
});

module.exports = routes;
