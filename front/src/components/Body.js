import {createBrowserRouter, RouterProvider} from "react-router-dom";
import PageNotFound from "./Error/PageNotFound"
import Browse from "./Browse"
import Login from "./Login";

const Body = () => {
    const appRouter = createBrowserRouter([
        {
            path: "/",
            element: <Login/>
        },
        {
            path: "*",
            element: <PageNotFound/>
        }
    ])
    return (
        <div>
            <RouterProvider router={appRouter}>
            </RouterProvider>
        </div>
    )
}

export default Body