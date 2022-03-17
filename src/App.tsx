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
import { PlayerGame, Game, Match, Player, Solver } from './schema';
import PsychologyIcon from '@mui/icons-material/Psychology';
import Autocomplete from '@mui/material/Autocomplete';
import { LabelList, LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, Cell, Tooltip, Legend, PieChart, Pie, } from 'recharts';


import {
  DataGrid,
  GridColumns,
  GridRowsProp,
  GridActionsCellItem,
  GridColDef,
  GridToolbar,
} from '@mui/x-data-grid';
import stc from 'string-to-color';



var API_HOST = "http://localhost:8080"
var COLLECTION_MATCHES = "matches-local"
var COLLECTION_SOLVERS = "solvers-local"
var INCLOUD = false
// API_HOST = "https://cloud-engine-dev-ouqu2q2ddq-uc.a.run.app"

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  // dev code
} else {
  // production code
  API_HOST = "https://api-ouqu2q2ddq-uw.a.run.app"
  COLLECTION_MATCHES = "matches"
  COLLECTION_SOLVERS = "solvers"
  // note this is not strictly named correctly. Just assume i'll never run from build locally.
  INCLOUD = true
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
          <Route path="match/:matchID/:playerID" element={<MatchView />} />
          <Route path="match/:matchID" element={<MatchView />} />
          <Route path="about" element={<About />} />
          <Route path="onboard" element={<Onboard />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </UserContext.Provider>
    </Box>
  );
}

