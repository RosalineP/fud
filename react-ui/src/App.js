import React, { Component, useCallback, useEffect, useState } from 'react';
import FridgeView from './fridgeview'

import 'bootstrap/dist/css/bootstrap.min.css';
// import Nav from 'react-bootstrap/Nav'
// import Button from 'react-bootstrap/Button'
import { Button, Nav} from 'react-bootstrap';

import logo from './logo.svg';
import greenFridge from './fridge-green.svg'
import whiteFridge from './fridge-white.svg'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faShoppingBasket, faDoorClosed, faUtensils} from '@fortawesome/free-solid-svg-icons'
library.add(faShoppingBasket, faDoorClosed, faUtensils)



class App extends Component{
  constructor(props){
    super(props);
    this.state = {rightPanelView: "fridge"};
  }

  setView(view){
    if (view === "shop"){
      return <div className="placeholder"> Füd's Shöp section is coming soon! </div>;
    } else if (view === "fridge"){
      return <FridgeView/>;
    } else if (view === "recipe"){
      return <div className="placeholder"> Füd's Rëcipe section is coming soon! </div>;
    }
  }

  render(){
    return(<div>
            <SideNav onClick={(view) => this.setState({rightPanelView: view})} view={this.state.rightPanelView}/>
            {this.setView(this.state.rightPanelView)}
          </div>);
  }
}

class SideNav extends Component{
  constructor(props){
    super(props);
    this.state = {fridgeIcon: greenFridge};
  }

  render(){
    return(
      <div className="leftPanel">
        <Nav defaultActiveKey="/home" className="navBar">
          <Nav.Item className="umlaut">
                ü
          </Nav.Item>

          <Nav.Item   className="navIcon">
            <Nav.Link onClick = {() => this.props.onClick("shop")}
                      className="sidebarNavLink">
              <FontAwesomeIcon className="icon" icon={['fas', 'shopping-basket']} size="3x" />
            </Nav.Link>
          </Nav.Item>

          <Nav.Item className="navIcon">
            <Nav.Link onClick = {() => this.props.onClick("fridge")}
                      className="noPadding"
                      onMouseOver={e => (this.setState({fridgeIcon: whiteFridge}))}
                      onMouseOut= {e => (this.setState({fridgeIcon: greenFridge}))}>
              <img className="fridgeIcon"
                   src={ this.state.fridgeIcon }
                   alt="fridge icon" />
            </Nav.Link>
          </Nav.Item>

          <Nav.Item className="navIcon">
            <Nav.Link onClick = {() => this.props.onClick("recipe")}
                      eventKey="in_progress"
                      className="sidebarNavLink">

              <FontAwesomeIcon className="icon" icon={['fas', 'utensils']} size="3x" />
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Button bsPrefix="greenButton loginout" onClick={() => alert("todo")}> log out</Button>
          </Nav.Item>

        </Nav>
      </div>
    );
  }
}

function App1() {
  const [message, setMessage] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [url, setUrl] = useState('/api');

  const fetchData = useCallback(() => {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        setMessage(json.message);
        setIsFetching(false);
      }).catch(e => {
        setMessage(`API call failed: ${e}`);
        setIsFetching(false);
      })
  }, [url]);

  useEffect(() => {
    setIsFetching(true);
    fetchData();
  }, [fetchData]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        { process.env.NODE_ENV === 'production' ?
            <p>
              This is a production build from create-react-app.
            </p>
          : <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
        }
        <p>{'« '}<strong>
          {isFetching
            ? 'Fetching message from API'
            : message}
        </strong>{' »'}</p>
        <p><a
          className="App-link"
          href="https://github.com/mars/heroku-cra-node"
        >
          React + Node deployment on Heroku
        </a></p>
        <p><a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a></p>
      </header>
    </div>
  );

}

export default App;
