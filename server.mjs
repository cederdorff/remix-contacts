import { createRequestHandler } from "@remix-run/express";
import { broadcastDevReady } from "@remix-run/node";
import express from "express";
import contacts from "./data.mjs";
import * as build from "./build/index.js";

// ========== Setup ========== //

// Create Express server
const server = express();
const PORT = process.env.PORT ?? 3000;

// Configure middleware to serve static assets from public directory
server.use(express.static("public"));
// Prettify JSON output when sending res.json() responses
server.set("json spaces", 2);

// ========== API Routes ========== //
const api = express.Router();

// Configure middleware to parse JSON from request body
api.use(express.json());

// Root route
api.get("/", (req, res) => {
    res.send("Node.js REST API with Express.js");
});

// Get all contacts (GET /contacts)
api.get("/contacts", (req, res) => {
    res.json(contacts); // return contacts list as JSON
});

// Search contacts (GET /contacts/search?q=)
api.get("/contacts/search", (req, res) => {
    const searchString = req.query.q.toLowerCase(); // get query string from request URL and lowercase it
    const filteredContacts = contacts.filter(
        // filter contacts array
        (contact) =>
            contact.first.toLowerCase().includes(searchString) ||
            contact.last.toLowerCase().includes(searchString)
    );
    res.json(filteredContacts); // return filtered contacts list as JSON
});

// Get single contact (GET /contacts/:id)
api.get("/contacts/:id", (req, res) => {
    const id = Number(req.params.id); // get id from request URL
    const contact = contacts.find((contact) => contact.id === id); // find the contact in contacts array

    if (contact) {
        res.json(contact); // return contact as JSON if found
    } else {
        res.status(404).json({ message: "Contact not found!" }); // otherwise return 404 and error message
    }
});

// Create contact (POST /contacts)
api.post("/contacts", (req, res) => {
    const id = new Date().getTime(); // not really unique, but it's something
    const createdAt = new Date().toISOString(); // ISO string
    const newContact = { id, createdAt, ...req.body }; // merge data from request body into new contact object
    contacts.push(newContact); // push new contact object into contacts array
    res.json(newContact); // return new contact object as JSON
});

// Update contact (PUT /contacts/:id)
api.put("/contacts/:id", (req, res) => {
    const id = Number(req.params.id); // get id from request URL
    const updatedContact = req.body; // get updated properties from request body
    const contact = contacts.find((contact) => contact.id === id); // find the contact in contacts array

    // update contact properties with new values
    contact.first = updatedContact.first;
    contact.last = updatedContact.last;
    contact.twitter = updatedContact.twitter;
    contact.avatar = updatedContact.avatar;

    res.json(contact); // return updated contact
});

// Delete contact (DELETE /contacts/:id)
api.delete("/contacts/:id", (req, res) => {
    const id = Number(req.params.id); // get id from request URL
    const index = contacts.findIndex((contact) => contact.id === id); // find index of contact in contacts array
    contacts.splice(index, 1); // remove contact from contacts array
    res.json({ message: `Deleted contact with id ${id}` }); // return message
});

// Toggle favorite property of contact (PUT /contacts/:id/favorite)
api.put("/contacts/:id/favorite", (req, res) => {
    const id = Number(req.params.id); // get id from request URL
    const contact = contacts.find((contact) => contact.id === id); // find the contact in contacts array
    contact.favorite = !contact.favorite; // toggle favorite property
    res.json(contact); // return updated contact
});

// ========== Hook up routes ========== //

// Serve the API routes
server.use("/api", api);

// Serve the Remix app
server.all("*", createRequestHandler({ build }));

// ========== Start server ========== //

// Start server on port 3000 (or whatever is set in .env)
server.listen(PORT, () => {
    if (process.env.NODE_ENV === "development") {
        broadcastDevReady(build);
    }
    console.log(`Server is running on http://localhost:${PORT}`);
});
