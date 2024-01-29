import { Form, useLoaderData, useFetcher } from "@remix-run/react";
import { json } from "@remix-run/node";
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
        <div id="contact">
            <div>
                <img
                    alt={`${contact.first} ${contact.last} avatar`}
                    key={contact.avatar}
                    src={contact.avatar}
                />
            </div>

            <div>
                <h1>
                    {contact.first || contact.last ? (
                        <>
                            {contact.first} {contact.last}
                        </>
                    ) : (
                        <i>No Name</i>
                    )}
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

                <div>
                    <Form action="edit">
                        <button type="submit">Edit</button>
                    </Form>

                    <Form
                        action="destroy"
                        method="post"
                        onSubmit={confirmDelete}>
                        <button type="submit">Delete</button>
                    </Form>
                </div>
            </div>
        </div>
    );
}
