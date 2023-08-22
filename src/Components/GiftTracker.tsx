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
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { PaliaItem } from "../Data/items"
import { ALL_NPCS, NPC, NpcID } from '../Data/npcs';
import { DailyGiftResetTime, isBefore4AMLastMonday, isPast4AM, PaliaClock, WeeklyGiftResetTime } from './TimeTrackers';

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

export function PaliaNpcGiftTracker() {
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