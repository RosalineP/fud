import React, { Component } from 'react';

import axios from "axios";

import { Checkbox } from '@rmwc/checkbox';
import '@material/checkbox/dist/mdc.checkbox.css';
import '@material/form-field/dist/mdc.form-field.css';

import { TabBar, Tab } from '@rmwc/tabs';
import '@material/tab-bar/dist/mdc.tab-bar.css';
import '@material/tab/dist/mdc.tab.css';
import '@material/tab-scroller/dist/mdc.tab-scroller.css';
import '@material/tab-indicator/dist/mdc.tab-indicator.css';

import { TextField } from '@rmwc/textfield';
import '@material/textfield/dist/mdc.textfield.css';
import '@material/floating-label/dist/mdc.floating-label.css';
import '@material/notched-outline/dist/mdc.notched-outline.css';
import '@material/line-ripple/dist/mdc.line-ripple.css';

class ShopView extends Component{
  constructor(props){
    super(props);
    this.state = {tabView: "grocery_list",
                  newfood: "",
                  foodList: []
                  };

    this.getDataFromDb = this.getDataFromDb.bind(this);
  }


  componentDidMount() {
    this.getDataFromDb();
    console.log("ping")
    console.log(this.state.foodList);


  }
  componentWillUnmount() {
    console.log("uh");
  }


  getDataFromDb = () => {
    fetch("http://localhost:3001/api/listGetGroceryList")
      .then(data => data.json()) // response type
      .then(res => this.setState({foodList: res.data[0].listfoods})) //do stuff with data
      // .then(() => console.log(this.state.foodList))
  };

  // to include
  TabBar(){
    return  <TabBar>
              <Tab onClick = {() => this.setState({tabView: "grocery_list"})}> Grocery List </Tab>
              <Tab onClick = {() => this.setState({tabView: "purchased"})}> Purchased </Tab>
            </TabBar>;
  }


  addFood(e){
    console.log("hey");
    var self = this;
    axios.post("http://localhost:3001/api/listAddFood", {
      food: this.state.newfood
    })
    .then(function (response){
      self.setState({newfood:""})
      self.getDataFromDb()
    });
  }

  render(){
    return (
    <div>
      <TextField label="+ new food item"
        value={this.state.newfood}
        onChange={(e) => { this.setState({newfood: e.currentTarget.value})}}
        onKeyPress={(e) => {
        if (e.key === 'Enter') {
          this.addFood(e);
          e.preventDefault();
        }
    }} />

    <div>
      <GroceryList foodlist={this.state.foodList}/>
    </div>

    </div>
  );}
}

class GroceryList extends Component{
  constructor(props){
    super(props);
    this.state = {foodList: this.props.foodlist};

  }

  componentDidMount() {
    console.log("in grocerylist!")
    console.log(this.state.foodList)
  }

  componentWillUnmount() {
    console.log("uh");
  }

  generateGroceryList(){
    var foods = this.props.foodlist
    const FoodList = foods.map((food) =>

      <Checkbox
        label={food}
        key={food}
      />

    );
    return <div> {FoodList} </div>;
  }

  render(){
    return <div> {this.generateGroceryList()} </div>
  }
}

export default ShopView;
