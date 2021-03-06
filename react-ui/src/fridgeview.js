import React, { Component } from 'react';
import axios from "axios";

import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

import Select from 'react-select';
import { optionsIcon } from './selectIconImgs';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPlus, faEdit, faCheck, faChevronCircleRight, faChevronCircleLeft} from '@fortawesome/free-solid-svg-icons'
import {faSquare, faCheckSquare} from '@fortawesome/free-regular-svg-icons'
library.add(faPlus, faEdit, faSquare, faCheckSquare, faCheck, faChevronCircleRight, faChevronCircleLeft)



class FridgeView extends Component{
  constructor(props){
    super(props);
    this.state = {compartmentSelection: "fridge",
                  foodData:"",
                  infoRefreshed:false};
    this.getFoods = this.getFoods.bind(this);
  }


  componentDidMount(){
    // static
    // console.log("trying 1")
    this.getFoods()
  }
  componentWillUnmount() {
    // console.log(this.state.foodData)
  }

  getFoods(){
    fetch("https://desolate-shore-61967.herokuapp.com/getFood")
      .then(data => data.json()) // response type
      .then(res =>{ this.setState({foodData: res.data, infoRefreshed: true})
                    // console.log("get foods called")
                    return true;
    })
  };


  render(){
    return(
        <div className="fridgeCompartmentView">
          <FridgeButtonGroup selection={this.state.compartmentSelection}
                             onClickButton={(newSelection) => this.setState({compartmentSelection: newSelection})}
                             refreshAfterAdd={this.getFoods}/>
          {this.state.infoRefreshed
            ? <FoodTable foodData={this.state.foodData}
                       compartmentSelection={this.state.compartmentSelection}
                       loadFoodsFunction={this.getFoods}/>
            : <br/>}
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
            {this.state.isPopOverOpen && <AddFood refreshAfterAdd={this.props.refreshAfterAdd}/>}

          </ButtonGroup>);
  }
}

class AddFood extends Component{
  constructor(props){
    super(props);
    this.state = {nameField: "",
                  expiryField: "",
                  selectedOptionCompartment: null,
                  selectedOptionIcon: null,
                  quantityField: "",
                  selectedOptionUnit: null,
                  priceField: "",

                  nameFieldWarning: "",
                  expiryFieldWarning: "",
                  selectedOptionCompartmentWarning: null,
                  selectedOptionIconWarning: null,
                  quantityFieldWarning: "",
                  priceFieldWarning: "",
                  anyWarnings: false
                };
    this.handleChangeTextField = this.handleChangeTextField.bind(this);
    this.addFoodToDB = this.addFoodToDB.bind(this);
  }

  addFoodToDB(e){
    var self = this;
    if (this.validateAddFoodFields()){
      // var self = this;
      let unitValue;
      if (self.state.selectedOptionUnit === null){
        unitValue = "";
      } else {
        unitValue = self.state.selectedOptionUnit.value
      }

      let priceValue;
      if (self.state.priceField === ""){
        priceValue = "";
      } else {
        priceValue = "$ " + parseFloat(self.state.priceField).toFixed(2).toString();
      }

      axios.post("https://desolate-shore-61967.herokuapp.com/addFood", {
        name: self.state.nameField,
        expiry: self.state.expiryField,
        compartment: self.state.selectedOptionCompartment.value,
        icon: self.state.selectedOptionIcon.value,

        quantity: self.state.quantityField.toString(),
        unit: unitValue,
        price: priceValue
      })
      .then(function (response){
        console.log("card closes")
        // console.log(response)
        self.props.refreshAfterAdd()
      });
    }
  }

  handleChangeTextField(event, stateName){
    this.setState({[stateName]: event.target.value})
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
  validateDateField(){
    var date_regrex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])$/;
    if (this.state.expiryField === ""){
      this.setState({expiryFieldWarning: "required field"});
      return false;
    } else if (!date_regrex.test(this.state.expiryField)){
      this.setState({expiryFieldWarning: "please enter a valid MM/DD date"});
      return false
    } else {
      this.setState({expiryFieldWarning: ""});
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
    let expiryField = this.validateDateField();
    let selectedOptionCompartment = this.validateOneField(emptinessWarning, null, "selectedOptionCompartment");
    let selectedOptionIcon = this.validateOneField(emptinessWarning, null, "selectedOptionIcon");

    let priceField = this.validateOneOptionalField(notNumber, "priceField",  parseFloat(this.state.priceField))
    let quantityField = this.validateOneOptionalField(notNumber, "quantityField",  parseFloat(this.state.quantityField))

    var validInputs = (nameField && expiryField && selectedOptionCompartment && selectedOptionIcon && priceField && quantityField)
    return validInputs;
  }

  render(){
    const { selectedOptionCompartment } = this.state;
    const { selectedOptionIcon } = this.state;
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
            onChange={(selectedOptionCompartment) => this.setState({ selectedOptionCompartment })}
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

        <span>
          <div className="textFieldNotification"> {this.state.selectedOptionIconWarning} </div>
          <Select
            className="popOverField popOverSelect"
            value={selectedOptionIcon}
            onChange={(selectedOptionIcon) => this.setState({ selectedOptionIcon })}
            options={optionsIcon}
            styles={styleFocus}
            placeholder="icon"
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
              onChange={(selectedOptionUnit) => this.setState({ selectedOptionUnit })}
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
                   placeholder="price"
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
    this.state = {checkedFoods: new Set(),
                  isCollapsed: false};
    this.deHighlightActions = this.deHighlightActions.bind(this);
  }


