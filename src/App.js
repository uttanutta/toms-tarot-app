import './App.css';
import React from 'react';
import { cardData } from "./data";
import { layout } from "./layout-data.js";
// Material UI
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';



class TarotApp extends React.Component {
  //This top-level class is also named as the export default at the EOF
  constructor(props){
    super(props)
    const deckCopy = cardData.map((x) => x);
    const layoutCopy = layout.map((x) => x);
    this.state = {
      selectedSuit: "",
      deck: deckCopy,
      picked: [],
      remainingCardsBySuit: null,
      selectedOrdinal: "",
      presentation: "Normal",
      layout: layoutCopy,
      nextLayoutPosition: layoutCopy.splice(0,1),
      deckComplete:false,
      pickedTitle:"You have picked no cards yet.",
      confirmOpen:false,    
      previewActive:false,  
    }
  }
  getAvailableOrdinals(suit){
    const changedArray=this.state.deck.filter((el) => {      
      return el.Suit===suit;
    });
    return{"remaining":changedArray}
  }

  handleSuitChange(e) {   
    const newSuit =  e.target.value;
    this.setState({
      selectedSuit: newSuit,
      remainingCardsBySuit: this.getAvailableOrdinals(newSuit),
      selectedOrdinal: ""});
  }  
  handleOrdinalChange(e) {   
    if(!this.state.deckComplete){
      const newOrdinal =  e.target.value;
      this.setState({
        selectedOrdinal: newOrdinal
      }); //nested block is NOT redundant
    }
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
      selectedSuit:"",
    })
  }
  handleFillAtRandom(){
    //user has clicked the 'complete picking the deck for me' button
    //how many cards left to pick? picked.length 0 indicates 11, or length == 11 will indicate 0 cards remain 
    const pickedCount = (this.state.picked.length);
    const remainingCount = (11-pickedCount);
    const layoutCopy2 = layout.map((x) => x);
    const layoutCopy3=layoutCopy2.splice(11-remainingCount,remainingCount)
    var pickedCard;
    var pickedCards=[];
    for(var i=0; i<remainingCount; i++){
      //there are 78 cards in the original deck, so the remainder must be 78-the number picked so far
      const newIndex = Math.floor(Math.random() * ((78-pickedCount-i) ));
      const randPresentation = Math.random()<0.5 ? "Normal": "Reversed";
      pickedCard=this.state.deck.splice(newIndex,1);
      pickedCard[0].Presentation=randPresentation;
      pickedCard[0].cardStatus=layoutCopy3[i].Title;
      pickedCard[0].cardStatusDescription=layoutCopy3[i].CrossMeaning;
      pickedCards=pickedCards.concat(pickedCard);
    }
    this.setState({
      nextLayoutPosition:[{"Id": 99, "Title":"", "Action":"The final card has been chosen", "CrossMeaning":"All is revealed!"}],
      pickedTitle:"Your deck is complete:",
      deckComplete:true,
      selectedOrdinal:"",
      picked:this.state.picked.concat(pickedCards)
    })
  }
  handleCardPicked(e){
    //don't use '==='
    var index = this.state.deck.findIndex(x => x.Suit == this.state.selectedSuit && x.Ordinal == this.state.selectedOrdinal);
    var pickedCard=this.state.deck.splice(index,1)
    pickedCard[0].Presentation=this.state.presentation; 
    pickedCard[0].cardStatus=this.state.nextLayoutPosition[0].Title; 
    pickedCard[0].cardStatusDescription=this.state.nextLayoutPosition[0].CrossMeaning;    
    if(this.state.layout.length>0){    
      this.setState({
        nextLayoutPosition:this.state.layout.splice(0,1),
        pickedTitle:"You have picked " + (this.state.picked.length + 1)+ " of the 11 cards, so far:",
        picked:this.state.picked.concat(pickedCard),
        selectedOrdinal:"",
    });      
    }
    else{
      this.setState({
        nextLayoutPosition:[{"Id": 99, "Title":"", "Action":"The final card has been chosen", "CrossMeaning":"All done!"}],
        pickedTitle:"Your deck is complete:",
        deckComplete:true,
        picked:this.state.picked.concat(pickedCard),
        selectedOrdinal:"",
      })
    }    
    document.getElementById("ordinal-select").focus();
  }

 
  handleInversion(){
    this.state.presentation=="Normal" ? this.setState({presentation:"Reversed"}) : this.setState({presentation:"Normal"});
    document.getElementById("ordinal-select").focus();
  }
  
  render() {
    const currentSuit = this.state.selectedSuit
    const currentOrdinal = this.state.selectedOrdinal
    const selectedOrdinal = this.state.selectedOrdinal
    const filteredOrdinals = this.state.deck.filter(
      (o) => o.Suit === currentSuit
    );
    //Don't use the triple equality operator here ===
    const filteredCard = this.state.deck.filter(
            (o) => o.Ordinal == selectedOrdinal && o.Suit == currentSuit
    );
    return (
      <div className="App">
        <h1 className="App-header">
          Tarot Companion
        </h1>
        <p>{"This is a companion lookup to accompany a live Tarot reading, where you draw actual cards from a real deck. (Once you have begun, there is also an option here to complete the deck automatically.) The power of the divination is increased if the physical deck is cut by the querent. They should have considered their question, and whom or what it concerns beforehand. Then choose 11 cards to complete a divination using the method known as \u2018The Cross\u2019"}</p>
        <Suits
          handleSuitChange={(e) => this.handleSuitChange(e)}
          defaultSuit={currentSuit}
          currentSuit={currentSuit}
          deckComplete={this.state.deckComplete}
        />  
        <Ordinals 
          options={filteredOrdinals}
          handleOrdinalChange={(e) => this.handleOrdinalChange(e)}
          selectedOrdinal={currentOrdinal}
          deckComplete={this.state.deckComplete}
          initialOrdinal={this.state.selectedOrdinal}
        /> 
        <CompleteAtRandom 
          handleFillAtRandom={() => this.handleFillAtRandom()} 
          deckComplete={this.state.deckComplete}
          selectedOrdinal={this.state.selectedOrdinal}
        />
        <Interpretation
          result={filteredCard}
          presentation={this.state.presentation}
          handleInversion={() => this.handleInversion()}
          selectedOrdinal={this.state.selectedOrdinal}
        />  
        <Pick 
          handleCardPicked={(e) => this.handleCardPicked(e)} 
          selectedOrdinal={this.state.selectedOrdinal} 
        /> 
        <Picked 
          pickedCards={this.state.picked}
          pickedTitle={this.state.pickedTitle}
          nextAction={this.state.nextLayoutPosition[0].Action}
          crossMeaning={this.state.nextLayoutPosition[0].CrossMeaning}
        /> 
        <Reset 
          resetDeck={() => this.handleReset()}
          pickedCardsLength={this.state.picked.length}
        />
        <p>Listen to music. It may help:<br/>
        <audio loop title="Neputune, The Mystic (Gustav Holst) - from The Internet Archive" src="https://ia803106.us.archive.org/22/items/lp_holst-the-planets_gustav-holst-leopold-stokowski-los-angeles/disc1/02.03.%20The%20Planets%3A%20Neptune%2C%20The%20Mystic.mp3" controls />                
        </p>
      </div>

    );
  }
}

