// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconKey, IconBug, IconCurrencyDollar } from '@tabler/icons-react';

// type
import { NavItemType } from 'types';

// constant
const icons = { IconKey, IconBug, IconCurrencyDollar };

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages: NavItemType = {
    id: 'pages',
    title: <FormattedMessage id="pages" />,
    caption: <FormattedMessage id="pages-caption" />,
    icon: icons.IconKey,
    type: 'group',
    children: [
        {
            id: 'invoicing',
            title: 'Faturamento',
            type: 'collapse',
            icon: icons.IconCurrencyDollar,
            children: [
                {
                    id: 'procedure',
                    title: 'Procedimento',
                    type: 'item',
                    url: '/faturamento/procedimento',
                    target: false
                },
                {
                    id: 'tableOfValues',
                    title: 'Tabela de Valores',
                    type: 'item',
                    url: '/faturamento/tabela-de-valores',
                    target: false
                },
                {
                    id: 'rulesOfInvoicing',
                    title: 'Regras de Faturamento',
                    type: 'item',
                    url: '/faturamento/regras-de-faturamento',
                    target: false
                },
                {
                    id: 'conferenceInvoice',
                    title: 'Conferência Faturamento',
                    type: 'item',
                    url: '/faturamento/conferecia-faturamento',
                    target: false
                }
            ]
        },
        {
            id: 'maintenance',
            title: <FormattedMessage id="maintenance" />,
            type: 'collapse',
            icon: icons.IconBug,
            children: [
                {
                    id: 'error',
                    title: <FormattedMessage id="error-404" />,
                    type: 'item',
                    url: '/pages/error',
                    target: true
                },
                {
                    id: 'error-500',
                    title: <FormattedMessage id="error-500" />,
                    type: 'item',
                    url: '/pages/500',
                    target: true
                },
                {
                    id: 'coming-soon',
                    title: <FormattedMessage id="coming-soon" />,
                    type: 'collapse',
                    children: [
                        {
                            id: 'coming-soon1',
                            title: (
                                <>
                                    <FormattedMessage id="coming-soon" /> 01
                                </>
                            ),
                            type: 'item',
                            url: '/pages/coming-soon1',
                            target: true
                        },
                        {
                            id: 'coming-soon2',
                            title: (
                                <>
                                    <FormattedMessage id="coming-soon" /> 02
                                </>
                            ),
                            type: 'item',
                            url: '/pages/coming-soon2',
                            target: true
                        }
                    ]
                },
                {
                    id: 'under-construction',
                    title: <FormattedMessage id="under-construction" />,
                    type: 'item',
                    url: '/pages/under-construction',
                    target: true
                }
            ]
        }
    ]
};

export default pages;
