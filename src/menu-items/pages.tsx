// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconKey, IconBug, IconCurrencyDollar, IconForms, IconCards, IconMap } from '@tabler/icons-react';

// type
import { NavItemType } from 'types';

// constant
const icons = { IconKey, IconBug, IconCurrencyDollar };

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages: NavItemType = {
    id: 'pages',
    title: "Inputs",
    icon: icons.IconKey,
    type: 'group',
    children: [
        {
            id: 'template',
            title: 'Template',
            type: 'item',
            icon: IconForms,
            url: '/template'
        },
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
            id: 'cards',
            title: "Cards",
            type: 'item',
            icon: IconCards,
            url: '/cards'
        },
        {
            id: 'map_locations',
            title: "Map & Locations",
            type: 'item',
            icon: IconMap,
            url: '/map_location'
        }
    ]
};

export default pages;
