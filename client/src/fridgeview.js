import React, { Component } from 'react';
import axios from "axios";

import blueberry from './blueberries.svg'

import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
// import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Form from 'react-bootstrap/Form'

import Popover, { ArrowContainer } from 'react-tiny-popover'

import DayPicker from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

import Select from 'react-select';

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
        <FridgeButtonGroup selection={this.state.compartmentSelection}
                           onClickButton={(newSelection) => this.setState({compartmentSelection: newSelection})}/>
        <FoodTable />
      </div>
    );
  }
}

class FridgeButtonGroup extends Component{
  constructor(props){
    super(props);
    this.state = {isPopOverOpen: true};
  }

  render(){
    let selectedButtonStyle = {backgroundColor: '#a4de02', color: 'white'}
    let selection = this.props.selection

    return(
          <ButtonGroup size="lg" aria-label="compartment navigation" className="fridgeButtonGroup noHighlight">
            <Button bsPrefix="greenButton fridgeBtnGroupLeft"
                    style={selection === "freezer" ? selectedButtonStyle : {display : ''}}
                    onClick={() => this.props.onClickButton("freezer")}> freezer</Button>
            <Button bsPrefix="greenButton fridgeBtnGroupMiddle"
                    style={selection === "fridge" ? selectedButtonStyle : {display : ''}}
                    onClick={() => this.props.onClickButton("fridge")}> fridge </Button>
            <Button bsPrefix="greenButton fridgeBtnGroupRight"
                    style={selection === "pantry" ? selectedButtonStyle : {display : ''}}
                    onClick={() => this.props.onClickButton("pantry")}> pantry </Button>

            <FontAwesomeIcon onClick={() => this.setState({isPopOverOpen: !this.state.isPopOverOpen})}
                             className="icon fridgeAddIcon" icon='plus' size="lg" />
            {this.state.isPopOverOpen && <AddFood/>}

          </ButtonGroup>);
  }
}

class AddFood extends Component{
  constructor(props){
    super(props);
    this.state = {nameField: "",
                  expiryField: "",
                  selectedOptionCompartment: null,
                  quantityField: "",
                  selectedOptionUnit: null,
                  priceField: "",

                  nameField: "",
                  expiryField: "",
                  selectedOptionCompartment: null,
                  quantityField: "",
                  selectedOptionUnit: null,
                  priceField: "",
                };
    this.handleChangeTextField = this.handleChangeTextField.bind(this);
  }

  handleChangeTextField(event, stateName){
    this.setState({[stateName]: event.target.value})
  }
  handleChangeCompartment = (selectedOptionCompartment) => {
    this.setState({ selectedOptionCompartment });
    // console.log(`Option selected:`, selectedOptionCompartment);
  }
  handleChangeUnits = (selectedOptionUnit) => {
    this.setState({ selectedOptionUnit });
    // console.log(`Option selected:`, selectedOptionUnit);
  }


  validateAddFoodFields(){

  }

  addFoodToDB(e){
    var self = this;
    let arr = [self.state.nameField,
               self.state.expiryField,
               self.state.selectedOptionCompartment.value]
    console.log(arr);


  }

  render(){
    const { selectedOptionCompartment } = this.state;
    const { selectedOptionUnit } = this.state;

    const optionsCompartment = [
      { value: 'freezer', label: 'freezer' },
      { value: 'fridge', label: 'fridge' },
      { value: 'pantry', label: 'pantry' }
    ];

    const optionsUnit = [
      { value: 'oz', label: 'oz' },
      { value: 'g', label: 'g' },
      { value: 'cup', label: 'cup' },
      { value: 'package', label: 'package' }
    ];

    const styleFocus = {
      input: base => ({
        ...base,
        color: "#808080"
      }),
      singleValue: base => ({
        ...base,
        color: "#808080"
      }),
      control: (base, state) => ({
        ...base,
        border: state.isFocused ? 0 : 0,
        // This line disable the blue border
        boxShadow: state.isFocused ? 0 : 0,
        "&:hover": {
          border: state.isFocused ? 0 : 0
        }
      })
    };
    return(
      <div className="popOverContent">

        <input type="text"
               value={this.state.nameField}
               onChange={(e) => this.handleChangeTextField(e, "nameField")}
               className="popOverField"
               placeholder=" name "/>

        <input type="text"
               value={this.state.expiryField}
               onChange={(e) => this.handleChangeTextField(e, "expiryField")}
               className="popOverField"
               placeholder=" expiry "/>

        <Select
          className="popOverField popOverSelect"
          value={selectedOptionCompartment}
          onChange={this.handleChangeCompartment}
          options={optionsCompartment}
          styles={styleFocus}
          placeholder="compartment"
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
            ...theme.colors,
              primary25: '#A0C778',
              primary: '#FED833',
            },
          })}
        />

        <div className="optional">
          - optional -
        </div>

        <div>
          <input type="text"
                 value={this.state.quantityField}
                 onChange={(e) => this.handleChangeTextField(e, "quantityField")}
                 className="popOverField popOverQuantitiesText"
                 placeholder=" quantity "/>

          <Select
            className="popOverField popOverQuantitySelect"
            value={selectedOptionUnit}
            onChange={this.handleChangeUnits}
            options={optionsUnit}
            styles={styleFocus}
            placeholder="unit"
            theme={(theme) => ({
              ...theme,
              borderRadius: 0,
              colors: {
              ...theme.colors,
                primary25: '#A0C778',
                primary: '#FED833',
              },
            })}
          />
        </div>

        <input type="text"
               value={this.state.priceField}
               onChange={(e) => this.handleChangeTextField(e, "priceField")}
               className="popOverField"
               placeholder=" price (optional) "/>

        <Button bsPrefix="popOverSubmitButton" onClick={(e) => this.addFoodToDB(e)}> submit </Button>

      </div>
    );
  }
}



class FoodTable extends Component{
  render(){
    return(
      <div className="fridgeTable noHighlight">
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
    this.state = {checked: true,
                  name: "",
                  expiry: "",
                  quantity: "",
                  unit: ""
                };
    }

  render(){
    let checkBox;
    if (this.state.checked){
      checkBox = <FontAwesomeIcon className="icon" icon={['far', 'check-square']} size="lg"/>;
    } else {
      checkBox = <FontAwesomeIcon className="icon" icon={['far', 'square']} size="lg"/>;
    }

    return( <div className="ftRow">
              <div className="ftCell checkmarkCell" onClick={() => this.setState({checked: !this.state.checked})}> {checkBox} </div>
              <div className="ftCell iconCell"> <img className="foodIcon" src={blueberry} alt="food icon" /> </div>
              <div className="ftCell nameCell"> blueberries </div>
              <div className="ftCell expiryCell"> 3/18/19 </div>
              <div className="ftCell quantityCell"> 1 </div>
              <div className="ftCell unitCell"> box </div>
            </div>
            );
  }
}


export default FridgeView;
