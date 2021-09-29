import React, { useEffect, useState } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Layout from '../Layout';

import Home from '../../pages/Home';
import RoomSelection from '../../pages/RoomSelection';
import Room from '../../pages/Room';
import Socket from '../Socket';
import { SocketContext, socket } from './context/socketProvider';


export default function App() {
  const [userId, setUserId] = useState('');

  useEffect(() => {
    socket.on('set userId', (userId) => {
      setUserId(userId);
    });
  }, []);
  return (
    < Layout>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
        <Switch>
          <Route exact path="/rooms">
            <SocketContext.Provider value={socket}>
              <Socket />
              <RoomSelection userId={userId} />
            </SocketContext.Provider>
          </Route>
          <SocketContext.Provider value={socket}>
            <Route exact path="/rooms/:room">
              <Room userId={userId} />
            </Route>
            <Route exact path="/rooms/:room/:roomId">
              <Room userId={userId} />
            </Route>
          </SocketContext.Provider>
        </Switch>
      </Router>
    </Layout>
  );
}
