import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

export async function action({ params }) {
    invariant(params.contactId, "Missing contactId param");
    await fetch(`${process.env.API}/contacts/${params.contactId}`, {
        method: "DELETE"
    });
    return redirect("/");
}
