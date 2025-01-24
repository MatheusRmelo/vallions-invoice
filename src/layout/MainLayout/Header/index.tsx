// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import { Box, IconButton } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import useConfig from 'hooks/useConfig';
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import MobileSection from './MobileSection';
import ProfileSection from './ProfileSection';
import LocalizationSection from './LocalizationSection';
import MegaMenuSection from './MegaMenuSection';
import FullScreenSection from './FullScreenSection';
import NotificationSection from './NotificationSection';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// assets
import { IconMenu2 } from '@tabler/icons-react';

// types
import { MenuOrientation, ThemeMode } from 'types/config';
import { DarkModeOutlined, LightMode, LightModeOutlined, MarkUnreadChatAlt, MarkUnreadChatAltOutlined } from '@mui/icons-material';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = () => {
    const theme = useTheme();
    const downMD = useMediaQuery(theme.breakpoints.down('md'));

    const { mode, menuOrientation, onChangeMode } = useConfig();
    const { menuMaster } = useGetMenuMaster();
    const drawerOpen = menuMaster.isDashboardDrawerOpened;
    const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downMD;

    return (
        <>
            {/* logo & toggler button */}
            <Box sx={{ width: downMD ? 'auto' : 228, display: 'flex', alignItems: 'center' }}>
                <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
                    <LogoSection />
                </Box>
                {!isHorizontal && (
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            overflow: 'hidden',
                            transition: 'all .2s ease-in-out',
                            bgcolor: mode === ThemeMode.DARK ? 'dark.main' : 'secondary.light',
                            color: mode === ThemeMode.DARK ? 'secondary.main' : 'secondary.dark',
                            '&:hover': {
                                bgcolor: mode === ThemeMode.DARK ? 'secondary.main' : 'secondary.dark',
                                color: mode === ThemeMode.DARK ? 'secondary.light' : 'secondary.light'
                            }
                        }}
                        onClick={() => handlerDrawerOpen(!drawerOpen)}
                        color="inherit"
                    >
                        <IconMenu2 stroke={1.5} size="20px" />
                    </Avatar>
                )}
            </Box>

            {/* header search */}
            <SearchSection />
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ flexGrow: 1 }} />

            {/* mega-menu */}
            {/* <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <MegaMenuSection />
            </Box> */}

            {/* live customization & localization */}
            {/* <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <LocalizationSection />
            </Box> */}

            {/* notification */}
            {/* <NotificationSection /> */}

            {/* full sceen toggler */}
            {/* <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
                <FullScreenSection />
            </Box> */}

            <IconButton style={{ background: '#FFF8E1', borderRadius: '8px' }}>
                <MarkUnreadChatAltOutlined style={{ color: '#FFC107' }} />
            </IconButton>

            <IconButton style={{ background: '#EDE7F6', borderRadius: '8px', marginLeft: '24px' }}
                onClick={() => { onChangeMode(mode == ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK) }}>
                {
                    mode == ThemeMode.DARK ?
                        <DarkModeOutlined style={{ color: '#673AB7' }} />
                        : <LightModeOutlined style={{ color: '#673AB7' }} />
                }
            </IconButton>

            {/* profile */}
            <ProfileSection />

            {/* mobile header */}
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                <MobileSection />
            </Box>
        </>
    );
};

export default Header;
