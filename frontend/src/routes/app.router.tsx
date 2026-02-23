import { RaiseCodeLayout } from "@/raiseCode/layouts/RaiseCodeLayout";
import { HomePage } from "@/raiseCode/pages/Home/HomePage";
import { createBrowserRouter } from "react-router";

export const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <RaiseCodeLayout />,
        children: [
            {
                index: true,
                element: <HomePage />
            }
        ]
    }
]);