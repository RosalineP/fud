import React, { Component } from 'react';
import axios from "axios";

import blueberry from './blueberries.svg'

import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPlus, faEdit, faCheck} from '@fortawesome/free-solid-svg-icons'
import {faSquare, faCheckSquare} from '@fortawesome/free-regular-svg-icons'
library.add(faPlus, faEdit, faSquare, faCheckSquare, faCheck)



class FridgeView extends Component{
  constructor(props){
    super(props);
    this.state = {compartmentSelection: "fridge"};
  }


  render(){
    return(
      <div className="fridgeCompartmentView">
        <FridgeButtonGroup/>
        <FoodContainer />
      </div>
    );
  }
}

class FridgeButtonGroup extends Component{
  render(){
    return(
          <ButtonGroup size="lg" aria-label="compartment navigation" className="fridgeButtonGroup">
            <Button bsPrefix="fridgeBtnGroup fridgeBtnGroupLeft"
                    onClick={() => this.setState({compartmentSelection: "freezer"})}> freezer</Button>
            <Button bsPrefix="fridgeBtnGroup fridgeBtnGroupMiddle"
                    onClick={() => this.setState({compartmentSelection: "fridge"})}> fridge </Button>
            <Button bsPrefix="fridgeBtnGroup fridgeBtnGroupRight"
                    onClick={() => this.setState({compartmentSelection: "pantry"})}> pantry</Button>
            <FontAwesomeIcon className="icon fridgeAddIcon" icon='plus' size="lg" />
          </ButtonGroup>);
  }
}

class FoodContainer extends Component{
  render(){
    return(
      <div className="fridgeTable">
        <div className="ftRow ftHeader">
          <div className="ftCell checkmarkCell"> <FontAwesomeIcon className="icon" icon='check' size="lg"/> </div>
          <div className="ftCell iconCell"> &nbsp; </div>
          <div className="ftCell nameCell"> name </div>
          <div className="ftCell expiryCell"> expiry </div>
          <div className="ftCell quantityCell"> quantity </div>
          <div className="ftCell unitCell"> unit </div>
        </div>
        <FoodRow/>
      </div>
    );
  }
}


class FoodRow extends Component{
  constructor(props){
    super(props);
    this.state = {name: "",
                  expiry: "",
                  quantity: "",
                  unit: ""};
    }
  render(){
    return( <div className="ftRow">
              <div className="ftCell checkmarkCell"> <FontAwesomeIcon className="icon" icon={['far', 'square']} size="lg"/> </div>
              <div className="ftCell iconCell"> <img className="foodIcon" src={blueberry} alt="food icon" /> </div>
              <div className="ftCell nameCell"> blueberries </div>
              <div className="ftCell expiryCell"> 3/18/19 </div>
              <div className="ftCell quantityCell"> 1 </div>
              <div className="ftCell unitCell"> box </div>
            </div>);
  }
}


export default FridgeView;
