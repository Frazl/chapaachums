import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Diversity1Icon from '@mui/icons-material/Diversity1';
import { Button, ButtonBase, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, TextField, FormControlLabel, Tooltip, Switch } from '@mui/material';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { PaliaItem } from "./Data/items"
import { ALL_NPCS, NPC, NpcID } from './Data/npcs';


function getPaliaTime() {

  const realTimeMinutes = new Date().getUTCMinutes()
  const realTimeSeconds = new Date().getUTCSeconds()
  // 60 minutes = 1 full day 
  // 60 / 24 = 2.5 minutes / hour 
  // 2.5 minutes (150 seconds per hour)
  // 2.5 seconds per minute
  const seconds = (realTimeMinutes / 60) + realTimeSeconds
  const paliaHours = Math.floor(realTimeMinutes / 2.5);
  const paliaMinutes = Math.floor(seconds / 2.5) % 60;

  return {
    hours: paliaHours,
    minutes: paliaMinutes,
  };
}

interface PaliaClockProps {
  alarms?: number[]
}

function PaliaClock(props: PaliaClockProps) {
  const [timeValue, setTimeValue] = React.useState({ hours: 0, minutes: 0 })
  const [alarms, setAlarms]: [number[], Function] = React.useState([])
  const [gotLocalStorage, setGotLocalStorage]: [boolean, Function] = React.useState(false)
  setInterval(() => { setTimeValue(getPaliaTime()) }, 500)
  React.useEffect(() => {
    if (alarms !== undefined && alarms.includes(timeValue.hours) && timeValue.minutes < 5) {
      new Audio('./attention.mp3').play()
    }
  }, [alarms, timeValue.hours])
  React.useEffect(() => {
    if (localStorage.getItem("alarms")) {
      setAlarms(JSON.parse(localStorage.getItem("alarms") as string))
    }
    setGotLocalStorage(true)
  }, [gotLocalStorage])
  React.useEffect(() => {
    if (gotLocalStorage) {
      localStorage.setItem("alarms", JSON.stringify(alarms))
    }
  }, [alarms, gotLocalStorage])
  return (
    <div style={{ margin: 'auto', display: 'flex', flexDirection: 'row', minWidth: '100%' }}>
      <div style={{ margin: 'auto', marginLeft: 0, display: 'flex', marginRight: '1rem' }}>
        <AccessTimeIcon color="secondary" sx={{ margin: 'auto', marginRight: '.5rem', display: 'inline-block' }} />
        <Typography variant='h6' style={{ display: 'inline-block', margin: 'auto' }}>
          {formatTimeString(timeValue.hours)}:{formatTimeString(timeValue.minutes)} (Palia Time)
        </Typography>
      </div>
      <div style={{ margin: 'auto', marginLeft: 0, display: 'flex', flexDirection: 'row' }}>
        <Tooltip style={{ display: 'flex' }} title="Plays an alarm at the given time in Palia. At 6AM crops grow in Palia and 6PM is a good time to give gifts since most people are in the village center.">
          <ButtonBase style={{margin: 'auto', display: 'flex'}}>
          <Typography sx={{ display: 'flex', margin: 'auto', fontSize: '.7rem', }}>
            Enable Alarm <HelpOutlineRoundedIcon color="primary" style={{ height: '.9rem', margin: 'auto' }} />
            </Typography>
            </ButtonBase>
        </Tooltip>
        <FormControlLabel
          sx={{ margin: 'auto', marginLeft: 0 }}
          label={<Typography sx={{ margin: 'auto', fontSize: '.6rem', }}>06:00</Typography>}
          labelPlacement="end"
          control={
            <Switch
              size="small"
              checked={alarms.includes(6)}
              onChange={(e, checked) => { checked ? setAlarms([...alarms, 6]) : setAlarms(alarms.filter((alarm) => alarm !== 6)) }}
              color="primary"
            />
          }
        />
        <FormControlLabel
          label={<Typography sx={{ margin: 'auto', fontSize: '.6rem', }}>18:00</Typography>}
          sx={{ margin: 'auto', marginLeft: 0 }}
          control={
            <Switch
              size='small'
              checked={alarms.includes(18)}
              onChange={(e, checked) => { checked ? setAlarms([...alarms, 18]) : setAlarms(alarms.filter((alarm) => alarm !== 18)) }}
              color="primary"
            />
          }
        />
      </div>
    </div>
  )
}


