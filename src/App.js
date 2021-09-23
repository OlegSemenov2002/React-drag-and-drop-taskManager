import React, {useState} from 'react';

import './App.css';

class Board extends React.Component{
  rendrer(){
    return(
      <div className="board">
        <input placeholder="Заголовок списка"/>
        <input type="button"/>
      </div>
    );
  };
}

function App() {
  const [cardList, setCardList] = useState([
    {id: 1, order:3, text: 'КАРТОЧКА 3'},
    {id: 2, order:1, text: 'КАРТОЧКА 1'},
    {id: 3, order:2, text: 'КАРТОЧКА 2'},
    {id: 4, order:4, text: 'КАРТОЧКА 4'},
  ])
  const [currentCard, setCurrentCard] = useState(null);
  function dragStartHandler(e, card){
    console.log('drag', card)
    setCurrentCard(card);
  }
  function dragEndHandler(e){
    e.target.style.background = "white";

  }
  function dragOverHandler(e){
    e.preventDefault();
    e.target.style.background = "grey";

  }
  function dropHandler(e, card){
    e.preventDefault();
    setCardList(cardList.map(c=>{
      if(c.id===currentCard.order){
        return{...c, order:currentCard.order}
      }
      if(c.id === currentCard.order){
        return{...c, order: card.order}
      }

      return c
    }));
    e.target.style.background = "white";
  }
  const  sortCards = (a, b) =>( a.order > b.order ? 1 : -1);
  return (
    <Board />
  );
}

export default App;
