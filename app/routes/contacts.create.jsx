import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import ContactForm from "../components/ContactForm";

export default function CreateContact() {
    return (
        <>
            <h1>Create new Contact</h1>
            <ContactForm method="POST" />
        </>
    );
}

export async function action({ request }) {
    const formData = await request.formData();
    const newContact = Object.fromEntries(formData);

    invariant(newContact.first, "Missing first name");
    invariant(newContact.last, "Missing last name");
    invariant(newContact.twitter, "Missing twitter handle");
    invariant(newContact.avatar, "Missing avatar URL");

    const response = await fetch(`${process.env.API}/contacts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newContact)
    });

    const contact = await response.json();

    return redirect(`/contacts/${contact._id}`);
}
