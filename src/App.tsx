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
import FormControl from '@mui/material/FormControl';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertProps } from '@mui/material/Alert';
// import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { AuthProvider, GithubAuthProvider, GoogleAuthProvider, onAuthStateChanged, signInWithRedirect, User } from "firebase/auth";
import { collection, doc, getDocs, onSnapshot, query } from "firebase/firestore";
import React, { useContext, useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { GithubLoginButton, GoogleLoginButton } from "react-social-login-buttons";
import { auth, firestore } from "./index";
import Button from '@mui/material/Button';
import { Match, Player, Solver } from './schema';
import PsychologyIcon from '@mui/icons-material/Psychology';
import Autocomplete from '@mui/material/Autocomplete';

import {
  DataGrid,
  GridColumns,
  GridRowsProp,
  GridActionsCellItem,
  GridColDef
} from '@mui/x-data-grid';



var API_HOST = "http://localhost:8080"
var COLLECTION_MATCHES = "matches-local"
var COLLECTION_SOLVERS = "solvers-local"
// API_HOST = "https://cloud-engine-dev-ouqu2q2ddq-uc.a.run.app"

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  // dev code
} else {
  // production code
  API_HOST = "https://cloud-engine-dev-ouqu2q2ddq-uc.a.run.app"
  COLLECTION_MATCHES = "matches"
  COLLECTION_SOLVERS = "solvers"
}



const UserContext = React.createContext<User | null>(null);

