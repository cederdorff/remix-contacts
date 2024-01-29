import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import ContactForm from "../components/ContactForm";

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

    return (
        <>
            <h1>Update Contact</h1>
            <ContactForm method="PUT" contact={contact} />
        </>
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
