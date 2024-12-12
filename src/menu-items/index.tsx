import headerItems from './header-items';
import pages from './pages';
import { NavItemType } from 'types';
import bottomItems from './bottom-items';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
    items: [headerItems, pages, bottomItems]
};

export default menuItems;
