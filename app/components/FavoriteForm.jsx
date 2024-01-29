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
