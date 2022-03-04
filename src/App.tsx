import CodeIcon from '@mui/icons-material/Code';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LoginIcon from '@mui/icons-material/Login';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { AuthProvider, GithubAuthProvider, GoogleAuthProvider, onAuthStateChanged, signInWithRedirect, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { GithubLoginButton, GoogleLoginButton } from "react-social-login-buttons";
import { auth, firestore } from "./index";

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

const UserContext = React.createContext<User | null>(null);

function App() {

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  // const value = useContext(UserContext);

  onAuthStateChanged(auth, (user) => {
    console.log("user:", user)
    setUser(user)

    // if (user) {
    //   // User is signed in, see docs for a list of available properties
    //   // https://firebase.google.com/docs/reference/js/firebase.User
    //   const uid = user.uid;
    //   console.log(user)
    //   // ...
    // } else {
    //   // User is signed out
    //   // ...
    // }
  });

  const unsub = onSnapshot(doc(firestore, "matches", "54a681e7-da7b-4bee-9295-d975f052e12c"), (doc) => {
    console.log("Current data: ", doc.data());
  });

  useEffect(() => {
    return unsub
  })

  const logOut = () => {
    auth.signOut()
  }

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
            onClick={() => setDrawerOpen(true)}
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
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <List>
          <ListItem button key={"match"} component={Link} to="" onClick={() => { setDrawerOpen(false) }}>
            <ListItemIcon>
              <SportsScoreIcon />
            </ListItemIcon>
            <ListItemText primary={"match"} />
          </ListItem>
          <ListItem button key={"about"} component={Link} to="/about" onClick={() => { setDrawerOpen(false) }}>
            <ListItemIcon>
              <HelpOutlineIcon />
            </ListItemIcon>
            <ListItemText primary={"about"} />
          </ListItem>
          <ListItem button key={"about"} component={Link} to="/about" onClick={() => { setDrawerOpen(false) }}>
            <ListItemIcon>
              <CodeIcon />
            </ListItemIcon>
            <ListItemText primary={"source"} />
          </ListItem>
        </List>
        <Divider />
        {user ?
          <List>
            <ListItem button key={"logout"} onClick={logOut}>
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary={"logout"} />
            </ListItem>
          </List> :
          <List>
            <ListItem button key={"login"} component={Link} to="/login" onClick={() => { setDrawerOpen(false) }}>
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary={"login"} />
            </ListItem>
          </List>
        }

      </Drawer>
      <UserContext.Provider value={user}>
        <Routes>
          <Route path="/" element={<Match />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </UserContext.Provider>




      {/* <DataGrid rows={rows} columns={columns} /> */}
    </Box>
  );
}

function Match() {
  return (
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
  )
}

function About() {
  return (
    <div>wordle is cool right now.</div>
  )
}



function Login() {

  const user = useContext(UserContext);
  const navigate = useNavigate();


  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  const login = (provider: AuthProvider) => {
    signInWithRedirect(auth, provider)
      .then((result) => {
        console.log(result)
      }).catch((error) => {
        console.log(error)
      });
  }


  if (user) {
    console.log("yeet", user)
    navigate("/")
  }


  return (
    <Grid sx={{ flexGrow: 1 }} container spacing={2}>
      <Grid item xs={12}>
        <Grid container justifyContent="center" spacing={2} padding={2}>
          <Grid item >
            <Box
              sx={{
                height: 140,
                width: 300,
              }}
            >
              <GoogleLoginButton onClick={() => login(googleProvider)} />
              <GithubLoginButton onClick={() => login(githubProvider)} />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )

}

export default App;
