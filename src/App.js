import './App.css';
import React from 'react';
import { cardData } from "./data";
import { layout } from "./layout-data.js";

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
          {<img src={(props.result[0]) ? props.result[0].Image : ""}  id="cardImage" className="Normal" />}
          <br/>     
          <div  id="Gendered" className="gendered">
            {genderedCard ? <span>This card also represents the {props.result[0].GenderedCard} gender.</span> : ""} 
          </div>          
        <div  id="NormalInterpretation" className="pVisibleInline" title="hoverin' words">
          Divinatory Meaning&nbsp;:&nbsp;
            {(props.result[0]) ? props.result[0].Title : ""}&nbsp;<strong>(Normal)</strong><br/>
            {(props.result[0]) ? props.result[0].Normal: ""}
        </div> 
        <div  id="ReversedInterpretation" className="pHidden" title="hoverin' words">
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
    const layoutCopy = layout.map((x) => x);
    this.state = {
      selectedSuit: null,
      deck: deckCopy,
      picked: [],
      remainingCardsBySuit: null,
      selectedOrdinal: null,
      presentation: "Normal",
      layout: layoutCopy,
      nextLayoutPosition: layoutCopy.splice(0,1),
      deckComplete:false,
      pickedTitle:"You have picked no cards yet."
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
    const layoutCopy = layout.map((x) => x);
    this.setState({
      deck: deckCopy,
      picked: [],
      layout: layoutCopy,
      nextLayoutPosition: layoutCopy.splice(0,1),
      deckComplete:false,
      pickedTitle:"You have picked no cards yet.",
    })
  }
  handleCardPicked(e){
    var index = this.state.deck.findIndex(x => x.Suit == this.state.selectedSuit && x.Ordinal == this.state.selectedOrdinal);
    var pickedCard=this.state.deck.splice(index,1)
    pickedCard[0].Presentation=document.getElementById('cardImage').className;
    pickedCard[0].cardStatus=this.state.nextLayoutPosition[0].Title; 
    console.log(this.state.nextLayoutPosition[0])   ;
    pickedCard[0].cardStatusDescription=this.state.nextLayoutPosition[0].CrossMeaning;    
    if(this.state.layout.length>0){    
      this.setState({
        nextLayoutPosition:this.state.layout.splice(0,1),
        pickedTitle:"You have picked (so far):",
        picked:this.state.picked.concat(pickedCard)
    });      
    }
    else{
      this.setState({
        pickedTitle:"Your deck is complete:",
        deckComplete:true,
        picked:this.state.picked.concat(pickedCard)
      })
    }    
    document.getElementById('Interpretation').className='pHidden'
    document.getElementById('PickButton').className='pHidden'
    document.getElementById("ordinal-select").focus();
  }

  handleOrdinalChange(e) {   
    if(!this.state.deckComplete){
      const newOrdinal =  e.target.value;
      this.setState({selectedOrdinal: newOrdinal});
      {newOrdinal ? document.getElementById('Interpretation').className='pVisibleInline': document.getElementById('Interpretation').className='pHidden'}
      document.getElementById('PickButton').className='pVisibleInline'
    }
  }  
  render() {
    const currentSuit = this.state.selectedSuit
    const currentOrdinal = this.state.selectedOrdinal
    //const filteredCards = this.state.remainingCardsBySuit
    const selectedOrdinal = this.state.selectedOrdinal
    const filteredOrdinals = this.state.deck.filter(
      (o) => o.Suit === currentSuit
    );
    const filteredCard = this.state.deck.filter(
            (o) => o.Ordinal == selectedOrdinal && o.Suit == currentSuit
    );
    return (
      <div className="App">
        <h1 className="App-header">
          Tom's Tarot App
        </h1>
        <p>{"Consider your question, and whom it concerns. Then choose 11 cards to complete a divination using \u2018The Cross\u2019"}</p>
        <p>The next card <i>{this.state.nextLayoutPosition[0].Action}</i>.&nbsp;{this.state.nextLayoutPosition[0].CrossMeaning}</p>
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
          pickedTitle={this.state.pickedTitle}
          pickedDescription={this.state.pickedTitle}
          handleCardPicked={(e) => this.handleCardPicked(e)}
          handleReset={() => this.handleReset()}
        /> 
        <p>Listen to music. It often helps:<br/>
        <audio title="Neputune, The Mystic (Gustav Holst) - from The Internet Archive" src="https://ia803106.us.archive.org/22/items/lp_holst-the-planets_gustav-holst-leopold-stokowski-los-angeles/disc1/02.03.%20The%20Planets%3A%20Neptune%2C%20The%20Mystic.mp3" controls />                
        </p>
      </div>

    );
  }
}

function Suits(props){
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
      <div id="PickButton" className="pHidden">      
      <button onClick={props.handleCardPicked}>
        Add Card to Deck
      </button>
      </div>

      <div>
        <p>{props.pickedTitle}</p>        
            {props.pickedCards.map((data, key) => {  
              return (
                <div className={"floatedLeft "} key={data.Id} >                
                <div className={"NarrowDiv30pc floatedLeft"} ><img src={data.Image} className={data.Presentation=="Normal"? "thumb Normal": "thumb Reversed"}/></div>
                <div className={"NarrowDiv60pc floatedLeft"} >
                  <strong title={data.cardStatusDescription}>{data.cardStatus}:</strong>&nbsp;
                  <i>{data.Title},&nbsp;({data.Presentation}).</i>&nbsp;
                  {data.Presentation=="Normal"? data.Normal: data.Reversed}
                </div>
                </div>
              );
            })}
      </div>  
      <div className='clearFloat'>
      <button className="reset" onClick={props.handleReset}>
        Reset the Deck
      </button>
      </div> 
    </div>
  
  )
}
export default TarotApp;
