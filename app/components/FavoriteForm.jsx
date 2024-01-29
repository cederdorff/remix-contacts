import { useFetcher } from "@remix-run/react";

export default function FavoriteForm({ contact }) {
    const fetcher = useFetcher();
    const favorite = fetcher.formData
        ? fetcher.formData.get("favorite") === "true"
        : contact.favorite;

    return (
        <fetcher.Form method="patch">
            <button
                aria-label={
                    favorite ? "Remove from favorites" : "Add to favorites"
                }
                name="favorite"
                value={favorite ? "false" : "true"}>
                {favorite ? "★" : "☆"}
            </button>
        </fetcher.Form>
    );
}

// Actions only run on the server and handle POST
// PUT, PATCH, and DELETE. They can also provide data
// to the component
export async function action({ params }) {
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
