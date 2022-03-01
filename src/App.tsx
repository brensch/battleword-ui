import React from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import TextField from '@mui/material/TextField';
import { alpha, styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';


const rows: GridRowsProp = [
  { id: 1, col1: 'Player 1', col2: '3/10', col3: '69s', col4: '4.2', col5: '100%' },
  { id: 2, col1: 'Player 2', col2: '9/10', col3: '69s', col4: '4.2', col5: '100%' },
  { id: 3, col1: 'Player 3', col2: '6/8', col3: '69s', col4: '4.2', col5: '80%' },
];

const columns: GridColDef[] = [
  { field: 'col1', headerName: 'Player', flex: 1, },
  { field: 'col2', headerName: 'Won', width: 150 },
  { field: 'col3', headerName: 'Time', flex: 1, },
  { field: 'col4', headerName: 'Average Guesses', flex: 1, },
  { field: 'col5', headerName: 'Percent Complete', flex: 1, },
];

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#ffffff',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#ffffff',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#424242',
      color: "#ffffff"
    },
    '&:hover fieldset': {
      borderColor: '#ffffff',
      color: "#ffffff"

    },
    '&.Mui-focused fieldset': {
      borderColor: '#ffffff',
      color: "#ffffff"

    },
  },
});

function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={0} sx={{
        borderBottom: 1,
        borderColor: "#424242",
      }}>
        <Toolbar>
          <IconButton
            color="secondary"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{
            flexGrow: 1,
            textAlign: "center",
            fontFamily: 'Helvetica',
            fontSize: '150%',
            letterSpacing: '3px'
          }}>
            BATTLEWORD
          </Typography>
          <IconButton
            color="secondary"
            aria-label="settings"
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{

        display: "flex",
        flexDirection: "row",
        justifyContent: "center",


      }}>

        <Grid container maxWidth="xl" >
          <Grid item md={4} xs={12}>
            <Grid container spacing={2} padding={2}>
              <Grid item xs={12}>
                <CssTextField id="outlined-basic" label="Player 1" variant="outlined" fullWidth={true} />
              </Grid>
              <Grid item xs={12}>
                <CssTextField id="outlined-basic" label="Player 2" variant="outlined" fullWidth={true} />
              </Grid>
              <Grid item xs={12}>
                <CssTextField id="outlined-basic" label="Player 3" variant="outlined" fullWidth={true} />
              </Grid>
              <Grid item xs={12}>
                <CssTextField id="outlined-basic" label="Player 4" variant="outlined" fullWidth={true} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={8} xs={12} spacing={2} padding={2} style={{ flexGrow: 1 }}>

            <DataGrid
              rows={rows}
              columns={columns}
              disableColumnMenu={true}
              disableSelectionOnClick={true}
              autoHeight
            />
          </Grid>
        </Grid>

      </Box>



      {/* <DataGrid rows={rows} columns={columns} /> */}
    </Box>
  );
}

export default App;