function Interpretation(props){
  const genderedCard = props.result[0] && props.result[0].GenderedCard != "Non-specific";
  const ldIntro="<b>Description of the card and its symbols:</b>&nbsp;";
  const LongDescription = props.result[0]? ldIntro + props.result[0].Description : "";
  const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} placement="bottom"/>
    ))      (({ theme }) => ({
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#fff',
        color: 'rgba(0, 0, 0, 0.5)',
        maxWidth: 400,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
      },
    })
    );
  return(
    <div>
      <div id="Interpretation" className={(props.selectedOrdinal) ? 'pVisibleInline':'pHidden'}>
        <div>
          <button id="invertButton" className="pick" 
            onClick={props.handleInversion}
            >Switch to {props.presentation=="Normal"? "reversed": "normal"} presentation
          </button>           
        </div>
        <HtmlTooltip title={(props.result[0]) ? <p className="LongDescription" dangerouslySetInnerHTML={{__html: LongDescription}}></p> : ""} arrow>
          {<img src={(props.result[0]) ? props.result[0].Image : ""}  alt="" id="cardImage" className={props.presentation} />}
          </HtmlTooltip>
          <br/>     
          <div  id="Gendered" className="gendered">
            {genderedCard ? <span>This card also represents the {props.result[0].GenderedCard} gender.</span> : ""} 
          </div>   

        <div  id="NormalInterpretation" className={props.presentation=="Normal"? "pVisibleInline": "pHidden"}>
          Divinatory Meaning&nbsp;:&nbsp;
            {(props.result[0]) ? props.result[0].Title : ""}&nbsp;<strong>(Normal)</strong><br/>
            {(props.result[0]) ? props.result[0].Normal: ""}
        </div> 
        <div  id="ReversedInterpretation" className={props.presentation=="Reversed"? "pVisibleInline": "pHidden"} >
          Divinatory Meaning&nbsp;:&nbsp;
            {(props.result[0]) ? props.result[0].Title : ""}&nbsp;<strong>(Reversed)</strong><br/>
            {(props.result[0]) ? props.result[0].Reversed : ""}
        </div>  


      </div>       
    </div>  
  )
}

