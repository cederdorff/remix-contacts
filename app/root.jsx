import { json, redirect } from "@remix-run/node";
import {
    Form,
    Link,
    Links,
    LiveReload,
    Meta,
    NavLink,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
    useNavigation,
    useSubmit
} from "@remix-run/react";

import appStylesHref from "./app.css";

export const links = () => [{ rel: "stylesheet", href: appStylesHref }];

import { useEffect } from "react";

export async function loader({ request }) {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const response = await fetch(
        `${process.env.API}/contacts/search?q=${q || ""}`
    );
    const contacts = await response.json();
    return json({ contacts });
}

export default function App() {
    const { contacts, q } = useLoaderData();
    const navigation = useNavigation();
    const submit = useSubmit();
    const searching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has("q");

    useEffect(() => {
        const searchField = document.getElementById("q");
        if (searchField instanceof HTMLInputElement) {
            searchField.value = q || "";
        }
    }, [q]);

    function handleSearchOnChange(event) {
        const isFirstSearch = q === null;
        submit(event.currentTarget, {
            replace: !isFirstSearch
        });
    }

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                <div id="sidebar">
                    <h1>Remix Contacts</h1>
                    <div>
                        <Form
                            id="search-form"
                            role="search"
                            onChange={handleSearchOnChange}>
                            <input
                                id="q"
                                aria-label="Search contacts"
                                className={searching ? "loading" : ""}
                                defaultValue={q || ""}
                                placeholder="Search"
                                type="search"
                                name="q"
                            />
                            <div
                                id="search-spinner"
                                aria-hidden
                                hidden={!searching}
                            />
                        </Form>
                        <Link to="contacts/create">
                            <button type="submit">New</button>
                        </Link>
                    </div>
                    <nav>
                        {contacts.length ? (
                            <ul>
                                {contacts.map(contact => (
                                    <li key={contact._id}>
                                        <NavLink
                                            className={({
                                                isActive,
                                                isPending
                                            }) =>
                                                isActive
                                                    ? "active"
                                                    : isPending
                                                    ? "pending"
                                                    : ""
                                            }
                                            to={`contacts/${contact._id}`}>
                                            {contact.first || contact.last ? (
                                                <>
                                                    {contact.first}{" "}
                                                    {contact.last}
                                                </>
                                            ) : (
                                                <i>No Name</i>
                                            )}
                                            {contact.favorite ? (
                                                <span>★</span>
                                            ) : null}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>
                                <i>No contacts</i>
                            </p>
                        )}
                    </nav>
                </div>
                <div
                    className={
                        navigation.state === "loading" && !searching
                            ? "loading"
                            : ""
                    }
                    id="detail">
                    <Outlet />
                </div>

                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}
