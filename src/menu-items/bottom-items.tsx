// This is example of menu item without group for horizontal layout. There will be no children.

// assets
import { IconChartArcs, IconMap } from '@tabler/icons-react';

// type
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS - SAMPLE PAGE ||============================== //

const bottomItems: NavItemType = {
    id: 'bottom-items',
    type: 'group',
    children: [
        {
            id: 'charts',
            title: "Charts",
            icon: IconChartArcs,
            type: 'item',
            url: '/charts'
        },
        {
            id: 'disabled-menu',
            title: "Disabled Menu",
            icon: IconMap,
            type: 'item',
            url: '/disabled-menu'
        }
    ]

}

export default bottomItems;
