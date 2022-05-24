import './App.css';
import React from 'react';
import { cardData } from "./data";

function Interpretation(props){
  const genderedCard = props.result[0] && props.result[0].GenderedCard != "Non-specific";
  const ldIntro="<b>Full description of the card and its symbols:</b>&nbsp;";
  const LongDescription = props.result[0]? ldIntro + props.result[0].Description : "";
  return(
    <div>
      <div id="Interpretation" className="pHidden">
        <div>
          <button id="invertButton" className="pick"
            onClick={()=>
              {if (document.getElementById('cardImage').className == 'Normal')
                {document.getElementById('cardImage').className = 'Reversed';
                document.getElementById('invertButton').innerHTML='Switch to normal presentation';
                document.getElementById('NormalInterpretation').className= 'pHidden';
                document.getElementById('ReversedInterpretation').className='pVisibleInline';
                document.getElementById("ordinal-select").focus();
              }
              else
                {document.getElementById('cardImage').className= 'Normal';
                document.getElementById('invertButton').innerHTML='Switch to reversed presentation';
                document.getElementById('NormalInterpretation').className= 'pVisibleInline';
                document.getElementById('ReversedInterpretation').className='pHidden';
                document.getElementById("ordinal-select").focus();
                }
              }
            }
            >Switch to reversed presentation
          </button>           
        </div>
          {<img src={(props.result[0]) ? props.result[0].Image : ""}  id="cardImage" className="Normal"/>}
          <br/>     
          <div  id="Gendered" className="gendered">
            {genderedCard ? <span>This card also represents the {props.result[0].GenderedCard} gender.</span> : ""} 
          </div>          
        <div  id="NormalInterpretation" className="pVisibleInline">
          Divinatory Meaning&nbsp;:&nbsp;
            {(props.result[0]) ? props.result[0].Title : ""}&nbsp;<strong>(Normal)</strong><br/>
            {(props.result[0]) ? props.result[0].Normal: ""}
        </div> 
        <div  id="ReversedInterpretation" className="pHidden">
          Divinatory Meaning&nbsp;:&nbsp;
            {(props.result[0]) ? props.result[0].Title : ""}&nbsp;<strong>(Reversed)</strong><br/>
            {(props.result[0]) ? props.result[0].Reversed : ""}
        </div>  
        <div id="LongDescription">            
          {(props.result[0]) ? <p className="LongDescription" dangerouslySetInnerHTML={{__html: LongDescription}}></p> : ""}
        </div>
      </div>       
    </div>  
  )
}

class TarotApp extends React.Component {
  //This top-level class is also named as the export default at the EOF
  constructor(props){
    super(props)
    const deckCopy = cardData.map((x) => x);
    this.state = {
      selectedSuit: null,
      deck: deckCopy,
      picked: [],
      remainingCardsBySuit: null,
      selectedOrdinal: null,
      presentation: "Normal",
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
    this.setState({
      selectedSuit: newSuit,
      remainingCardsBySuit: this.getAvailableOrdinals(newSuit),
      selectedOrdinal: null});
    document.getElementById('Interpretation').className='pHidden'
  }  

  handleReset(){
    const deckCopy = cardData.map((x) => x);
    this.setState({
      deck: deckCopy,
      picked: []
    })
  }
  handleCardPicked(e){
    var index = this.state.deck.findIndex(x => x.Suit == this.state.selectedSuit && x.Ordinal == this.state.selectedOrdinal);
    var pickedCard=this.state.deck.splice(index,1)
    pickedCard[0].Presentation=document.getElementById('cardImage').className;
    this.setState({
      picked:this.state.picked.concat(pickedCard),
    })
    document.getElementById("ordinal-select").focus();
  }

  handleOrdinalChange(e) {   
    const newOrdinal =  e.target.value;
    this.setState({selectedOrdinal: newOrdinal});
    {newOrdinal ? document.getElementById('Interpretation').className='pVisibleInline': document.getElementById('Interpretation').className='pHidden'}
  }  
  render() {
    const currentSuit = this.state.selectedSuit
    const currentOrdinal = this.state.selectedOrdinal
    //const filteredCards = this.state.remainingCardsBySuit
    const selectedOrdinal = this.state.selectedOrdinal
    const filteredOrdinals = this.state.deck.filter(
      (o) => o.Suit === currentSuit
    );
    //console.log(this.state.deck[0].Normal)
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
        <Pick 
          pickedCards={this.state.picked}
          handleCardPicked={(e) => this.handleCardPicked(e)}
          handleReset={() => this.handleReset()}
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
  return(
    <div id="Pick">
      <button className="pick" onClick={props.handleCardPicked}>
        Pick
      </button>&nbsp;

      <div>
        <p>Your picks:</p>
            {props.pickedCards.map((data, key) => {  
              return (
                <div key={data.Id}><strong>{data.Title},&nbsp;({data.Presentation}):</strong>&nbsp;{data.Presentation=="Normal"? data.Normal: data.Reversed}</div>
              );
            })}
      </div>   
      <button className="reset" onClick={props.handleReset}>
        Reset
      </button>
    </div>
  
  )
}
export default TarotApp;
