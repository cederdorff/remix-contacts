import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import FavoriteForm from "../components/FavoriteForm";

// Loaders only run on the server and provide data
// to the component on GET requests
export async function loader({ params }) {
    invariant(params.contactId, "Missing contactId param");
    const response = await fetch(
        `http://localhost:3000/contacts/${params.contactId}`
    );
    const contact = await response.json();
    if (!contact) {
        throw new Response("Contact not found", { status: 404 });
    }
    return json({ contact });
}

export default function Contact() {
    const { contact } = useLoaderData();

    function confirmDelete(event) {
        const response = confirm(
            "Please confirm you want to delete this record."
        );
        if (!response) {
            event.preventDefault();
        }
    }

    return (
        <div id="contact" className="flex">
            <div>
                <img
                    alt={`${contact.first} ${contact.last} avatar`}
                    key={contact.avatar}
                    src={contact.avatar}
                />
            </div>

            <div className="pl-6">
                <h1 className="text-2xl flex">
                    {contact.first} {contact.last}
                    <FavoriteForm contact={contact} />
                </h1>

                {contact.twitter ? (
                    <p>
                        <a href={`https://twitter.com/${contact.twitter}`}>
                            {contact.twitter}
                        </a>
                    </p>
                ) : null}

                {contact.notes ? <p>{contact.notes}</p> : null}

                <div className="flex space-x-3 mt-3">
                    <Form action="edit">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Edit
                        </button>
                    </Form>

                    <Form
                        action="destroy"
                        method="post"
                        onSubmit={confirmDelete}>
                        <button
                            type="submit"
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                            Delete
                        </button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

// Actions only run on the server and handle POST
// PUT, PATCH, and DELETE. They can also provide data
// to the component
export async function action({ params }) {
    console.log("!!!!Yooooo!!!!");
    invariant(params.contactId, "Missing contactId param");

    const response = await fetch(
        `${process.env.API}/contacts/${params.contactId}/favorite`,
        {
            method: "PATCH"
        }
    );
    const contact = await response.json();
    return json({ contact });
}
