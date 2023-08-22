import * as React from 'react';
import Typography from '@mui/material/Typography';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Box, ButtonBase, FormControlLabel, Switch, Tooltip } from '@mui/material';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';



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

export function isBefore4AMLastMonday(date: Date) {
    // Return true if past last monday at midnight in UTC
    const now = new Date();
    const dayOfWeek = now.getUTCDay();
    const daysSinceLastMonday = (dayOfWeek + 6) % 7;
    const lastMonday = new Date(now.getTime() - daysSinceLastMonday * 24 * 60 * 60 * 1000);
    lastMonday.setUTCHours(4, 0, 0, 0); // Midnight EDT
    return date.getTime() < lastMonday.getTime();
}

export function DailyGiftResetTime() {
    const [timeValue, setTimeValue] = React.useState({ hours: 0, minutes: 0, seconds: 0 })
    React.useEffect(() => {
        setTimeout(() => { setTimeValue(getTimeUntil4AM()) }, 500)
    })
    return (
        <div style={{ margin: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ margin: 'auto', display: 'flex', minWidth: '300px' }}>
                <AccessTimeIcon color="secondary" sx={{ margin: 'auto', marginRight: '.5rem', display: 'inline-block' }} />
                <Typography variant='h6' style={{ display: 'inline-block', margin: 'auto', marginLeft: 0, minWidth: '6rem' }}>
                    {formatTimeString(timeValue.hours)}:{formatTimeString(timeValue.minutes)}:{formatTimeString(timeValue.seconds)}
                </Typography>
            </div>
            <Typography variant='subtitle2' style={{ display: 'inline-block', margin: 'auto' }}>Daily Reset</Typography>
        </div>
    )
}

export function WeeklyGiftResetTime() {
    const [timeValue, setTimevalue] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    React.useEffect(() => {
        setTimeout(() => { setTimevalue(getTimeUntilNextMonday4AM()) }, 500)
    })
    
    const getDayText = () => {
        if (timeValue.days === 0) {
            return ''
        }
        return timeValue.days > 1 ? `${timeValue.days} days` : '1 day'
    }
    return (
        <div style={{ margin: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ margin: 'auto', display: 'flex', minWidth: '300px' }}>
                <CalendarMonthIcon color="secondary" sx={{ margin: 'auto', marginRight: '.5rem', display: 'inline-block' }} />
                <Typography variant='h6' style={{ display: 'inline-block', margin: 'auto', marginLeft: 0, minWidth: '10rem' }}>
                    {getDayText()}{' '}{formatTimeString(timeValue.hours)}:{formatTimeString(timeValue.minutes)}:{formatTimeString(timeValue.seconds)}
                </Typography>
            </div>
            <Typography variant='subtitle2' style={{ display: 'inline-block', margin: 'auto' }}>Weekly Reset</Typography>
        </div>
    )
}

export function isPast4AM(date: Date) {
    const now = new Date();
    const currentUTCDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 4, 0, 0, 0));

    return date > currentUTCDate;
}

export function PaliaClock() {
    const [timeValue, setTimeValue] = React.useState({ hours: 0, minutes: 0 })
    const [alarms, setAlarms]: [number[], Function] = React.useState([])
    const [gotLocalStorage, setGotLocalStorage]: [boolean, Function] = React.useState(false)
    React.useEffect(() => {
        setTimeout(() => { setTimeValue(getPaliaTime()) }, 500)
    })
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
        <Box style={{ margin: 'auto', flexDirection: 'row', minWidth: '100%' }} sx={{display:  {xs: 'none', sm: 'none', md: 'flex', lg: 'flex'}}}>
            <div style={{ margin: 'auto', marginLeft: 0, display: 'flex', marginRight: '1rem' }}>
                <AccessTimeIcon color="secondary" sx={{ margin: 'auto', marginRight: '.5rem', display: 'inline-block' }} />
                <Typography variant='h6' style={{ display: 'inline-block', margin: 'auto', marginRight: '0.5rem', minWidth: '3rem' }}>
                    {formatTimeString(timeValue.hours)}:{formatTimeString(timeValue.minutes)}
                </Typography>
                <Typography variant='h6' style={{ display: 'inline-block', margin: 'auto' }}>
                    (Palia Time)
                </Typography>
                
            </div>
            <div style={{ margin: 'auto', marginLeft: 0, display: 'flex', flexDirection: 'row' }}>
                <Tooltip style={{ display: 'flex' }} title="Plays an alarm at the given time in Palia. At 6AM crops grow in Palia and 6PM is a good time to give gifts since most people are in the village center.">
                    <ButtonBase style={{ margin: 'auto', display: 'flex' }}>
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
        </Box>
    )
}