import './App.css';
import React from 'react';
import { cardData } from "./data";

function Suits(props){
  return(
    <div>
    <label htmlFor="suit-select">Choose a suit:</label>
    <select name="suits" id="suit-select" defaultValue={props.defaultSuit} onChange={props.handleSuitChange}>
        <option value="Trumps" >Trumps</option>
        <option value="Cups">Cups</option>
        <option value="Wands">Wands</option>
        <option value="Swords">Swords</option>
        <option value="Pentacles">Pentacles</option>
    </select>  
  <p>Your current choice: {props.currentSuit}</p>  
  </div>  
  )
}

function FullDeck(props){
  //Was {cardData.map((data, key) => {
  return (
      <div className="deck-container">
        {props.deck.cardData.map((data, key) => {  
          return (
            <div key={key}>
              {data.Title +
                "; " +
                data.Suit +
                ";" +
                data.Ordinal +
                ";" +
                data.OrdinalName }
            </div>
          );
        })}
      </div>
  );
}

function Ordinals(props){
  console.log(props);
  return(
    <div>
    <label htmlFor="ordinal-select">Choose an ordinal:</label>
    <select name="ordinals" id="ordinal-select">
        {props.currentOrdinals.remaining.map((data, key) => {  
          return (
            <option key={key} value={data.Ordinal}>{data.OrdinalName}</option>
          );
        })}
    </select>
</div>  
  )
}

class TarotApp extends React.Component {
  //This top-level class is also named as the export default at the EOF
  constructor(props){
    super(props)
    this.state = {
      selectedSuit: "Swords",
      deck: {cardData},
      remainingCardsBySuit: 
        {remaining : cardData.filter((el)=>{
          return el.Suit == "Swords";
        })},
    }
  }
  
  getAvailableOrdinals(suit){
    const changedArray=this.state.deck.cardData.filter((el) => {      
      return el.Suit==suit;
    });
    return{"remaining":changedArray}
  }
  handleSuitChange(e) {   
    const newSuit =  e.target.value
    console.log('newSuit: ' + newSuit);
    this.setState({selectedSuit: newSuit,remainingCardsBySuit: this.getAvailableOrdinals(newSuit)});
    console.log(this.state.remainingCardsBySuit);
  }  
  render() {
    const currentSuit = this.state.selectedSuit
    console.log('currentSuit: ',currentSuit);
    const filteredCards = this.state.remainingCardsBySuit
    console.log('filteredCards: ',filteredCards);
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
          currentOrdinals={filteredCards}
        />
        <FullDeck
          deck={this.state.deck}
        />
        <div>
            <button className="none">
              Pick
            </button>
        </div> 
        <div>
            <ol id="dealt-hand" visibile="hidden">
                <li>King of Pentacles [pic, description]</li>
                <li>XXI of Trumps, The World [pic , description]</li>
                <li>XV of Trumps, The Devil [pic , description]</li>
                <li>III of Cups  [pic , description]</li>
                <li>Ace of Wands  [pic , description]</li>                    
            </ol>
        </div>
        <div>
            <button className="none">
              Restart
            </button>
        </div>                               
      </div>

    );
  }
}

export default TarotApp;