// const defaultTarget = "https://schwordler-pv7fcrtjdq-uc.a.run.app"
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

      if (INCLOUD && uri.includes("localhost")) {
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

      navigate(`/match`)
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

// var stringToColour = function (str) {
//   var hash = 0;
//   for (var i = 0; i < str.length; i++) {
//     hash = str.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   var colour = '#';
//   for (var i = 0; i < 3; i++) {
//     var value = (hash >> (i * 8)) & 0xFF;
//     colour += ('00' + value.toString(16)).substr(-2);
//   }
//   return colour;
// }

interface JoinedGame {
  ID: string;
  Answer: string;
  PlayerGames: JoinedPlayerGame[];
  FastestPlayer: string;
  MostAccuratePlayer: string;
  BestAccuracy: number;
}

interface JoinedPlayerGame {
  PlayerName: string;
  Game: PlayerGame | undefined;
}

function MatchView() {
  let params = useParams();

  const [match, setMatch] = useState<Match | null>(null)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [data, setData] = useState<any[]>([])
  const [joinedGames, setJoinedGames] = useState<JoinedGame[]>([])
  const [pageSize, setPageSize] = useState<number>(10)
  const [fastestDistributions, setFastestDistributions] = useState<any[]>([])
  const [accuracyDistributions, setAccuracyDistributions] = useState<any[]>([])

  const { height, width } = useWindowDimensions();

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

  useEffect(() => {
    constructGraphView()
    joinGames()
  }, [match])

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

  function getErrors(params) {
    const player = params.row as Player
    if (player.GamesPlayed === null) {
      return 0
    }
    return player.GamesPlayed.filter((game) => game.Error !== "").length
  }

  function getAverage(params) {
    const player = params.row as Player
    if (player.GamesPlayed === null) {
      return 0
    }

    return player.GamesPlayed.reduce((a, b) => {
      if (b.GuessResults === null) {
        return a
      }

      if (!b.Correct || b.Error !== "") {
        return a + match.RoundsPerGame + 1

      }

      return a + b.GuessResults.length
    }, 0) / player.GamesPlayed.filter((game) => game.Error === "").length
  }

  function getTime(params) {
    const player = params.row as Player
    if (player.GamesPlayed === null) {
      return 0
    }
    return player.GamesPlayed.reduce((a, b) => {
      if (b.GuessDurationsNS === null) {
        return a + 0
      }
      return a + b.GuessDurationsNS.reduce((c, d) => c + d, 0)
    }, 0) / 1000000
  }
  // return player.Summary.TotalTime
  // }
  // ) / 1000000
  // return player.GamesPlayed.reduce((a, b) => a + b.GuessDurationsNS.reduce((c, d) => c + d, 0), 0) / 1000000

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
    return `${hours}:`.padStart(3, '0') + `${minutes}:`.padStart(3, '0') + `${seconds}:`.padStart(3, '0') + `${milliseconds}`.padStart(3, '0')
  }

  const columns: GridColDef[] = [
    { field: "fullName", headerName: 'Name', valueGetter: getName, width: 150, },
    { field: "gamesPlayed", headerName: 'Played', valueGetter: getPlayed, width: 100, },
    { field: "gamesCorrect", headerName: 'Correct', valueGetter: getCorrect, width: 100, },
    { field: "gamesErrored", headerName: 'Errors', valueGetter: getErrors, width: 100, },
    { field: "averageGuesses", headerName: 'Average Guesses', valueGetter: getAverage, width: 150 },
    { field: "totalTime", headerName: 'Total Time', valueGetter: getTime, valueFormatter: formatTime, width: 150 },
  ];

  function getTotalCorrect(params) {
    const joinedGame = params.row as JoinedGame
    return joinedGame.PlayerGames.filter((game) => game.Game.Correct).length
  }

  function getTotalErrored(params) {
    const joinedGame = params.row as JoinedGame
    return joinedGame.PlayerGames.filter((game) => game.Game.Error !== "").length
  }

  // function getFastest(params) {
  //   const joinedGame = params.row as JoinedGame

  //   return joinedGame.PlayerGames.reduce((prev, current) => prev.Game.GuessDurationsNS.reduce((a, b) => a + b, 0) >
  //     current.Game.GuessDurationsNS.reduce((a, b) => a + b, 0) ? prev : current).PlayerName
  // }

  // function getMostAccurate(params) {
  //   const joinedGame = params.row as JoinedGame
  //   let accuracies: number[] = joinedGame.PlayerGames.map(game => game.Game.GuessResults.length)

  //   // this is smooth brain. it's late.
  //   // need to give 'tie' as the answer if multiple players get the same result. the kicker is that it also needs to be the highest.
  //   let highestNumber = accuracies.reduce((a, b) => a < b ? a : b)
  //   let countHighestNumber = accuracies.filter(a => a === highestNumber)
  //   if (countHighestNumber.length > 1) {
  //     return "tie"
  //   }

  //   let highestBoi = accuracies.findIndex(a => a === highestNumber)
  //   if (highestBoi === -1) {
  //     return ""
  //   }

  //   return joinedGame.PlayerGames[highestBoi].PlayerName
  // }

  // function getBestScore(params) {
  //   const joinedGame = params.row as JoinedGame
  //   let accuracies: number[] = joinedGame.PlayerGames.map(game => game.Game.GuessResults.length)

  //   return accuracies.reduce((a, b) => a < b ? a : b)
  // }


  const gameColumns: GridColDef[] = [
    { field: "Answer", headerName: 'Answer', width: 150, },
    { field: "totalCorrect", headerName: 'Correct players', valueGetter: getTotalCorrect, width: 150, },
    { field: "totalErrors", headerName: 'Player Errors', valueGetter: getTotalErrored, width: 150, },
    { field: "FastestPlayer", headerName: 'Fastest', width: 150, },
    { field: "MostAccuratePlayer", headerName: 'Fewest Guesses', width: 150, },
    { field: "BestAccuracy", headerName: 'Best Guess Count', width: 150, },
    { field: "LoudestPlayer", headerName: 'Loudest', width: 150, },

  ];


  const constructGraphView = () => {
    if (match === null) {
      return
    }
    setData(Array.from({ length: match.RoundsPerGame + 1 }, (x, i) => i).map(i => {
      let guess: string | number = i + 1
      if (match.RoundsPerGame + 1 === i + 1) {
        guess = "failed"
      }
      const row = {
        guess: guess,
      }
      match.Players.forEach(player => {
        if (player.GamesPlayed === null) {
          return
        }
        row[player.Definition.Name] = player.GamesPlayed.filter(game => {
          // check for incorrect games and return as gamelength+1
          if (!game.Correct) {
            return match.RoundsPerGame + 1 === i + 1
          }
          // otherwise check number of guesses vs current position in graph
          return game.GuessResults.length === i + 1
        }
        ).length
      })
      return row
    })
    )
  }

  const joinGames = () => {
    if (match === null) {
      return
    }
    let joinedGames = match.Games.map(game => {

      let playerGames = match.Players.map(player => {
        let joinedPlayerGame: JoinedPlayerGame = {
          Game: player.GamesPlayed.find(loopGame => loopGame.GameID == game.ID),
          PlayerName: player.Definition.Name,
        }
        return joinedPlayerGame
      })

      let accuracies: number[] = playerGames.map(game => game.Game.GuessResults.length)
      let bestAccuracy = accuracies.reduce((a, b) => a < b ? a : b)
      // let playersWithBestAccuracy = accuracies.filter(a => a === bestAccuracy)
      let mostAccuratePlayers = playerGames.filter(game => game.Game.GuessResults.length === bestAccuracy)
      let mostAccuratePlayer = mostAccuratePlayers[0].PlayerName
      if (mostAccuratePlayers.length > 1) {
        mostAccuratePlayer = "tie"
      }
      let fastestPlayer = playerGames.reduce((prev, current) => prev.Game.GuessDurationsNS.reduce((a, b) => a + b, 0) >
        current.Game.GuessDurationsNS.reduce((a, b) => a + b, 0) ? prev : current).PlayerName

      let joinedGame: JoinedGame = {
        ID: game.ID,
        Answer: game.Answer,
        PlayerGames: playerGames,
        FastestPlayer: fastestPlayer,
        MostAccuratePlayer: mostAccuratePlayer,
        BestAccuracy: bestAccuracy,
      }



      return joinedGame
    })

    // get pie data
    let fastestDistributions = match.Players.map(player => ({
      name: player.Definition.Name,
      value: joinedGames.filter(game => game.FastestPlayer === player.Definition.Name).length
    }))

    let accuracyDistributions = match.Players.map(player => ({
      name: player.Definition.Name,
      value: joinedGames.filter(game => game.MostAccuratePlayer === player.Definition.Name).length
    }))

    setAccuracyDistributions(accuracyDistributions)
    setFastestDistributions(fastestDistributions)
    setJoinedGames(joinedGames)
  }

  if (!match) {
    return (
      <div>loading</div>
    )
  }

  console.log(width)
  console.log(data)
  console.log(joinedGames)
  console.log(fastestDistributions)
  console.log(accuracyDistributions)
  // const data = [
  //   { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
  //   { name: 'Page B', uv: 300, pv: 2400, amt: 2400 },
  //   { name: 'Page c', uv: 200, pv: 2400, amt: 2400 },
  //   { name: 'Page d', uv: 400, pv: 2400, amt: 2400 },
  // ];
  return (

    <Grid container
      justifyContent="center"
      direction="column"
      alignItems="center"
      padding={2}
      // spacing={2}
      sx={{
        width: '100%',
      }
      }
    >

      <Grid item xs={12} sx={{
        width: '100%',
      }} >

        <DataGrid
          rows={match.Players}
          columns={columns}
          disableColumnMenu={true}
          autoHeight
          hideFooter={true}
          getRowId={(row) => row.ID}
          onRowClick={(params) => setSelectedPlayer(params.row as Player)}
        />

      </Grid>
      <Divider />
      <Grid item xs={12} sx={{
        paddingTop: 3,
      }} >
        <BarChart
          width={width * .8}
          height={400}
          data={data}
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            left: 0,
            bottom: 5,
          }}
          barCategoryGap={3}
          barGap={0}
        >
          {/* <CartesianGrid strokeDasharray="3 10" /> */}
          <XAxis type="number" axisLine={false} tick={false} />
          <YAxis dataKey={'guess'} type="category" padding={{ top: 0, bottom: 0 }} minTickGap={0} tickLine={false} />
          <Tooltip />
          <Legend />
          {match.Players.map(player =>
            <Bar dataKey={player.Definition.Name} fill={stc(player.Definition.Description)} >
              {/* <LabelList dataKey={player.Definition.Name} position="right"
                style={{ fontSize: '50%', fill: '#3d3d3d' }} /> */}
            </Bar>
          )}
          {/* <Bar dataKey="b" fill="#82ca9d" /> */}
        </BarChart>

      </Grid>
      <Grid item xs={12}>
        <Grid container
          justifyContent="center"
          // direction="column"
          alignItems="center"
          textAlign={'center'}
        // padding={2}
        // spacing={2}
        // sx={{
        //   width: '100%',
        // }
        // }
        >
          <Grid item xs={6}>
            <PieChart width={width / 2.5} height={width / 2.5}>
              <Pie
                dataKey="value"
                isAnimationActive={false}
                data={accuracyDistributions}
                cx="50%"
                cy="50%"
                outerRadius={width / 10}
                fill="#8884d8"
                label
              >
                {accuracyDistributions.map((entry, index) =>
                  <Cell key={`cell-${index}`} fill={stc(match.Players[index].Definition.Description)} />
                )}
              </Pie>

              <Tooltip />
            </PieChart>
            Fastest

          </Grid>
          <Grid item xs={6}  >
            <PieChart width={width / 2.5} height={width / 2.5}>
              <Pie
                dataKey="value"
                isAnimationActive={false}
                data={fastestDistributions}
                cx="50%"
                cy="50%"
                outerRadius={width / 10}
                fill="#8884d8"
                label
              >
                {accuracyDistributions.map((entry, index) =>
                  <Cell key={`cell-${index}`} fill={stc(match.Players[index].Definition.Description)} />
                )}
              </Pie>

              <Tooltip />
            </PieChart>
            Fewest Guesses

          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{
        width: '100%',
        paddingTop: 3
      }} >


        <DataGrid
          rows={joinedGames}
          columns={gameColumns}
          autoHeight
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 25, 100]}
          pagination
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.ID}
          onRowClick={(params) => setSelectedPlayer(params.row as Player)}
        />

      </Grid>


    </Grid>


  )


}


function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

{/* <div>{selectedPlayer.Definition.Name}</div>
            <div>{selectedPlayer.Definition.Description}</div> */}

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
