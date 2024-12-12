// This is example of menu item without group for horizontal layout. There will be no children.

// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconBrandChrome, IconDashboard, IconNotebook, IconSettings, IconUsersGroup } from '@tabler/icons-react';

// type
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS - SAMPLE PAGE ||============================== //

const headerItems: NavItemType = {
    id: 'header-items',
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: "Dashboard",
            icon: IconDashboard,
            type: 'item',
            url: '/dashboard'
        },
        {
            id: 'study-manager',
            title: "Gestão de estudos",
            icon: IconNotebook,
            type: 'item',
            url: '/study-manager'
        },
        {
            id: 'registers',
            title: "Cadastros",
            icon: IconUsersGroup,
            type: 'collapse',
        },
        {
            id: 'settings',
            title: "Configuração",
            icon: IconSettings,
            type: 'collapse',
        }
    ]
};

export default headerItems;
