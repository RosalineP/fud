import React, { Component } from 'react';
import axios from "axios";

// =========== rmwc styling =============================
import { Button } from '@rmwc/button';
import '@material/button/dist/mdc.button.css';

import {
  Drawer,
  DrawerHeader,
  DrawerContent,
  DrawerTitle,
  DrawerSubtitle
} from '@rmwc/drawer';
import '@material/drawer/dist/mdc.drawer.css';
import {
  List,
  ListItem,
  // ListItemPrimaryText
} from '@rmwc/list';
import '@material/list/dist/mdc.list.css';

import { TabBar, Tab } from '@rmwc/tabs';
import '@material/tab-bar/dist/mdc.tab-bar.css';
import '@material/tab/dist/mdc.tab.css';
import '@material/tab-scroller/dist/mdc.tab-scroller.css';
import '@material/tab-indicator/dist/mdc.tab-indicator.css';

import { IconButton } from '@rmwc/icon-button';
import '@material/icon-button/dist/mdc.icon-button.css';

// import { Icon } from '@rmwc/icon';
import '@rmwc/icon/icon.css';

import {
  Card,
  CardPrimaryAction,
  // CardMedia,
  CardActionButton,
  // CardActionIcon,
  CardActions,
  CardActionButtons,
  // CardActionIcons
} from '@rmwc/card';
import '@material/card/dist/mdc.card.css';
import '@material/button/dist/mdc.button.css';
import '@material/icon-button/dist/mdc.icon-button.css';

import { TextField } from '@rmwc/textfield';
import '@material/textfield/dist/mdc.textfield.css';
import '@material/floating-label/dist/mdc.floating-label.css';
import '@material/notched-outline/dist/mdc.notched-outline.css';
import '@material/line-ripple/dist/mdc.line-ripple.css';

import { Select } from '@rmwc/select';
import '@material/select/dist/mdc.select.css';
import '@material/floating-label/dist/mdc.floating-label.css';
import '@material/notched-outline/dist/mdc.notched-outline.css';
import '@material/line-ripple/dist/mdc.line-ripple.css';
import '@material/list/dist/mdc.list.css';
import '@material/menu/dist/mdc.menu.css';
import '@material/menu-surface/dist/mdc.menu-surface.css';
// =======================================================



class App extends Component{
  constructor(props){
    super(props);
    this.state = {rightPanelView: "Frïdge"};
  }


  componentDidMount() {
    console.clear();
  }

  // do i need one of these lol
  componentWillUnmount() {
    console.log("wat")
  }

  changeView(view){
    if (view === "Shöp"){
      this.setState({rightPanelView: "Shöp"});
    } else if (view === "Frïdge") {
      this.setState({rightPanelView: "Frïdge"});
    } else {
      this.setState({rightPanelView: "Rëcipe"});
    }}

  // returns which view to render
  determineView(view){
    let infoPassed = this.state.rightPanelView; // stub
    if (view === "Shöp"){
      return <ShopView text = {infoPassed}/>;
    } else if (view === "Frïdge") {
      return <FridgeView text = {infoPassed}/>;
    } else {
      return <RecipeView text = {infoPassed}/>;
    }
  }

  render(){
    return(
      <div className = "app">
        <div className = "leftPanel leftFloat">
          <Sidebar onClick = {(view) => this.changeView(view)} />
        </div>
        <div className = "rightPanel">
          {this.determineView(this.state.rightPanelView)}
        </div>
      </div>
    );
  }
}

// uses map to generate all sidebar list activity buttons
function SidebarListActivity(props){
  const activityNames = ["Shöp", "Frïdge", "Rëcipe"];
  const SidebarListActivity = activityNames.map((name) =>
    <ListItem key = {name} onClick = {() => props.onClick(name)}>{name}</ListItem>);
  return(
    <li> {SidebarListActivity} </li>
  );
}

class Sidebar extends Component {
  render() { return(
    <Drawer>
      <DrawerHeader>
        <DrawerTitle>Füd</DrawerTitle>
        <DrawerSubtitle>Date?</DrawerSubtitle>
      </DrawerHeader>
      <DrawerContent>
        <List>
          <SidebarListActivity onClick = {(activity) => this.props.onClick(activity)}/>
        </List>
      </DrawerContent>
    </Drawer>
    );
  }
}



class ShopView extends Component{
  render(){
    return (
      <Button>{this.props.text} stuff</Button>
    );
  }
}