  reportFoodChecked(id){
    let oldSet = this.state.checkedFoods
    let newSet;
    if (oldSet.has(id)){
      oldSet.delete(id)
      newSet = oldSet
    } else {
      newSet = oldSet.add(id)
    }
    this.setState({checkedFoods: newSet})
  }

  deHighlightActions(){
    this.setState({checkedFoods: new Set()})
  }

  generateFoodRows(){
    let data = this.props.foodData;
    if (data === ""){
      // console.log("empty data")
      return
    }
    // console.log(data)
    const FoodRows = data.map((food) =>
      (food.compartment === this.props.compartmentSelection ?
                            <FoodRow key={food._id}
                                     onClickReportId={() => this.reportFoodChecked(food._id)}
                                     isChecked={this.state.checkedFoods.has(food._id)}
                                     iconCell={food.icon}
                                     nameCell={food.name}
                                     expiryCell={food.expiry}
                                     quantityCell={food.quantity}
                                     unitCell={food.unit}
                                     priceCell={food.price}
                                     isCollapsed={this.state.isCollapsed}/> : "")
    );
    return <div> {FoodRows} </div>;
  }

  foodActionStyles(){
    let activeStyle = {
      color: "#a4de02",
      border: "3px solid #a4de02",
      cursor: "pointer"
    };
    let disabledStyle = {
      color: "#C0C5CE",
      border: "3px dotted #C0C5CE"
    }

    let currentChecks = this.state.checkedFoods;
    if (currentChecks.size === 0){
      return disabledStyle
    } else {
      return activeStyle
    }
  }

  toggleCollapse(){
    this.setState({isCollapsed: !this.state.isCollapsed})
  }

  render(){

    let collapsedColumn = {display: "none"};
    let expandedColumn = {};

    return(
      <div className="fridgeTable noHighlight">
        <FoodActionsBar actionStyle={this.foodActionStyles()}
                        isActive={(this.state.checkedFoods.size > 0).toString()}
                        checkedFoods={this.state.checkedFoods}
                        refreshAfterDelete={this.props.loadFoodsFunction}
                        deHighlightActions={this.deHighlightActions}
                        />
        <div className="ftRow ftHeader">
          <div className="ftCell checkmarkCell"> <FontAwesomeIcon className="icon" icon='check' size="lg"/> </div>
          <div className="ftCell iconCell"> &nbsp; </div>
          <div className="ftCell nameCell"> name </div>
          <div className="ftCell expiryCell"> expiry </div>
          <div className="ftCell collapseButtonCell"> <FontAwesomeIcon className="icon clickable" onClick={() => this.toggleCollapse()} icon={this.state.isCollapsed ? 'chevron-circle-left' : 'chevron-circle-right'} size="lg"/> </div>
          <div className="ftCell quantityCell" style={this.state.isCollapsed ? collapsedColumn : expandedColumn}> quantity </div>
          <div className="ftCell unitCell"  style={this.state.isCollapsed ? collapsedColumn : expandedColumn}> unit </div>
          <div className="ftCell priceCell" style={this.state.isCollapsed ? collapsedColumn : expandedColumn}> price </div>
        </div>
        {this.generateFoodRows()}
      </div>
    );
  }
}

class FoodRow extends Component{
  constructor(props){
    super(props);
    this.state = {checked: this.props.isChecked,
                  icon: "",
                  name: "",
                  expiry: "",
                  quantity: "",
                  unit: ""
                };

    }

  tickBox(){
    this.props.onClickReportId()
    this.setState({checked: !this.state.checked})

  }

  isCollaspedStyle(){
    let collapsedColumn = {display: "none"};
    let expandedColumn = {};
    if (this.props.isCollapsed){
      return collapsedColumn;
    } else {
      return expandedColumn;
    }
  }

  render(){
    let checkBox;
    if (this.state.checked){
      checkBox = <FontAwesomeIcon className="icon" icon={['far', 'check-square']} size="lg"/>;
    } else {
      checkBox = <FontAwesomeIcon className="icon" icon={['far', 'square']} size="lg"/>;
    }

    const images = require.context('./icons', true);



    return( <div className="ftRow">
              <div className="ftCell checkmarkCell" onClick={() => this.tickBox()}> {checkBox} </div>
              <div className="ftCell iconCell"> <img className="foodIcon" src={ images(this.props.iconCell) } alt="food icon" /> </div>
              <div className="ftCell nameCell"> {this.props.nameCell} </div>
              <div className="ftCell expiryCell"> {this.props.expiryCell} </div>
              <div className="ftCell collapseButtonCell"> </div>
              <div className="ftCell quantityCell" style={this.isCollaspedStyle()}> {this.props.quantityCell} </div>
              <div className="ftCell unitCell" style={this.isCollaspedStyle()}> {this.props.unitCell} </div>
              <div className="ftCell priceCell" style={this.isCollaspedStyle()}> {this.props.priceCell} </div>
            </div>
            );
  }
}

class FoodActionsBar extends Component{

  deleteFood(){
    if (this.props.isActive === "true"){
      let arrChecked = Array.from(this.props.checkedFoods)

      axios.delete("https://desolate-shore-61967.herokuapp.com/deleteFood", {
        data: {
          ids: arrChecked
        }
      }).then(() => {this.props.refreshAfterDelete()
                     this.props.deHighlightActions()
                     return true;
      });
    }
  }

  render(){
    return(
      <div className="foodActionsBar">
        <div className="foodAction" style={this.props.actionStyle} onClick={() => this.deleteFood()}> eat </div>
        <div className="foodAction" style={this.props.actionStyle} onClick={() => this.deleteFood()}> expire </div>
      </div>

    );
  }
}


export default FridgeView;
