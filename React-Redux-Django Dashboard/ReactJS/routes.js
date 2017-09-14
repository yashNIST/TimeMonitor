/**
 * Created by kgb on 9/14/17.
 */
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import DashboardContainer from "./containers/DashboardContainer"
import Announce_Message_Table from "./components/Announce_Message_Table"
import BMCA from "./components/BMCA"
import Holdover from "./components/Holdover"
import LeapSecond from "./components/LeapSecond"
import ATOI from "./components/ATOI"
import Dashboard from "./Dashboard"
import Navbar from "./Navbar"



export default(

     <Route exact = {true} path="/" component={ Dashboard }>
        <IndexRoute component={Announce_Message_Table} />
         <Route exact = {true} path="/BMCA" component={BMCA} />
         <Route exact = {true} path="/Holdover" component={Holdover} />
         <Route exact = {true} path="/LeapSecond" component={LeapSecond} />
         <Route exact = {true} path="/ATOI" component={ATOI} />
     </Route>

);