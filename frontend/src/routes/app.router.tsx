import { RaiseCodeLayout } from "@/raiseCode/layouts/RaiseCodeLayout";
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