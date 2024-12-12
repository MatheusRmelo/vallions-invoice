import { lazy } from 'react';

// project imports
import AuthGuard from 'utils/route-guard/AuthGuard';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Procedure from 'views/pages/invoicing/procedure/Procedure';
import TableOfValues from 'views/pages/invoicing/tableOfValue/TableOfValue';
import RulesOfInvoicing from 'views/pages/invoicing/rulesOfInvoicing/RulesOfInvoicing';
import BillingConference from 'views/pages/invoicing/billingConference/billing_conference';
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
        },
        {
            path: '/faturamento/regras-de-faturamento',
            element: <RulesOfInvoicing />
        },
        {
            path: '/faturamento/conferecia-faturamento',
            element: <BillingConference />
        }
    ]
};

export default MainRoutes;
