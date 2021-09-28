import React, { useEffect, useState } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Layout from '../Layout';

import Home from '../../pages/Home';
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
        <div>

          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/about" component={Home} />
          </Switch>
          <Switch>
            <Route exact path="/rooms">
              <SocketContext.Provider value={socket}>
                {/* <RoomSelectionPage userId={userId} /> */}
                <Home />
              </SocketContext.Provider>
            </Route>
            <SocketContext.Provider value={socket}>
              <Route exact path="/rooms/:room">
                {/* <RoomsPage userId={userId} /> */}
                <Home />
              </Route>
              <Route exact path="/rooms/:room/:roomId">
                {/* <RoomsPage userId={userId} /> */}
                <Home />
              </Route>
            </SocketContext.Provider>
          </Switch>
        </div>
      </Router>

    </Layout>

  );
}
