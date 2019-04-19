import React, { Component } from 'react';
import FridgeView from './fridgeview'

import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav'

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
      return <div> shop bitches </div>;
    } else if (view === "fridge"){
      return <FridgeView/>;
    } else if (view === "recipe"){
      return <div> recipe bitches </div>;
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
  render(){

    // const selectedNavIcon = {
    //   backgroundColor: '#a4de02',
    //   color: 'white'
    // };

    return(
      <Nav defaultActiveKey="/home" className="flex-column navBar">
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
                    className="sidebarNavLink">
            <FontAwesomeIcon className="icon" icon={['fas', 'door-closed']} size="3x" />
          </Nav.Link>
        </Nav.Item>

        <Nav.Item className="navIcon">
          <Nav.Link onClick = {() => this.props.onClick("recipe")}
                    eventKey="in_progress"
                    className="sidebarNavLink">
            <FontAwesomeIcon className="icon" icon={['fas', 'utensils']} size="3x" />
          </Nav.Link>
        </Nav.Item>
      </Nav>
    );
  }
}

export default App;