class FridgeView extends Component{
  constructor(props){
    super(props);
    this.state = {ajaxData: "",
                  data: "",
                  compartmentView: "fridge",
                  showAddFood: false,
                  fridge:  [{"name": "peach", "date": "3/14"},
                            {"name": "meat", "date": "3/20"}],
                  pantry:  [{"name": "cereal", "date": "3/15"},
                            {"name": "tea", "date": "3/20"}],
                  freezer:  [{"name": "chicken", "date": "3/14"}],

                  newFood: "",
                  newCompartment: "Fridge",
                  newDate:""
    };
    this.addFoodToDB = this.addFoodToDB.bind(this);
    this.clearCloseFoodCard = this.clearCloseFoodCard.bind(this);
    this.getDataFromDb = this.getDataFromDb.bind(this);
  }


  componentDidMount() {
    this.getDataFromDb();

  }
  componentWillUnmount() {
    this.setState({ ajaxData: "" });
  }


  getDataFromDb = () => {
    fetch("http://localhost:3001/api/getData")
      .then(data => data.json()) // response type
      .then(res => this.setState({freezer: res.data[2].foods})); //do stuff with data
      

      // .then(function (res){
      //   // this.setState({pantry: res.data[0].foods})
      //   // this.setState({fridge: res.data[1].foods})
      //   // this.setState({freezer:res.data[2].foods})
      // });



  };


  // generate list of foods for a compartment
  foodListItem(compartment){
    switch (compartment){
      case "fridge":
        var foods = this.state.fridge;
        break;
      case "pantry":
        var foods = this.state.pantry;
        break;
      case "freezer":
        var foods = this.state.freezer;
        break;
    }
    const FoodList = foods.map((food) =>
      <Button key = {food["name"]} label={food["name"] + " : " + food["date"]}  outlined />);
    return <div> {FoodList} </div>;
  }


  addFoodItem(){
    return     <Card outlined>
                <CardPrimaryAction>
                    <TextField value={this.state.newFood}
                               onChange={(e) => this.setState({newFood: e.currentTarget.value})}
                               label="Food Name"/>
                    <TextField value={this.state.newDate}
                               onChange={(e) => this.setState({newDate: e.currentTarget.value})}
                               label="date"
                               type="date"/>
                     <Select   value={this.state.newCompartment}
                               onChange={(e) => this.setState({newCompartment: e.currentTarget.value})}
                               label="Compartment"
                               options={['Pantry', 'Fridge', 'Freezer']}/>

                </CardPrimaryAction>
                <CardActions>
                  <CardActionButtons>
                    <CardActionButton onClick={this.addFoodToDB}>Submit</CardActionButton>
                    <CardActionButton onClick={this.clearCloseFoodCard}>Cancel</CardActionButton>
                  </CardActionButtons>
                </CardActions>
              </Card>
  }


  addFoodToDB(e){
    var self = this;
    // console.log("name:");
    // console.log(this.state.newFood);

    axios.post("http://localhost:3001/api/putData", {
      compartment: this.state.newCompartment,
      name: this.state.newFood,
      date: this.state.newDate
    })
    .then(function (response){
      self.clearCloseFoodCard();
    });
  }



  addFoodCardOpen(){
      let setTo = this.state.showAddFood ? false : true;
      this.setState({showAddFood: setTo});
  }

  clearCloseFoodCard(){
    this.setState({showAddFood:false, newFood: "", newCompartment: "", newDate:""})
  }

  render(){
    return(
      <div className = "FridgeView">
        <TabBar
          activeTabIndex={this.state.activeTab}
          onActivate={evt => this.setState({activeTab: evt.detail.index})}
        >
          <Tab onClick = {() => this.setState({compartmentView: "pantry"})} >Pantry</Tab>
          <Tab onClick = {() => this.setState({compartmentView: "fridge"})} >Fridge</Tab>
          <Tab onClick = {() => this.setState({compartmentView: "freezer"})} >Freezer</Tab>
        </TabBar>
        <div className = "rightFloat">

            <IconButton icon="+" label="placeholder" onClick = {() => this.addFoodCardOpen()}/>

        </div>
        <div className = "foodList">
          {this.foodListItem(this.state.compartmentView)}
        </div>

        <div className = "scrap padder">
          { this.state.showAddFood ? this.addFoodItem() : null }
        </div>

      </div>
    );
  }
}

class RecipeView extends Component{
  render(){
    return (
      <Button>{this.props.text} stuff</Button>
    );
  }
}



// ========================================

export default App;
