import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';


const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            // { index: true, element: <HomePage /> },
            // { path: 'incidents', element: <IncidentsPage /> },
            // { path: 'guards', element: <GuardsPage /> },
        ],
    },
]);


export default function AppRouter() {
    return <RouterProvider router={router} />;
}