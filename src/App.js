import './App.css';
import React from 'react';
import { cardData } from "./data";

function Interpretation(props){
  return(
    <div>
      <br/>
        {<img src={(props.result[0]) ? props.result[0].Image : ""} height="250px"/>}
        <p>Interpretation&nbsp;:&nbsp;
        {(props.result[0]) ? props.result[0].Title : ""}
        <br/>
      </p>        
      <p><strong>Normal</strong>&nbsp;: {(props.result[0]) ? props.result[0].Normal: ""}</p> 
      <p><strong>Reversed</strong>&nbsp;: {(props.result[0]) ? props.result[0].Reversed : ""}</p>      
    </div>  
  )
}

class TarotApp extends React.Component {
  //This top-level class is also named as the export default at the EOF
  constructor(props){
    super(props)
    this.state = {
      selectedSuit: null,
      deck: cardData,
      remainingCardsBySuit: null,
      selectedOrdinal: 10,
    }
  }
  
  getAvailableOrdinals(suit){
    const changedArray=this.state.deck.filter((el) => {      
      return el.Suit==suit;
    });
    return{"remaining":changedArray}
  }

  handleSuitChange(e) {   
    const newSuit =  e.target.value;
    this.setState({selectedSuit: newSuit,remainingCardsBySuit: this.getAvailableOrdinals(newSuit),selectedOrdinal: ""});
  }  

  handleOrdinalChange(e) {   
    const newOrdinal =  e.target.value;
    this.setState({selectedOrdinal: newOrdinal});
  }  
  render() {
    const currentSuit = this.state.selectedSuit
    const currentOrdinal = this.state.selectedOrdinal
    const filteredCards = this.state.remainingCardsBySuit
    const selectedOrdinal = this.state.selectedOrdinal
    const filteredOrdinals = this.state.deck.filter(
      (o) => o.Suit === currentSuit
    );
    console.log(this.state.deck[0].Normal)
    const filteredCard = this.state.deck.filter(
            (o) => o.Ordinal == selectedOrdinal && o.Suit == currentSuit
    );
    return (
      <div className="App">
        <h1 className="App-header">
          Tom's Tarot App
        </h1>
        <Suits
          handleSuitChange={(e) => this.handleSuitChange(e)}
          defaultSuit={currentSuit}
          currentSuit={currentSuit}
        />  
        <Ordinals 
          options={filteredOrdinals}
          handleOrdinalChange={(e) => this.handleOrdinalChange(e)}
          selectedOrdinal={currentOrdinal}
        /> 
        <Interpretation
          result={filteredCard}
        />           
      </div>

    );
  }
}

function Suits(props){
  //{props.defaultSuit}
  return(
    <div>
    <label htmlFor="suit-select">Choose a suit: </label>
    <select name="suits" id="suit-select" defaultValue="" onChange={props.handleSuitChange}>    
        <option value="" >-- Select Suit --</option>
        <option value="Trumps" >Trumps</option>
        <option value="Cups">Cups</option>
        <option value="Wands">Wands</option>
        <option value="Swords">Swords</option>
        <option value="Pentacles">Pentacles</option>
    </select>  
  
  </div>  
  )
}

function Ordinals(props){
  return(
    <div>
    <label htmlFor="ordinal-select">Choose an ordinal:</label>
    <select name="ordinals" id="ordinal-select" default="" onChange={props.handleOrdinalChange}>
      <option value="" >-- Select Ordinal --</option>
        {props.options.map((data, key) => {  
          return (
            <option key={data.Id} value={data.Ordinal}>{data.OrdinalName}</option>
          );
        })}
    </select>    
    </div>  
  )
}

function Pick(props){
  //console.log(props);
  return(
    <span>
    <button className="pick" onClick={props.onClick}>
    Pick
  </button>
  &nbsp;
  </span>
  )
}
export default TarotApp;
