/**
 * Created by kgb on 9/14/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory } from 'react-router'
import Announce_Message_Table from './Announce_Message_Table'

const Root = ({ store }) => (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/(:filter)" component={Announce_Message_Table} />
    </Router>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired
}

export default Root