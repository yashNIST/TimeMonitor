/**
 * Created by kgb on 9/13/17.
 */
const React = require("react");
const ReactRouter = require("react-router");
import { createHashHistory } from 'history'
const browserHistory = createHashHistory();
import {Link, Switch, BrowserRouter, Route} from 'react-router-dom';
import Radium from "radium"

import {connect} from "react-redux"

import * as announceMessageActions from "../actions/announceMessageActions"
import Announce_Message_Table from "../components/Announce_Message_Table"
import BMCA from "../components/BMCA"
import Holdover from "../components/Holdover"
import LeapSecond from "../components/LeapSecond"
import ATOI from "../components/ATOI"
import NavigationBar from "../Navbar"

@connect(state => ({

    announce_messages: state.announce_messages,

    }

))
export default class DashboardContainer extends React.Component{


    componentDidMount() {
        let {dispatch, announce_messages} = this.props
        if (!announce_messages.isLoadingAnnounceMessages && announce_messages.data === undefined) {
            dispatch(announceMessageActions.fetchMessages())
        }

    }

    renderLoading() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            Loading...
          </div>
        </div>
      </div>
    )
  }
  render(){

        let {announce_messages} = this.props
        /*if (announce_messages.isLoadingAnnounceMessages || announce_messages.announce_messages === undefined) {
           return this.renderLoading()
        }*/
        return(

            <div>
            <NavigationBar/>
            </div>


        )
  }



}


/*

 <BrowserRouter>
                    <div>
                    <Navbar />
                    <Switch>
                        <Route exactly component= {BMCA} pattern="/BMCA" />
                        <Route exactly component= {Holdover} pattern="/Holdover" />
                        <Route exactly component= {LeapSecond} pattern="/LeapSecond" />
                        <Route exactly component= {ATOI} pattern="/ATOI" />
                    </Switch>
                    </div>
                </BrowserRouter>

{announce_messages.data !== undefined &&
              <Announce_Message_Table data={announce_messages.data} />}
                */