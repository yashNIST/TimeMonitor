/**
 * Created by kgb on 9/13/17.
 */

const React = require("react");
import { FilterLink } from "./containers/FilterLink"

const ReactBootstrap = require('react-bootstrap');
let Navbar = ReactBootstrap.Navbar;
let NavItem = ReactBootstrap.NavItem;
let Nav = ReactBootstrap.Nav;
let NavDropdown = ReactBootstrap.NavDropdown;
let FormGroup = ReactBootstrap.FormGroup;
let FormControl = ReactBootstrap.FormControl;

export default class NavigationBar extends React.Component{

    render() {

        return (

            <Navbar inverse collapseOnSelect>
           <Navbar.Header>
            <Navbar.Brand>
              <a href="#">Timing Testbed Dashboard</a>
            </Navbar.Brand>
           <Navbar.Toggle />
           </Navbar.Header>
           <Navbar.Collapse>
            <Nav pullLeft>
              <NavDropdown title="Announce Message Tests" id="Announce Dropdown">
                  <NavItem onClick={() => <FilterLink to="/BMCA"/>}>BMCA</NavItem>
                  <NavItem href="#">Holdover</NavItem>
                  <NavItem href="#">Leap Second</NavItem>
                  <NavItem href="#">ATOI</NavItem>
              </NavDropdown>
              <NavDropdown title="Path Delay Request Message Tests" id="Path Dropdown">
                <NavItem href="#">Multicast MAC Address</NavItem>
              </NavDropdown>
              <NavDropdown title="Rest API" id="REST Dropdown">
                <NavItem href="/All_Announce_Messages/">All Announce Messages</NavItem>
                  <NavItem href="#">Individual Announce Messages</NavItem>
              </NavDropdown>
            </Nav>
               <Navbar.Form pullRight>
                    <FormGroup>
                        <FormControl type="text" placeholder="Search"/>
                    </FormGroup>
                </Navbar.Form>
          </Navbar.Collapse>
        </Navbar>


            )
        }

    }

/*


            <nav className="navbar navbar-inverse">

                <div className="container-fluid">

                    <div className="navbar-header">

                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#topNavBar">

                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>

                        </button>
                        <p className="navbar-brand"><ReactRouterDOM.Link to="/" activeClassName="active">Timing Testbed Dashboard</ReactRouterDOM.Link></p>
                    </div>
                    <div className="collapse navbar-collapse" id="topNavBar">
                        <ul className="nav navbar-nav">
                            <li className="active"></li>
                            <li className="dropdown">

                                <a className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
                                   aria-expanded="false">Announce Message Tests<span className="caret"></span></a>
                                   <ul className="dropdown-menu">
                                       <li><ReactRouterDOM.Link to="/BMCA" activeClassName="active">BMCA</ReactRouterDOM.Link></li>
                                       <li><ReactRouterDOM.Link to="/Holdover" activeClassName="active">Holdover</ReactRouterDOM.Link></li>
                                       <li><ReactRouterDOM.Link to="/LeapSecond" activeClassName="active">Leap Second</ReactRouterDOM.Link></li>
                                       <li><ReactRouterDOM.Link to="/ATOI" activeClassName="active">ATOI</ReactRouterDOM.Link></li>
                                    </ul>

                            </li>
                            <li className="dropdown">

                                <a className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
                                   aria-expanded="false" href="#">Path Delay Request Message Tests<span className="caret"></span></a>
                                <ul className="dropdown-menu">

                                    <li><a onClick={()=>history.push('/MulticastMAC')}>Multicast MAC Address</a></li>
                                </ul>

                            </li>
                            <li className="dropdown">

                                <a className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
                                   aria-expanded="false" href="#">REST API<span className="caret"></span></a>
                                <ul className="dropdown-menu">

                                    <li><a href="http://127.0.0.1:8000/All_Announce_Messages/">All Announce Messages</a>
                                    </li>
                                    <li><a href="http://127.0.0.1:8000/Individual_Announce_Messages/(?P<pk>[0-9]+)/">Individual
                                        Announce Messages</a></li>
                                </ul>

                            </li>

                        </ul>
                        <form className="navbar-form navbar-left">

                            <div className="form-group">

                                <input type="text" className="form-control" name="q" value=""/>

                            </div>
                            <button type="submit" className="btn btn-default">Search</button>

                        </form>

                    </div>

                </div>

            </nav>

 */