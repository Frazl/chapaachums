import { createTheme } from '@mui/material/styles';
import { grey, red } from '@mui/material/colors';

// A custom theme for this app
const theme = createTheme({
  palette: {
    text: {
        primary: grey[100],
        secondary: grey[400],
      },
    primary: {
      main: '#647C66',
    },
    secondary: {
      main: '#ADC0A3',
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      'Comfortaa', 
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(",")
  }
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    secondary: {
      main: '#F89D5E'
    },
    primary: {
      main: '#E1CBBA'
    }
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      'Comfortaa', 
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(",")
  }
});

export default darkTheme;