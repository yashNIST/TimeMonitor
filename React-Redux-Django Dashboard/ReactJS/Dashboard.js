import { render } from "react-dom"
const React = require("react");
import {BrowserRouter, Switch, Route} from 'react-router'
import 'babel-polyfill';

import {
  createStore,
  compose,
  applyMiddleware,
  combineReducers,
} from "redux"
import { Provider } from "react-redux"
import thunk from "redux-thunk"

import DashboardContainer from "./containers/DashboardContainer"

import * as reducers from "./reducers/reducers"

let finalCreateStore = compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)
let reducer = combineReducers(reducers)
let store = finalCreateStore(reducer)

var Dashboard = React.createClass({

    /*
    loadAnnounce_MessagesFromServer(){
        $.ajax({
            url: this.props.url,
            datatype: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this)
        })
    },

    getInitialState: function() {
        return {data: []};
    },

    componentDidMount: function() {
        this.loadAnnounce_MessagesFromServer();
        setInterval(this.loadAnnounce_MessagesFromServer,
                    this.props.pollInterval)
    },
    */
    render(){

        return(

            <Provider store={store}>
                <DashboardContainer/>
            </Provider>
    )
    }

})

render(

    <Dashboard/>
  ,
    document.getElementById('Dashboard'));


  /*Dashboard.propTypes = {

  children: React.PropTypes.object.isRequired

};*/