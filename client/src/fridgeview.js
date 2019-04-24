import React, { Component } from 'react';
import axios from "axios";

import blueberry from './blueberries.svg'

import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
// import Popover from 'react-bootstrap/Popover'
// import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
// import Form from 'react-bootstrap/Form'

// import Popover, { ArrowContainer } from 'react-tiny-popover'

// import DayPicker from 'react-day-picker';
// import DayPickerInput from 'react-day-picker/DayPickerInput';
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
    this.state = {isPopOverOpen: false};
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

                  nameFieldWarning: "",
                  expiryFieldWarning: "",
                  selectedOptionCompartmentWarning: null,
                  quantityFieldWarning: "",
                  priceFieldWarning: "",
                  anyWarnings: false
                };
    this.handleChangeTextField = this.handleChangeTextField.bind(this);
  }

  addFoodToDB(e){
    if (this.validateAddFoodFields()){
      var self = this;
      axios.post("http://localhost:3001/api/addFood", {
        name: self.state.nameField,
        expiry: self.state.expiryField,
        compartment: self.state.selectedOptionCompartment.value
      })
      .then(function (response){
        console.log("card closes")
        console.log(response)
      });
    }
  }

  handleChangeTextField(event, stateName){
    this.setState({[stateName]: event.target.value})
    // console.log(this.state);
  }
  handleChangeCompartment = (selectedOptionCompartment) => {
    this.setState({ selectedOptionCompartment });
    // console.log(`Option selected:`, selectedOptionCompartment);
  }
  handleChangeUnits = (selectedOptionUnit) => {
    this.setState({ selectedOptionUnit });
    // console.log(`Option selected:`, selectedOptionUnit);
  }


validateOneField(warningMessage, badComparator, fieldName){
  let fieldWarningName = fieldName + "Warning";
  if (this.state[fieldName] === badComparator){
    this.setState({[fieldWarningName]: warningMessage});
    return false;
  } else if (this.state[fieldName] !== badComparator){
    this.setState({ [fieldWarningName] : ""});
    return true;
  }
}

validateOneOptionalField(warningMessage, fieldName, price){
  let fieldWarningName = fieldName + "Warning";
  if (this.state[fieldName] !== "" && isNaN(price)){
    this.setState({[fieldWarningName]: warningMessage})
    return false;
  } else if (this.state[fieldName] !== "" && !isNaN(price)) {
    this.setState({[fieldWarningName] : ""});
    return true;
  } else if (this.state[fieldName] === ""){
    this.setState({[fieldWarningName] : ""});
    return true;
  }
}

  // returns true if inputs are valid
  validateAddFoodFields(){
    let emptinessWarning = "required field"
    let notNumber = "must be numerical"

    let nameField = this.validateOneField(emptinessWarning, "", "nameField");
    let expiryField = this.validateOneField("fuck gotta write this", "", "expiryField");
    let selectedOptionCompartment = this.validateOneField(emptinessWarning, null, "selectedOptionCompartment");

    let priceField = this.validateOneOptionalField(notNumber, "priceField",  parseFloat(this.state.priceField))
    let quantityField = this.validateOneOptionalField(notNumber, "quantityField",  parseFloat(this.state.quantityField))

    var validInputs = (nameField && expiryField && selectedOptionCompartment && priceField && quantityField)
    return validInputs;
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

        <TextField onChange={(e) => this.handleChangeTextField(e, "nameField")}
                   value={this.state.nameField}
                   className={"popOverField"}
                   placeholder="name"
                   warning={this.state.nameFieldWarning}/>

        <TextField onChange={(e) => this.handleChangeTextField(e, "expiryField")}
                  value={this.state.expiryField}
                  className={"popOverField"}
                  placeholder="expiry &nbsp; [mm/dd]"
                  warning={this.state.expiryFieldWarning}/>

        <span>
          <div className="textFieldNotification"> {this.state.selectedOptionCompartmentWarning} </div>
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
        </span>

        <div className="optional">
          - optional -
        </div>

        <div>
          <TextField onChange={(e) => this.handleChangeTextField(e, "quantityField")}
                     value={this.state.quantityField}
                     className="popOverField popOverQuantitiesText"
                     placeholder="quantity"
                     warning={this.state.quantityFieldWarning}/>

             <Select
              className="popOverField popOverUnitSelect"
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

        <TextField onChange={(e) => this.handleChangeTextField(e, "priceField")}
                   value={this.state.priceField}
                   className="popOverField"
                   placeholder="price (optional)"
                   warning={this.state.priceFieldWarning}/>

        <Button bsPrefix="popOverSubmitButton" onClick={(e) => this.addFoodToDB(e)}> submit </Button>

      </div>
    );
  }
}

class TextField extends Component{
  render(){
    return(
      <span>
        <div className="textFieldNotification"> {this.props.warning} </div>
        <input type="text"
               value={this.props.nameField}
               onChange={this.props.onChange}
               className={this.props.className}
               placeholder={this.props.placeholder}/>
      </span>
    );
  }
}


class FoodTable extends Component{
  constructor(props){
    super(props);
    this.state = {foodData: null};
  }

  componentDidMount(){
    this.getFoods();
  }
  componentWillUnmount() {
  }


  getFoods(){
    fetch("http://localhost:3001/api/getFood")
      .then(data => data.json()) // response type
      .then(res => this.setState({foodData: res.data})) //do stuff with data
      // .then(res => this.setState({freezer: res.data[2].foods,
      //                             fridge: res.data[1].foods,
      //                             pantry: res.data[0].foods})) //do stuff with data
  };


  generateFoodRows(){
    let data = this.state.foodData;
    // const FoodRows = data.map((food) =>
    //   <FoodRow key="{food._id}" nameCell={food.name} expiryCell="{food.expiry}" quantityCell="" unitCell=""/>
    // );
    console.log("eh")
    console.log(data)

    // var i;
    // for (i in data){
    //   console.log( data[i].name)
    //   console.log( data[i].expiry)
    //   console.log( data[i].compartment)
    //   console.log( data[i]._id)
    //   console.log( data[i].unitCell)
    //   console.log("")
    // }

    // return <div> {FoodRows} </div>;
  }

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
        {this.generateFoodRows()}
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
              <div className="ftCell nameCell"> {this.props.nameCell} </div>
              <div className="ftCell expiryCell"> {this.props.expiryCell} </div>
              <div className="ftCell quantityCell"> {this.props.quantityCell} </div>
              <div className="ftCell unitCell"> {this.props.unitCell} </div>
            </div>
            );
  }
}


export default FridgeView;