function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '} {new Date().getFullYear()} {' '}
      <Link color="inherit" href="https://github.com/Frazl">
        Designed By Fraz {' '}
      </Link>{' '}. I am no way affiliated with Palia. This is a free website for assisting players.
      Palia, and any associated logos are trademarks, service marks, and/or registered trademarks of Singularity 6 Corporation.
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

type LastGifted = Record<string, Date>


// This is the time palia resets
function getTimeUntil4AM() {
  // Get user's current time and timezone
  const userTime = new Date();
  const userTimezoneOffset = userTime.getTimezoneOffset();

  const cstOffset = -360; // CST offset in minutes
  const cstTime = new Date(userTime.getTime() + (userTimezoneOffset + cstOffset) * 60 * 1000);

  const elevenPM = new Date(cstTime.getFullYear(), cstTime.getMonth(), cstTime.getDate(), 23, 0, 0, 0);
  const timeDifference = elevenPM.getTime() - cstTime.getTime();

  const hours = Math.floor(timeDifference / (60 * 60 * 1000));
  const minutes = Math.floor((timeDifference % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((timeDifference % (60 * 1000)) / 1000);

  return { hours, minutes, seconds }
}

function getTimeUntilNextMonday4AM() {
  const now = new Date();

  // Calculate the days until the next Monday
  let daysUntilMonday = 1 - now.getUTCDay();
  if (daysUntilMonday <= 0) {
    daysUntilMonday += 7;
  }

  // Calculate the date and time of the next Monday at midnight in UTC
  const nextMonday = new Date(now);
  nextMonday.setUTCDate(now.getUTCDate() + daysUntilMonday);
  nextMonday.setUTCHours(4, 0, 0, 0); // 4 AM UTC is midnight EDT

  // Calculate the time difference
  const utcOffsetMinutes = (new Date()).getTimezoneOffset();
  const utcOffsetMilliseconds = utcOffsetMinutes * 60 * 1000;
  const adjustedNow = new Date(now.getTime() + utcOffsetMilliseconds);

  const timeDifference = nextMonday.getTime() - adjustedNow.getTime();
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const millisecondsLeft = timeDifference % (1000 * 60 * 60 * 24);
  const hours = Math.floor(millisecondsLeft / (1000 * 60 * 60));
  const minutes = Math.floor((millisecondsLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((millisecondsLeft % (60 * 1000)) / 1000);

  return { days, hours, minutes, seconds }
}

function formatTimeString(time: number) {
  return time.toString().length === 1 ? '0' + time.toString() : time.toString()
}

function isBefore4AMLastMonday(date: Date) {
  // Return true if past last monday at midnight in UTC
  const now = new Date();
  const dayOfWeek = now.getUTCDay();
  const daysSinceLastMonday = (dayOfWeek + 6) % 7;
  const lastMonday = new Date(now.getTime() - daysSinceLastMonday * 24 * 60 * 60 * 1000);
  lastMonday.setUTCHours(4, 0, 0, 0); // Midnight EDT
  return date.getTime() < lastMonday.getTime();
}

function DailyGiftResetTime() {
  const [timeValue, setTimeValue] = React.useState({ hours: 0, minutes: 0, seconds: 0 })
  setInterval(() => { setTimeValue(getTimeUntil4AM()) }, 500)
  return (
    <div style={{ margin: 'auto', display: 'flex', flexDirection: 'column', minWidth: '30%' }}>
      <div style={{ margin: 'auto', display: 'flex' }}>
        <AccessTimeIcon color="secondary" sx={{ margin: 'auto', marginRight: '.5rem', display: 'inline-block' }} />
        <Typography variant='h6' style={{ display: 'inline-block', margin: 'auto' }}>
          {formatTimeString(timeValue.hours)}:{formatTimeString(timeValue.minutes)}:{formatTimeString(timeValue.seconds)}
        </Typography>
      </div>
      <Typography variant='subtitle2' style={{ display: 'inline-block', margin: 'auto' }}>Daily Reset</Typography>
    </div>
  )
}

function WeeklyGiftResetTime() {
  const [timeValue, setTimevalue] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  setInterval(() => { setTimevalue(getTimeUntilNextMonday4AM()) }, 500)
  const getDayText = () => {
    if (timeValue.days === 0) {
      return ''
    }
    return timeValue.days > 1 ? `${timeValue.days} days` : '1 day'
  }
  return (
    <div style={{ margin: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ margin: 'auto', display: 'flex' }}>
        <CalendarMonthIcon color="secondary" sx={{ margin: 'auto', marginRight: '.5rem', display: 'inline-block' }} />
        <Typography variant='h6' style={{ display: 'inline-block', margin: 'auto' }}>
          {getDayText()}{' '}{formatTimeString(timeValue.hours)}:{formatTimeString(timeValue.minutes)}:{formatTimeString(timeValue.seconds)}
        </Typography>
      </div>
      <Typography variant='subtitle2' style={{ display: 'inline-block', margin: 'auto' }}>Weekly Reset</Typography>
    </div>
  )
}

function isPast4AM(date: Date) {
  const now = new Date();
  const currentUTCDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 4, 0, 0, 0));

  return date > currentUTCDate;
}


type TrackedGifts = Record<NpcID, TrackedNPC>

interface TrackedNPC {
  daily: Date | undefined
  items: Record<string, Date | undefined>
}

interface TrackedGiftsSettings {
  filter: string
  incompletedFirst: boolean
  hideDailyCompleted: boolean
}


// Remove gifts passed the suitable date, yesterday for gifted today and all for weekly gifts!
function removeGiftsPastDates(trackedGifts: TrackedGifts) {
  const npcId = Object.keys(trackedGifts) as NpcID[]
  npcId.forEach((key: NpcID) => {
    if (trackedGifts[key].daily !== undefined) {
      // if daily gift is not past 4am today remove it
      if (!isPast4AM(trackedGifts[key].daily as Date)) {
        trackedGifts[key].daily = undefined
      }
    }
    const items = trackedGifts[key].items as Record<string, Date | undefined>
    const itemsNames = Object.keys(items) as string[]

    itemsNames.forEach((itemName: string) => {
      if (items[itemName] !== undefined) {
        // check if past 4AM last monday
        if (isBefore4AMLastMonday(items[itemName] as Date)) {
          items[itemName] = undefined
        }
      }
    })
  })
  return trackedGifts
}

function getDefaultNpcTrackedState() {
  const trackedGiftsDefaultState = {} as TrackedGifts
  ALL_NPCS.forEach((npc) => {
    trackedGiftsDefaultState[npc.name] = {
      daily: undefined,
      items: {}
    }
  })
  return trackedGiftsDefaultState

}

function PaliaNpcGiftTracker() {
  const [npcs, setNpcs] = React.useState([...ALL_NPCS])
  const [fetchedNpcLikes, setFetchWantedNpcLikes] = React.useState(false)
  const [trackedGifts, setTrackedGifts]: [TrackedGifts, Function] = React.useState(getDefaultNpcTrackedState());
  removeGiftsPastDates(trackedGifts)
  const [fetchedLocalStroage, setFetchedLocalStorage] = React.useState(false)

  const [tableFilter, setTableFilter] = React.useState("")
  const [hideCompleted, setHideCompleted] = React.useState(false)
  const [showIncompletedFirst, setShowIncompletedFirst] = React.useState(false)

  React.useEffect(() => {
    const maybeGifts = localStorage.getItem("gifts")
    if (maybeGifts) {
      let trackedGiftsParsed = JSON.parse(maybeGifts)
      npcs.forEach((npc) => {
        if (trackedGiftsParsed[npc.name].daily !== undefined) {
          trackedGiftsParsed[npc.name].daily = new Date(trackedGiftsParsed[npc.name].daily)
        }
        Object.keys(trackedGiftsParsed[npc.name].items).forEach((key) => {
          if (trackedGiftsParsed[npc.name].items[key] !== undefined) {
            trackedGiftsParsed[npc.name].items[key] = new Date(trackedGiftsParsed[npc.name].items[key])
          }
        })
      })
      setTrackedGifts(trackedGiftsParsed)
    }
    const maybeSettings = localStorage.getItem("giftsSettings")
    if (maybeSettings) {
      const settings = JSON.parse(maybeSettings) as TrackedGiftsSettings
      setTableFilter(settings.filter)
      setHideCompleted(settings.hideDailyCompleted)
      setShowIncompletedFirst(settings.incompletedFirst)
    }
    setFetchedLocalStorage(true)
  }, [fetchedLocalStroage])

  React.useEffect(() => {
    if (fetchedLocalStroage) {
      localStorage.setItem("gifts", JSON.stringify(trackedGifts))
    }
  }, [trackedGifts, fetchedLocalStroage])

  React.useEffect(() => {
    if (fetchedLocalStroage) {
      const trackedGiftsSettings: TrackedGiftsSettings = {
        filter: tableFilter,
        hideDailyCompleted: hideCompleted,
        incompletedFirst: showIncompletedFirst,
      }
      localStorage.setItem("giftsSettings", JSON.stringify(trackedGiftsSettings))
    }

  }, [tableFilter, hideCompleted, showIncompletedFirst, fetchedLocalStroage])

  React.useEffect(() => {

    const sheetId = '1_ESG0vd1V_rNmS7EyLEDp5DOtTXIxPskzqxQbPlPa2g';
    const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
    const sheetName = 'CurrentWeek';
    const query = encodeURIComponent('Select *')
    const url = `${base}&sheet=${sheetName}&tq=${query}`
    if (!fetchedNpcLikes) {
      fetch(url).then((resp) => resp.text()).then((text) => {
        const results = JSON.parse(text.substring(47).slice(0, -2))
        const newNpcs = ALL_NPCS.map((npc) => { return ({ ...npc }) })
        const tableRows = results.table.rows
        for (let i = 1; i < tableRows.length; i++) {
          let npc = newNpcs.find((npc) => npc.name.toLowerCase() === tableRows[i]['c'][0]['v'].toLowerCase()) as NPC
          const likes: PaliaItem[] = tableRows[i]['c'][1]['v'].split(",").map((s: string) => { return ({ name: s.trim() }) })
          const loves: PaliaItem[] = tableRows[i]['c'][3]['v'].split(",").map((s: string) => { return ({ name: s.trim() }) })
          npc.likes = npc.likes.concat(likes)
          npc.loves = npc.loves.concat(loves)
        }
        setFetchWantedNpcLikes(true)
        setNpcs(newNpcs)
      })
    }
  }, [fetchedNpcLikes, npcs])
  let filteredNpcs = npcs
  if (tableFilter.trim() !== "") {
    filteredNpcs = filteredNpcs.filter((npc) => npc.likes.some((like) => like.name.toLowerCase().includes(tableFilter.toLowerCase())) || npc.loves.some((love) => love.name.toLowerCase().includes(tableFilter.toLowerCase())) || npc.name.toLowerCase().includes(tableFilter.toLowerCase()))
  }
  if (hideCompleted) {
    filteredNpcs = filteredNpcs.filter((npc) => trackedGifts[npc.name] === undefined || trackedGifts[npc.name]['daily'] === undefined)
  }
  if (showIncompletedFirst) {
    filteredNpcs = filteredNpcs.sort((a, b) => {
      const aValue = trackedGifts[a.name] !== undefined && trackedGifts[a.name]['daily'] !== undefined ? 1 : 0
      const bValue = trackedGifts[b.name] !== undefined && trackedGifts[b.name]['daily'] !== undefined ? 1 : 0
      return aValue - bValue
    })
  } else {
    filteredNpcs = filteredNpcs.sort((a, b) => {
      return a.name < b.name ? -1 : 1
    })
  }

  return (
    <Container>
      <Box>
        <div style={{ display: 'flex' }}>
          <Typography sx={{ padding: '1em', paddingRight: 0, width: '80%' }}>
            Click the gifted checkbox everyday after you gift, it will reset itself when you can gift next. Similarly click the weekly gifts if that is what you have gifted an NPC. It will reset with the weekly reset.
            If you don't know how to get an item click the location icon and it will bring you to the Palia wiki! Everything saves in browser (device) storage, so feel free to leave and come back!
          </Typography>
          <img src="https://i.gifer.com/3zAU.gif" alt="gift boxes" style={{ margin: 'auto', marginLeft: 0, maxWidth: '20%', maxHeight: '10em' }} />
        </div>
        <Box style={{ display: 'flex', flexDirection: 'column', padding: '1em' }}>
          <div style={{ display: "flex", marginTop: '1rem' }}>
            <TextField
              id=""
              label="Filter by NPC or item"
              value={tableFilter}
              size='small'
              onChange={(e) => { setTableFilter(e.target.value) }}
              style={{ margin: 'auto', marginLeft: 0, minWidth: '42%' }}
            />
          </div>
          <div>
            <FormControlLabel
              label="Hide Daily Completed"
              style={{ margin: 'auto' }}
              control={
                <Checkbox
                  value=""
                  checked={hideCompleted}
                  onChange={(e, checked) => { setHideCompleted(checked) }}
                  color="primary"
                />
              }
            />
            <FormControlLabel
              label="Show Incompleted First"
              style={{ margin: 'auto' }}
              control={
                <Checkbox
                  value=""
                  checked={showIncompletedFirst}
                  onChange={(e, checked) => { setShowIncompletedFirst(checked) }}
                  color="primary"
                />
              }
            />
          </div>
        </Box>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Gifted Today</TableCell>
            <TableCell>NPC</TableCell>
            <TableCell>Likes</TableCell>
            <TableCell>Loves</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredNpcs.map((npc: NPC) => <PaliaSingleNpcTableRow key={npc.name} npc={npc} trackedGifts={trackedGifts} setTrackedGifts={setTrackedGifts} />)}
        </TableBody>
      </Table>
    </Container>
  )
}

interface PaliaSingleNpcTableRowProps {
  npc: NPC
  trackedGifts: TrackedGifts
  setTrackedGifts: Function
}

function PaliaSingleNpcTableRow(props: PaliaSingleNpcTableRowProps) {
  const tableCellStyling = { color: 'white', fontFamily: 'Comfortaa, sans-serif', padding: 0, }
  const setGiftedToday = (value: Date | undefined) => {
    const trackedGifts = { ...props.trackedGifts }
    trackedGifts[props.npc.name]['daily'] = value
    props.setTrackedGifts({ ...trackedGifts })
  }
  const setTrackedGiftItem = (itemName: string, value: Date | undefined) => {
    const trackedGifts = { ...props.trackedGifts }
    trackedGifts[props.npc.name]['items'] = { ...trackedGifts[props.npc.name]['items'] }
    trackedGifts[props.npc.name]['items'][itemName] = value
    props.setTrackedGifts({ ...trackedGifts })
  }

  return (
    <TableRow sx={{ color: 'white' }} key={props.npc.name}>
      <TableCell sx={tableCellStyling}>
        <Checkbox
          title='Gifted'
          checked={props.trackedGifts[props.npc.name] !== undefined && props.trackedGifts[props.npc.name]['daily'] !== undefined}
          onChange={(e, checked) => { checked ? setGiftedToday(new Date()) : setGiftedToday(undefined) }} />
        Gifted
      </TableCell>
      <TableCell sx={tableCellStyling}>
        <div style={{ display: 'flex' }}>
          <img style={{ width: '40px' }} src={'/images/npc/' + props.npc.name.toLowerCase() + '.png'} alt={props.npc.name} />
          <Typography sx={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: '1.2rem' }}>{props.npc.name}</Typography>
        </div>

      </TableCell>
      <TableCell sx={tableCellStyling}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {props.npc.likes.map((item, idx) => <NpcGiftTracker key={idx} item={item} setTrackedGiftItem={setTrackedGiftItem} date={props.trackedGifts[props.npc.name].items[item.name]} />)}
        </div>
      </TableCell>
      <TableCell sx={tableCellStyling}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {props.npc.loves.map((item, idx) => <NpcGiftTracker key={idx} item={item} setTrackedGiftItem={setTrackedGiftItem} date={props.trackedGifts[props.npc.name].items[item.name]} />)}
        </div>
      </TableCell>
    </TableRow>
  )
}

interface NpcGiftTrackerProps {
  item: PaliaItem,
  date: Date | undefined
  setTrackedGiftItem: Function
}
function NpcGiftTracker(props: NpcGiftTrackerProps) {
  return (
    <Box sx={{ display: 'flex' }}>
      <FormControlLabel
        style={{ color: 'white' }}
        label={props.item.name}
        control={
          <Checkbox
            size='small'
            value={props.date !== undefined}
            checked={props.date !== undefined}
            onChange={(e, checked) => props.setTrackedGiftItem(props.item.name, checked ? new Date() : undefined)}
            color="primary"
          />
        }
      />
      <ButtonBase sx={{ margin: 'auto', marginRight: '2em' }} component='a' href={"https://palia.wiki.gg/index.php?search=" + props.item.name}>
        <NotListedLocationIcon sx={{ margin: 'auto', marginLeft: 'auto', marginRight: 0 }} color='secondary' />
      </ButtonBase>
    </Box>
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