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
import { SocketContext, socket } from './context/socketProvider';


export default function App() {
  // const [userId, setUserId] = useState('');
  // const [rooms, setRooms] = useState([]);

  // console.log('socket', socket)

  // useEffect(() => {
  //   socket.emit('rooms', (rooms) => {
  //     setRooms(rooms);
  //   });
  // }, []);
  return (
    <SocketContext.Provider value={socket}>
      < Layout>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />

            <Route exact path="/rooms">
              {/* <RoomSelection userId={userId} /> */}
            </Route>
            <Route exact path="/rooms/:room">
              {/* <Room userId={userId} /> */}
            </Route>
            <Route exact path="/rooms/:room/:roomId">
              {/* <Room userId={userId} /> */}
            </Route>

          </Switch>
        </Router>
      </Layout>
    </SocketContext.Provider>
  );
}
