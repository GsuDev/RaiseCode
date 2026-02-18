import { RaiseCodeLayout } from "@/raiseCode/layouts/raiseCodeLayout";
import { createBrowserRouter } from "react-router";

export const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <RaiseCodeLayout />,
        children: [
            {}
        ]
    }
]);