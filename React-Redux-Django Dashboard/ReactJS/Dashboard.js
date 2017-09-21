import { render } from "react-dom"
const React = require("react");
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import 'babel-polyfill';

import NavigationBar from "./Navbar"
import Announce_Message_Table from "./components/Announce_Message_Table"
import BMCA from "./components/BMCA"
import Holdover from  "./components/Holdover"
import LeapSecond from "./components/LeapSecond"
import ATOI from "./components/ATOI"
import MulticastMAC from "./components/MulticastMAC"

import * as announceMessageActions from "./actions/announceMessageActions"
import announceTableContainer from "./containers/announceTableContainer"
import HoldoverContainer from "./containers/HoldoverContainer"
/*
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

var Dashboard = React.createClass({

    loadAnnounce_MessagesFromServer(){

        $.ajax({
            url: "All_Announce_Messages",
            datatype: 'json',
            cache: false,
            success: function(announcemessages) {
                this.setState({
                    AnnounceMessages: announcemessages,
                });
            }.bind(this)
        })
    },

    loadPDelay_MessagesFromServer(){

        $.ajax({
            url: "All_PDelay_Messages",
            datatype: 'json',
            cache: false,
            success: function(pdelaymessages) {
                this.setState({
                    PDelayMessages: pdelaymessages,
                });
            }.bind(this)
        })
    },

    getInitialState() {
        return {AnnounceMessages: [], PDelayMessages: []};
    },

    componentDidMount() {

        //this.loadAnnounce_MessagesFromServer();
        //this.loadPDelay_MessagesFromServer();
        setInterval(this.loadAnnounce_MessagesFromServer, 1000);
        setInterval(this.loadPDelay_MessagesFromServer, 1000);

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
                    </Switch>
                    </div>
                </Router>
        )
    }

})

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
