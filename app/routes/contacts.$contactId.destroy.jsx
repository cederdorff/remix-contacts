import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

export async function action({ params }) {
    invariant(params.contactId, "Missing contactId param");
    await fetch(`http://localhost:3000/api/contacts/${params.contactId}`, {
        method: "DELETE"
    });
    return redirect("/");
}
