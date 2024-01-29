import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";

export async function loader({ params }) {
    invariant(params.contactId, "Missing contactId param");
    const response = await fetch(
        `${process.env.API}/contacts/${params.contactId}`
    );
    const contact = await response.json();
    if (!contact) {
        throw new Response("Not Found", { status: 404 });
    }
    return json({ contact });
}

export default function EditContact() {
    const { contact } = useLoaderData();
    const navigate = useNavigate();

    function cancel() {
        navigate(-1);
    }

    return (
        <Form id="contact-form" method="post">
            <p>
                <span>Name</span>
                <input
                    defaultValue={contact.first}
                    aria-label="First name"
                    name="first"
                    type="text"
                    placeholder="First"
                />
                <input
                    aria-label="Last name"
                    defaultValue={contact.last}
                    name="last"
                    placeholder="Last"
                    type="text"
                />
            </p>
            <label>
                <span>Twitter</span>
                <input
                    defaultValue={contact.twitter}
                    name="twitter"
                    placeholder="@jack"
                    type="text"
                />
            </label>
            <label>
                <span>Avatar URL</span>
                <input
                    aria-label="Avatar URL"
                    defaultValue={contact.avatar}
                    name="avatar"
                    placeholder="https://example.com/avatar.jpg"
                    type="text"
                />
            </label>
            <label>
                <span>Notes</span>
                <textarea defaultValue={contact.notes} name="notes" rows={6} />
            </label>
            <p>
                <button type="submit">Save</button>
                <button type="button" onClick={cancel}>
                    Cancel
                </button>
            </p>
        </Form>
    );
}

export async function action({ request, params }) {
    invariant(params.contactId, "Missing contactId param");

    const formData = await request.formData();
    const updates = Object.fromEntries(formData);

    await fetch(`http://localhost:3000/contacts/${params.contactId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updates)
    });

    return redirect(`/contacts/${params.contactId}`);
}