function Suits(props){
  return(
    <div id="div-suit-select" className={props.deckComplete?'pHidden':'pVisibleBlock'}>
    <label htmlFor="suit-select">Choose a suit: </label>
    <select name="suits" id="suit-select" value={props.currentSuit} onChange={props.handleSuitChange}>    
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
    <div id="div-ordinal-select" className={props.deckComplete?'pHidden':'pVisibleBlock'}>
    <label htmlFor="ordinal-select">Choose the ordinal:</label>
    <select name="ordinals" id="ordinal-select" default="" value={props.selectedOrdinal} onChange={props.handleOrdinalChange}>
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
function Picked(props){
  return(
    <div>
    {/* EG: The next card shall be ... You have picked x of the 11 cards, so far: */}
    <p>{props.pickedTitle}&nbsp;<i>{props.nextAction}</i>.&nbsp;{props.crossMeaning}</p>
        {props.pickedCards.map((data, key) => {  
          return (
            <div className={"floatedLeft "} key={data.Id} >                
            <div className={"NarrowDiv30pc floatedLeft"} ><img src={data.Image} alt=""  className={data.Presentation=="Normal"? "thumb Normal": "thumb Reversed"}/></div>
            <div className={"NarrowDiv60pc floatedLeft"} >
              <strong title={data.cardStatusDescription}>{data.cardStatus}:</strong>&nbsp;
              <i>{data.Title},&nbsp;({data.Presentation}).</i>&nbsp;
              {data.presentation=="Normal"? data.Normal: data.Reversed}
            </div>
            </div>
          );
        })}
  </div>  
  )
}
function CompleteAtRandom(props){
  return(
    <div  className={(props.deckComplete || props.selectedOrdinal)?'pHidden':'pVisibleBlock'}>
    or: <Button variant="outlined" color="primary" onClick={props.handleFillAtRandom}>
    Randomly Complete the Deck
  </Button>
  </div>
  )
}
function Pick(props){
  return(
    <div id="Pick"  className={props.selectedOrdinal? 'pVisibleInline':'pHidden'}>
      <div id="PickButton">      
      <Button variant="outlined" color="primary" onClick={props.handleCardPicked}>
      Add Card to Deck
    </Button>

      </div>
    </div>
  )
}

function Reset(props) {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleReset = () => {
      setOpen(false);
      props.resetDeck();
    };

  return (
    <div id="div-reset" className={props.pickedCardsLength>0? "clearFloat": "pHidden"}>
      <Button variant="outlined" onClick={handleClickOpen} >
        Reset the Deck 
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The cards you have already picked will be returned to
            the deck so you can start over
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleReset} autoFocus>Reset Deck</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default TarotApp;