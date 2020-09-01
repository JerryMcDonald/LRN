import React, { useEffect, useState } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Geocode from 'react-geocode';
import axios from 'axios';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import moment, { isBefore, isSameOrAfter } from 'moment';
import Navbar from './Navbar.jsx';

import '../styles/App.css';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#a58e57',
    },
    secondary: {
      main: '#474a2c',
      side: '#f6fef5',
    },
  },
});

function App() {
  const [user, setUser] = useState(null);
  const [binder, setBinder] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [regSessions, setRegSessions] = useState([]);
  const [notes, setNotes] = useState([]);

  // Retrieve all scheduled sessions
  useEffect(() => {
    axios.get('/event')
      .then(response => {
        // Put upcoming session in order by date and time.
        const sortedSessions = response.data.sort((a, b) => {
          const aMDY = a.date.split('/').join('-');
          const bMDY = b.date.split('/').join('-');
          const aUnix = moment(`${aMDY} ${a.time}`, 'MM-DD-YY HH:mm a').unix();
          const bUnix = moment(`${bMDY} ${b.time}`, 'MM-DD-YY HH:mm a').unix();
          return aUnix - bUnix;
        });

        setSessions(sortedSessions);
      });
  }, []);

  useEffect(() => {
    if (user) {
      axios.get(`users/${user.id}/binder`)
        .then(response => {
          setBinder(response.data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  });





  const googleLogin = () => {
    window.location.replace('http://localhost:8080/auth/login');
  };

  const googleLogout = () => {
    axios.get('auth/logout')
      .then(res => {
        setUser(null);
        window.location.reload(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div>
      <MuiThemeProvider theme={theme}>
        <Navbar googleLogin={googleLogin} googleLogout={googleLogout} user={user} binder={binder} sessions={sessions} regSessions={regSessions} notes={notes} />
        {/* <button onClick={googleLogin}>Log In</button> */}
        <Router>
          <div className="App" />
        </Router>
      </MuiThemeProvider>
    </div>
  );
}

export default App;
