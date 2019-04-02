import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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
  ListItemPrimaryText
} from '@rmwc/list';
import '@material/list/dist/mdc.list.css';

import { TabBar, Tab } from '@rmwc/tabs';
import '@material/tab-bar/dist/mdc.tab-bar.css';
import '@material/tab/dist/mdc.tab.css';
import '@material/tab-scroller/dist/mdc.tab-scroller.css';
import '@material/tab-indicator/dist/mdc.tab-indicator.css';

import { IconButton } from '@rmwc/icon-button';
import '@material/icon-button/dist/mdc.icon-button.css';

import { Icon } from '@rmwc/icon';
import '@rmwc/icon/icon.css';

import {
  Card,
  CardPrimaryAction,
  CardMedia,
  CardActionButton,
  CardActionIcon,
  CardActions,
  CardActionButtons,
  CardActionIcons
} from '@rmwc/card';
import '@material/card/dist/mdc.card.css';
import '@material/button/dist/mdc.button.css';
import '@material/icon-button/dist/mdc.icon-button.css';

import { TextField } from '@rmwc/textfield';
import '@material/textfield/dist/mdc.textfield.css';
import '@material/floating-label/dist/mdc.floating-label.css';
import '@material/notched-outline/dist/mdc.notched-outline.css';
import '@material/line-ripple/dist/mdc.line-ripple.css';
// =======================================================

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {rightPanelView: "Frïdge"};
  }

  changeView(view){
    if (view === "Shöp"){
      this.setState({rightPanelView: "Shöp"});
    } else if (view == "Frïdge") {
      this.setState({rightPanelView: "Frïdge"});
    } else {
      this.setState({rightPanelView: "Rëcipe"});
    }}

  // returns which view to render
  determineView(view){
    let infoPassed = this.state.rightPanelView; // stub
    if (view === "Shöp"){
      return <ShopView text = {infoPassed}/>;
    } else if (view == "Frïdge") {
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

class Sidebar extends React.Component {
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



class ShopView extends React.Component{
  render(){
    return (
      <Button>{this.props.text} stuff</Button>
    );
  }
}

class FridgeView extends React.Component{
  constructor(props){
    super(props);
    this.state = {compartmentView: "fridge",
                  showAddFood: false,
                  fridge:  [{"name": "peach", "date": "3/14"},
                            {"name": "meat", "date": "3/20"}],
                  pantry:  [{"name": "cereal", "date": "3/15"},
                            {"name": "tea", "date": "3/20"}],
                  freezer:  [{"name": "chicken", "date": "3/14"}]
    };
  }

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
                  <TextField label="Food Name"/>
                  <TextField label="date" type="date"/>
                </CardPrimaryAction>
                <CardActions>
                  <CardActionButtons>
                    <CardActionButton>Submit</CardActionButton>
                    <CardActionButton>Cancel</CardActionButton>
                  </CardActionButtons>
                </CardActions>
              </Card>
  }

  addFoodCardOpen(){
      let setTo = this.state.showAddFood ? false : true;
      this.setState({showAddFood: setTo});
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

class RecipeView extends React.Component{
  render(){
    return (
      <Button>{this.props.text} stuff</Button>
    );
  }
}



// ========================================

ReactDOM.render(
  // <ThemeProvider />,
  <App />,
  document.getElementById('root')
);