function App() {

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  // const value = useContext(UserContext);

  onAuthStateChanged(auth, (user) => {
    // console.log("user:", user)
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
          <ListItem button key={"match"} component={Link} to="/match" onClick={() => { setDrawerOpen(false) }}>
            <ListItemIcon>
              <SportsScoreIcon />
            </ListItemIcon>
            <ListItemText primary={"match"} />
          </ListItem>
          <ListItem button key={"add solver"} component={Link} to="/onboard" onClick={() => { setDrawerOpen(false) }}>
            <ListItemIcon>
              <PsychologyIcon />
            </ListItemIcon>
            <ListItemText primary={"add solver"} />
          </ListItem>
          <ListItem button key={"about"} component={Link} to="/about" onClick={() => { setDrawerOpen(false) }}>
            <ListItemIcon>
              <HelpOutlineIcon />
            </ListItemIcon>
            <ListItemText primary={"about"} />
          </ListItem>
          <ListItem button key={"about"} onClick={() => { window.open('https://github.com/brensch/battleword-cloud-engine', '_blank'); }}>
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
          <Route path="/" element={<StartMatch />} />
          <Route path="match" element={<StartMatch />} />
          <Route path="match/:matchID" element={<MatchView />} />
          <Route path="about" element={<About />} />
          <Route path="onboard" element={<Onboard />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </UserContext.Provider>
    </Box>
  );
}

const defaultTarget = "https://schwordler-pv7fcrtjdq-uc.a.run.app"
// const defaultTarget = "http://localhost:8081"

function StartMatch() {

  const [error, setError] = useState<string | null>(null)
  const [errorOpen, setErrorOpen] = useState<boolean>(false)
  const [gameCount, setGameCount] = useState<number | string>("")
  const [solvers, setSolvers] = useState<Solver[]>([])
  const [selectedSolvers, setSelectedSolvers] = useState<Solver[]>([])

  const q = query(collection(firestore, COLLECTION_SOLVERS));

  useEffect(() => {

    const unsub = onSnapshot(q, (querySnapshot) => {
      const newSolvers = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.data())
        // solvers.push(doc.data().name);
        newSolvers.push(doc.data() as Solver)
      });
      setSolvers(newSolvers)
      // console.log("solvers ", solvers.join(", "));
    });
    return unsub
  }, [])

  let navigate = useNavigate()


  const showAlert = (alert: string) => {
    setError(alert)
    setErrorOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault()

    try {

      if (selectedSolvers.length === 0) {
        throw ("need to select a player")
      }

      if (gameCount === "") {
        throw ("please enter a gamecount")
      }

      if (gameCount < 0 || gameCount > 100) {
        throw ("gamecount needs to be great than 0 and less than 100")

      }

      const res = await fetch(`${API_HOST}/api/match`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
          letters: 5,
          games: gameCount,
          players: selectedSolvers.map((solver) => solver.URI),
        })
      })

      const body = await res.json()

      if (res.status != 200) {
        throw (body.error)
      }

      navigate(`/match/${body.uuid}`)
    } catch (error) {
      console.log(error.toString())
      showAlert(error.toString())
    }
  }

  console.log(solvers)
  // const senders: string[] = ["yeah", "boy", "yeah1", "b2oy", "yeah3", "b4oy"]


  return (

    <React.Fragment>
      <form key={"start-match-form"} onSubmit={handleSubmit}>
        <Grid container spacing={2}
          justifyContent="center"
          direction="column"
          alignItems="center"
          padding={2}>
          <Grid item xs={12}>

            <Autocomplete
              multiple
              id="tags-outlined"
              options={solvers}
              getOptionLabel={(solver: Solver) => solver.Definition.Name}
              onChange={(_, solvers: Solver[]) => setSelectedSolvers(solvers)}
              value={selectedSolvers}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Solvers"
                  placeholder="Type to search"

                />
              )}
              sx={{
                width: 300,
              }}
            />
          </Grid>
          {/* {players.map((_, i) =>
            <Grid key={`input-${i}`} item xs={12}>
              <TextField
                id={`player-${i}`}
                label={`Player ${i + 1}`}
                onChange={(e) => updatePlayer(i, e.target.value)}
                // setting value locks it up for some reason
                defaultValue={i === 0 ? defaultTarget : ""}
                variant="outlined"
                fullWidth={true}
                sx={{
                  width: 300,
                  height: 56,
                }}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <IconButton
              color="secondary"
              aria-label="menu"
              onClick={addPlayer}
            >
              <AddIcon />
            </IconButton>
            {players.length > 1 &&
              <IconButton
                color="secondary"
                aria-label="menu"
                onClick={removePlayer}
              >
                <RemoveIcon />
              </IconButton>
            }
          </Grid> */}
          <Grid item xs={12}>

            <TextField
              id={`game-count`}
              label={`How many games?`}
              type="number"
              value={gameCount}
              onChange={(e) => {
                const count = parseInt(e.target.value)
                if (isNaN(count)) {
                  setGameCount("")
                  return
                }
                setGameCount(count)

              }}
              variant="outlined"
              fullWidth={true}
              sx={{
                width: 300,
                height: 56,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="outlined"
              disableElevation
              sx={{
                width: 300,
                height: 56,
              }}
            >
              Start match
            </Button>
          </Grid>

        </Grid>
      </form >
      <Snackbar open={errorOpen} autoHideDuration={6000} onClose={() => { setErrorOpen(false) }}>
        <Alert onClose={() => { setErrorOpen(false) }} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </React.Fragment>
  )
}


