import {
  Links,
  Meta,
  Outlet,
  LiveReload,
  Scripts,
  useLoaderData,
  Link,
  Await
} from "@remix-run/react";
import { defer } from "@remix-run/node";
import { Suspense } from "react";

export async function loader() {
  const contactsPromise = new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve("World")
    }, 2000)
  })

  return defer({ contacts: contactsPromise });
};

export default function App() {
  const { contacts } = useLoaderData<typeof loader>();

  return (
    <html>
      <head>
        <link
          rel="icon"
          href="data:image/x-icon;base64,AA"
        />
        <Meta />
        <Links />
      </head>
      <body>
      
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={contacts}>
          {(data) => <h1>Hello { data }! </h1>}
        </Await>
      </Suspense>
        
        <Link to={`/test`}>
        <button>Navigate</button>
        </Link>
        <Outlet />

        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
