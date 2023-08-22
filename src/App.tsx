import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Diversity1Icon from '@mui/icons-material/Diversity1';
import { Button, ButtonBase } from '@mui/material';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import DashboardIcon from '@mui/icons-material/Dashboard';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { DailyGiftResetTime, PaliaClock, WeeklyGiftResetTime } from './Components/TimeTrackers';
import { PaliaNpcGiftTracker } from './Components/GiftTracker';


function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '} {new Date().getFullYear()} {' '}
      <Link color="inherit" href="https://github.com/Frazl">
        Designed By Fraz {' '}
      </Link>{' '}. I am no way affiliated with Palia. This is a free website for assisting players.
      Palia, and any associated logos are trademarks, service marks, and/or registered trademarks of Singularity 6 Corporation.
      <Link color="inherit" href="https://github.com/Frazl/chapaachums">
        Available on GitHub
      </Link>
    </Typography>
  );
}

function HeaderMenu() {
  const itemSx = { fontFamily: 'Comfortaa, sans-serif', textDecoration: 'none', letterSpacing: '.1rem', color: 'inherit' }
  return (
    <AppBar position='sticky' sx={{ minWidth: '100%' }}>
      <Toolbar sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'column', md: 'row' }, maxWidth: '100vw' }}>
        <img src="/images/misc/chappa.png" alt="chappa" height="90" style={{ padding: '1rem' }} />
        <Typography
          variant="h4"
          noWrap
          component="a"
          href="/"
          sx={{
            mr: 2,
            display: { md: 'flex' },
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: '#BE723F',
            textDecoration: 'none',
            fontFamily: 'Chilanka, Cursive',
            marginTop: '.5rem',
          }}
        >
          Chapaa Chums
        </Typography>
        <Box sx={{ display: 'flex', margin: 'auto', flexDirection: { xs: 'column', sm: 'column', md: 'row' } }}>
          <Box sx={{ marginLeft: '2rem' }}>
            <ButtonBase
              component="a"
              href="/gifts">
              <Diversity1Icon color="secondary" sx={{ marginRight: '.5rem' }} />
              <Typography variant="subtitle1" sx={itemSx}>Gift Tracker</Typography>
            </ButtonBase>
          </Box>
          <Box sx={{ marginLeft: '2rem' }}>
            <ButtonBase
              component="a"
              href="/coming-soon">
              <DashboardIcon color="secondary" sx={{ marginRight: '.5rem' }} />
              <Typography variant="subtitle2" sx={itemSx}>Plot Simulator (Coming Soon)</Typography>
            </ButtonBase>
          </Box>
          <Box sx={{ marginLeft: '2rem' }}>
            <ButtonBase
              component="a"
              href="/coming-soon">
              <AgricultureIcon color="secondary" sx={{ marginRight: '.5rem' }} />
              <Typography variant="subtitle2" sx={itemSx}>Glow Worm Farm (Coming Soon)</Typography>
            </ButtonBase>
          </Box>
        </Box>
        <Button sx={{ marginLeft: 'auto' }} component='a' href="https://discord.gg/3dj8nQhaud" target="_blank">
          Join Chapaa Chums Discord!
          <img src="images/misc/chappa.png" style={{ height: '2rem', marginTop: '.2rem', paddingLeft: '1rem' }} alt="chum" />
        </Button>
      </Toolbar>
    </AppBar>
  )
}


function GiftTimers() {
  return (
    <Box sx={{ display: 'flex', marginBottom: '1rem', flexDirection: { xs: 'column', sm: 'column', md: 'row' } }}>
      <div style={{ margin: 'auto' }}>
        <Typography variant="h4" align='center'>Chapaa Chums</Typography>
        <Typography variant="h6" align='center'>Gift Tracker</Typography>
      </div>
      <DailyGiftResetTime />
      <WeeklyGiftResetTime />
    </Box>
  )
}

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element:
        <Container sx={{ padding: '2rem' }}>
          <GiftTimers />
          <PaliaNpcGiftTracker />
        </Container>,
    },
    {
      path: "/gifts",
      element:
        <Container sx={{ padding: '2rem' }}>
          <GiftTimers />
          <PaliaNpcGiftTracker />
        </Container>,
    },
    {
      path: "/coming-soon",
      element:
        <Container sx={{ padding: '2rem' }}>
          <Typography align="center" variant="h1">Coming Soon!</Typography>
        </Container>,
    }
  ]);
  return (
    <Container style={{ minWidth: '100%', minHeight: '100%' }}>
      <HeaderMenu />
      <div>
        <RouterProvider router={router} />
      </div>
        <Container color='primary' style={{position: 'fixed', width: '100%', minWidth: '100%', bottom: 0, backgroundColor: '#121212'}}>
          <PaliaClock />
        </Container>
      <Copyright />
    </Container>
  );
}