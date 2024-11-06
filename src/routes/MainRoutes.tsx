import { lazy } from 'react';

// project imports
import AuthGuard from 'utils/route-guard/AuthGuard';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Procedure from 'views/pages/invoicing/procedure/Procedure';
import TableOfValues from 'views/pages/invoicing/tableOfValue/TableOfValue';
// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/',
            element: <SamplePage />
        },
        {
            path: '/sample-page',
            element: <SamplePage />
        },
        {
            path: '/faturamento/procedimento',
            element: <Procedure />
        },
        {
            path: '/faturamento/tabela-de-valores',
            element: <TableOfValues />
        }
    ]
};

export default MainRoutes;