function Onboard() {

  const [uri, setUri] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [errorOpen, setErrorOpen] = useState<boolean>(false)

  let navigate = useNavigate()

  const showAlert = (alert: string) => {
    setError(alert)
    setErrorOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault()

    try {

      if (uri === "") {
        throw ("please enter a gamecount")
      }

      if (uri.includes("localhost")) {
        throw ("I'm running in the cloud, I can't reach your localhost no matter how hard I try. Try hosting your API online.")
      }

      const res = await fetch(`${API_HOST}/api/solver`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
          uri: uri,
        })
      })

      const body = await res.json()

      if (res.status != 200) {
        throw (body.error)
      }

      navigate(`/match/${body.uuid}`)
    } catch (error) {
      console.log(error.toString())
      showAlert(error.toString())
    }
  }



  return (

    <React.Fragment>
      <form key={"start-match-form"} onSubmit={handleSubmit}>
        <Grid container spacing={2}
          justifyContent="center"
          direction="column"
          alignItems="center"
          padding={2}>
          <Grid key={`input-uri`} item xs={12}>
            <TextField
              id={`player-uri`}
              label={`Enter the solver URL`}
              onChange={(e) => setUri(e.target.value)}
              value={uri}
              variant="outlined"
              fullWidth={true}
              sx={{
                width: 300,
                height: 56,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="outlined"
              disableElevation
              sx={{
                width: 300,
                height: 56,
              }}
            >
              Register your solver
            </Button>
          </Grid>
        </Grid>
      </form >
      <Snackbar open={errorOpen} autoHideDuration={6000} onClose={() => { setErrorOpen(false) }}>
        <Alert onClose={() => { setErrorOpen(false) }} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </React.Fragment>

  )


}

function MatchView() {
  let params = useParams();

  const [match, setMatch] = useState<Match | null>(null)


  useEffect(() => {
    const unsub = onSnapshot(
      doc(firestore, COLLECTION_MATCHES, params.matchID), (doc) => {
        setMatch(doc.data() as Match)
      },
      // (error) => { console.log(error) },
      // () => { console.log("finished yo") },
    );
    return unsub
  }, [])

  console.log(match)

  function getName(params) {
    const player = params.row as Player
    return player.Definition.Name
  }

  function getPlayed(params) {
    const player = params.row as Player
    if (player.GamesPlayed === null) {
      return 0
    }
    return player.GamesPlayed.length
  }

  function getCorrect(params) {
    const player = params.row as Player
    if (player.GamesPlayed === null) {
      return 0
    }
    return player.GamesPlayed.filter((game) => game.Correct).length
  }

  function getAverage(params) {
    const player = params.row as Player
    if (player.GamesPlayed === null) {
      return 0
    }
    return player.GamesPlayed.reduce((a, b) => a + b.GuessResults.length, 0) / player.GamesPlayed.length
  }

  function getTime(params) {
    const player = params.row as Player
    if (player.GamesPlayed === null) {
      return 0
    }
    return player.GamesPlayed.reduce((a, b) => a + b.GuessDurationsNS.reduce((c, d) => c + d, 0), 0) / 1000000
    // return player.Summary.TotalTime
  }

  function formatTime(params) {
    // console.log(params)
    const millis = params.value
    // var milliseconds = millis % 1000;
    // var seconds = Math.floor((millis / 1000) % 60);
    // var minutes = Math.floor((millis / (60 * 1000)) % 60);

    // return minutes + ":" + seconds + "." + milliseconds;    // const player = params.row as Player
    // return player.Summary.TotalTime
    let time = new Date(millis);
    let hours = time.getUTCHours();
    let minutes = time.getUTCMinutes();
    let seconds = time.getUTCSeconds();
    let milliseconds = time.getUTCMilliseconds();
    return hours + ":" + minutes + ":" + seconds + ":" + milliseconds;
  }

  const columns: GridColDef[] = [
    { field: "fullName", headerName: 'Name', valueGetter: getName, width: 150, },
    { field: "gamesPlayed", headerName: 'Played', valueGetter: getPlayed, width: 100, },
    { field: "gamesCorrect", headerName: 'Correct', valueGetter: getCorrect, width: 100, },
    { field: "averageGuesses", headerName: 'Average Guesses', valueGetter: getAverage, width: 150 },
    { field: "totalTime", headerName: 'Total Time', valueGetter: getTime, valueFormatter: formatTime, width: 150 },
  ];



  return (
    <Grid container
      justifyContent="center"
      // direction="column"
      alignItems="center"
      padding={2}
      sx={{
        width: '100%',
      }}
    >

      <Grid item xs={12} sx={{
        width: '100%',
      }} >

        {match ?
          <DataGrid
            rows={match.Players}
            columns={columns}
            disableColumnMenu={true}
            autoHeight
            hideFooter={true}
            getRowId={(row) => row.ID}
          />
          :
          <div>loading</div>}
      </Grid>
    </Grid>
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
