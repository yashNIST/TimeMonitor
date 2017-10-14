const React = require("react");
import { render } from "react-dom"
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import 'babel-polyfill';
import './Dashboard.css'

import NavigationBar from "./Navbar"
import Announce_Message_Table from "./components/Announce_Message_Table"
import BMCA from "./components/BMCA"
import Holdover from  "./components/Holdover"
import LeapSecond from "./components/LeapSecond"
import ATOI from "./components/ATOI"
import MulticastMAC from "./components/MulticastMAC"
import RESTAPI from "./components/RESTAPI"

/*
import * as announceMessageActions from "./actions/announceMessageActions"
import announceTableContainer from "./containers/announceTableContainer"
import HoldoverContainer from "./containers/HoldoverContainer"


import {
  createStore,
  compose,
  applyMiddleware,
  combineReducers,
} from "redux"
import { Provider } from "react-redux"
import thunk from "redux-thunk"
import * as reducers from "./reducers/reducers"

let finalCreateStore = compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)
let reducer = combineReducers(reducers)
let store = finalCreateStore(reducer)

*/
let messageLimit = 1800;

var Dashboard = React.createClass({

    loadMessagesFromServer(){

        $.when(

            $.get("api/All_Announce_Messages", function (announcemessages){

                this.setState({
                    AnnounceMessages: ((announcemessages.length > messageLimit) ? announcemessages.slice(announcemessages.length - (messageLimit + 1), announcemessages.length -1): announcemessages),
                });

            }.bind(this)),

            $.get("api/All_PDelay_Messages", function (pdelaymessages){

                this.setState({
                    PDelayMessages: ((pdelaymessages > messageLimit) ? pdelaymessages.slice(pdelaymessages.length - (messageLimit + 1), pdelaymessages.length -1) : pdelaymessages),
                });
            }.bind(this))
        )

    },

    getInitialState() {

        return {AnnounceMessages: [], PDelayMessages: []};
    },

    componentDidMount() {

        var getMessages = function(){

            this.loadMessagesFromServer();
            setTimeout(getMessages, 500);

        }.bind(this);

        setTimeout(getMessages, 0);

    },

    render() {

        return (

                <Router>
                    <div>
                    <NavigationBar/>
                    <Switch>
                        <Route exact path={'/'} component={() => <Announce_Message_Table data={this.state.AnnounceMessages}/>}/>
                        <Route exact path={'/BMCA'} component={() => <BMCA data={this.state.AnnounceMessages[this.state.AnnounceMessages.length - 1]}/>}/>
                        <Route exact path={'/Holdover'} component={()=> <Holdover data={this.state.AnnounceMessages[this.state.AnnounceMessages.length - 1]}/>}/>
                        <Route exact path={'/LeapSecond'} component={() => <LeapSecond data={this.state.AnnounceMessages[this.state.AnnounceMessages.length - 1]}/>}/>
                        <Route exact path={'/ATOI'} component={() => <ATOI data={this.state.AnnounceMessages[this.state.AnnounceMessages.length - 1]}/>}/>
                        <Route exact path={'/MulticastMAC'} component={() => <MulticastMAC data={this.state.PDelayMessages[this.state.PDelayMessages.length - 1]}/>}/>
                        <Route exact path={'/RESTAPI'} component={RESTAPI}/>
                    </Switch>
                    </div>
                </Router>
        )
    }

});

 render(

    <Dashboard />
  ,
    document.getElementById('Dashboard'));


  /*

 render(

    <Provider store={store}>
    <Dashboard/>
    </Provider>
  ,
    document.getElementById('Dashboard'));



componentDidMount() {


        setInterval(function(){
            store.dispatch(announceMessageActions.fetchMessages())
        }, 1000)

        store.dispatch(announceMessageActions.fetchMessages())
    }
    Dashboard.propTypes = {

  children: React.PropTypes.object.isRequired

};*/

