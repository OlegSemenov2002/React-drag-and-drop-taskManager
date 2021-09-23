import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {useState} from 'react';

function Heading({onChangeText, headingText, edit, boardId}){
  const [newText, setNewText] = useState(headingText);
  let heading = '';

  const changeText = (e) => {
    setNewText(e.target.value);
  }
  const saveText = (e) => {
    if(!newText)return
    onChangeText(newText, boardId, true);
  }
  const editText = (e) => {
    onChangeText(newText, boardId, false);
  }

  if(edit){
    heading = <div className="header">
      <div  onClick={editText}>{newText}</div>
    </div>

  }if(!edit){
    heading = <div className="header">
      <textarea placeholder="Заголовок списка" onChange={changeText}/>
      <button className="saveButton" onClick={saveText}>Сохранить</button>
    </div>
  }
  return(heading)

}
 // onChangeCard, onDeleteCard, cardComplete  text, edit, cardId, boardId
function Card({onChangeCard, onDeleteCard, onComplite, cardObj, boardId,onDragOver, onDragStart, onDragLeave, onDragEnd, onDrop,  boardObj}){

  const [headingText, setHeadingText] = useState('');
  const [cardText, setCardText] = useState(cardObj.text);
  const [execute, setExecute] = useState(false);
  let card = '';

  const changeText = (e) => {
    setCardText(e.target.value);
  }

  const saveCard = (e) => {
    e.preventDefault();
    onChangeCard(cardText, cardObj.id, true, boardId);
  }

  const deleteCard = (e) =>{
    e.preventDefault();
    onDeleteCard(boardId, cardObj.id);
  }

  const editCard = (e) =>{
    e.preventDefault();
    onChangeCard(cardObj.text, cardObj.id, false, boardId);
  }

  const executeCard = (e) =>{
    onComplite(boardId, cardObj.id, cardObj.complite);
  }
  if(!cardObj.edit){
    card = <div className={!cardObj.complite?"card":"executeCard"}>
      <textarea placeholder = "название карточки"  onChange={changeText}>{cardText}</textarea>
      <button className="saveButton" onClick={saveCard}>Сохранить</button>
    </div>
  }
  if(cardObj.edit){

    card = <div onDragOver={(e)=>onDragOver(e)} onDragStart={(e)=>onDragStart(e, boardObj, cardObj)} onDragLeave={(e)=>onDragLeave(e)}
     onDragEnd={(e)=>onDragEnd(e)} onDrop={(e)=>onDrop(e, boardObj, cardObj)} draggable={true} className={!cardObj.complite?"card":"executeCard"}>
      <div draggable={false} className="cardText" onClick={editCard}>{cardText}</div>
      <button draggable={false} className="executeButton" onClick={executeCard}>☑</button>
      <button draggable={false} className="deleteButton"onClick={deleteCard}>X</button>
    </div>
  }
    return(card);
}

function Board({onDragOver,onDragLeave,onDragEnd,onDrop, onDeleteBoard, onDropCard, onChangeTextHeader, onAddCard, onAddBoard, header, cardsObj, boardObj}){
  function deleteBoard(){
    onDeleteBoard(boardObj.id)
  }
  function changeHeaderText(newText, boardId, edit){
    onChangeTextHeader(newText, boardId, edit)
  }
  function addCard(boardId){
    onAddCard(boardId)
  }
  function addBoard(){

  }
  function dragOverHandler(e,board){
    onDragOver(e,board)
  }
  function dropCardHandler(e,board){
    onDropCard(e,board)
  }
  return(
    <li>
    <button className="boardDel" onClick={deleteBoard}>X</button>
      <div className="board"
      onDragOver={(e)=> dragOverHandler(e)}
      onDrop={(e)=> dropCardHandler(e, boardObj)}>
        <Heading onChangeText={changeHeaderText}
         headerText={boardObj.header.headerText}
         edit={boardObj.header.edit}
         boardId={boardObj.id}/>
         <button className="saveButton" onClick={(e)=>addCard(boardObj.id)}>Добавить</button>
         {cardsObj}
      </div>
    </li>
  )
}
function BoardList({onSaveTable,boardList,form}){
  const [boards, setBoards] = useState(boardList?boardList:[]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [currentCard, setCurrentCard] = useState(null);

  function dragOverHandler(e){
    e.preventDefault();
    if(e.target.className==='cardText'){
      e.target.style.boxShadow = '0 2px 3px gray';
    }

  }
  function dragStartHandler(e, board, card){
      if(e.target.tagName!=='DIV')return
    setCurrentBoard(board);
    setCurrentCard(card);
  }
  function dragLeaveHandler(e){
    e.target.style.boxShadow = 'none';
  }

  function dragEndHandler(e){
    e.target.style.boxShadow = 'none';

  }
  function dropHandler(e, board, item){
    e.preventDefault();

    if(item===board)alert('доска');

    let currentIndex = currentBoard.cards.indexOf(currentCard);
    let dropIndex = board.cards.indexOf(item);
    currentBoard.cards[currentIndex] = item;
    board.cards[dropIndex]=currentCard;
    setBoards([...boards])
    e.target.style.boxShadow="none";
  }
  function dropCardHandler(e, board){
    if(e.target.className!=='board')return
    let index = currentBoard.cards.indexOf(currentCard);
    if(board==currentBoard)index = currentBoard.cards.length--;
    board.cards.push(currentCard);
    currentBoard.cards.splice(index,1);
    setBoards([...boards]);

  }
  function addBoard(){
    setBoards([...boards,{
    id: Math.random().toString(36),
    header:{headerText:'', edit:false},
    cards: []
    }])
  }
  function addCard(boardId){
    let index = boards.map(item=>item.id).indexOf(boardId);
    let newBoards = boards;
    newBoards[index].cards.push({
      id:Math.random().toString(36),
      text:'',
      edit:false,
      complite:false,
    });
    setBoards([...boards]);
  }
  function changeCard(cardText, id, edit, boardId, onSaveTable, tableObj){
    let boardIndex = boards.map(item=>item.id).indexOf(boardId);
    let cardIndex = boards[boardIndex].cards.map(item=>item.id).indexOf(id);
    boards[boardIndex].cards[cardIndex].text = cardText;
    boards[boardIndex].cards[cardIndex].edit = edit;

    setBoards([...boards]);
  }
  function changeHeaderText(newText, boardId, edit){
    let index = boards.map(item=>item.id).indexOf(boardId);
    boards[index].header.headerText = newText;
    boards[index].header.edit = edit;
    setBoards([...boards]);
  }
  function deleteCard(boardId, cardId){
        let boardIndex = boards.map(item=>item.id).indexOf(boardId);
        let newCards = boards[boardIndex].cards.filter(item=>item.id!==cardId);
        boards[boardIndex].cards = newCards;
        setBoards([...boards]);
  }
  function deleteBoard(boardId){
    const conf =  window.confirm(`Вы хотите удалить карту?`);
    if(!conf)return
    let index =  boards.map(item=>item.id).indexOf(boardId);
    let newBoards = boards.filter(item=>item.id!==boardId);
    setBoards([...newBoards]);

  }

  function compliteCard(boardId, cardId, isComplite){
    let boardIndex = boards.map(item=>item.id).indexOf(boardId);
    let cardIndex = boards[boardIndex].cards.map(item=>item.id).indexOf(cardId);
    boards[boardIndex].cards[cardIndex].complite = !isComplite;
    console.log(boards[boardIndex].cards[cardIndex]);
    setBoards([...boards]);
  }
  function saveTable(){
    onSaveTable(form.id, boards)
  }
  return(
    <div className="boards">
      <div className="editTable">
        <p>{form.name}</p>
        <button className="saveTableButton" onClick={saveTable}>Сохранить</button>
        <button className="addNewBoardButton" onClick={addBoard}>Добавить список</button>
      </div>
      <div className="boardsDisplay"  style={{backgroundColor:form.color}}>
      <ul className="boardList">
        {boards.map((board) =>
          <Board
          key={board.id}
          onDragOver={dragOverHandler}
          onDragLeave={dragLeaveHandler}
          onDragEnd={dragEndHandler}

          onDropCard={dropCardHandler}
          onDeleteBoard={deleteBoard}
          onChangeTextHeader={changeHeaderText}
          draggable={false}
          boardObj={board}
          onAddCard={addCard}
          onAddBoard={addBoard}
          cardsObj={board.cards.map(card=>

            <Card className="card"
            key = {card.id}
            cardObj = {card}
            onComplite = {compliteCard}
            onDeleteCard={deleteCard}
            onChangeCard={changeCard}
            boardId={board.id}
            boardObj={board}
            onDragStart={dragStartHandler}
            onDragOver={dragOverHandler}
            onDragLeave={dragLeaveHandler}
            onDragEnd={dragEndHandler}
            onDrop={dropHandler}
            draggable={true}
            />

          )}
          />
        )}
      </ul>
      </div>
    </div>
  )
}

function MainHeader({onChangeName}){
  function changeMain(changeName){
    onChangeName(changeName)
  }
  return(
    <div className="navList">
     <ul>
        <li onClick={(e)=>changeMain('myWorks')}>Мои рабочие места</li>
        <li onClick={(e)=>changeMain('createNewWork')}>Создать</li>
     </ul>
     <hr/>
   </div>

  )
}
function TableForm({onSaveForm}){
  let tableName = '';
  let tableColor = 'white';
  const [chooseList, setChooseList] = useState([
    {color:'Red', isChoose:false},
     {color:'Blue', isChoose:false},
     {color:'Yellow', isChoose:false},
     {color:'Green', isChoose:false},
     {color:'White', isChoose:true},
     {color:'Orange', isChoose:false},
     {color:'Purple', isChoose:false},
     {color:'Brown', isChoose:false}])
  const [chooseForm, setChooseForm] = useState({
    id:Math.random().toString(36),
    color: tableColor,
    name:'',
    saved:false,
  });

  function chooseColor(e){
    let index = chooseList.map(item=>item.color).indexOf(e.target.textContent);
    chooseList.forEach(item=>item.isChoose=false);
    chooseList[index].isChoose=true;
    setChooseList([...chooseList]);
    setChooseForm(state=>{
      return {id: state.id, color:e.target.textContent, name:state.name, saved:false}
    })
  }

  function changeTableName(e){
    setChooseForm(state=>{
      return {id:state.id, color:state.color, name:e.target.value, saved:false}
    })

  }
  function saveForm(){
    if(!chooseForm.name){alert('Введите название рабочего места.'); return}
    setChooseForm(state=>{
      return {id:state.id, color:state.color, name:state.name, saved:true}
    });
    onSaveForm(chooseForm);
    alert('Рабочее место создано!');
  }

  if(chooseForm.save)return;

    let form = <div className="createTable">
    <input className="createInput" onChange={changeTableName} placeholder="Название рабочего места"/>
    <p>Цвет рабочего места:</p>
    <ul className="chooseList">
        {chooseList.map(item=>{
          return <li className={'choose'+item.color} style={{border:item.isChoose?'2px solid #404040':'2px solid white'}}onClick={chooseColor}>{item.color}</li>
        })}
      </ul>
    <button className="formButton" onClick={saveForm}>☑</button>
    </div>;

    if(chooseForm.saved){
      form='';
    }
  return(form);

}

function Main(){
  const [tableList, setTableList] = useState([]);
  const [main, setMain] = useState('');
  function handleChangeMain(changeName){
    if(changeName==='myWorks'){
      setMain(<MyBoards onShowTable={showTable} boardList={tableList}/>);
    }
    if(changeName==='createNewWork'){
      setMain(<TableForm onSaveForm={saveTableForm}/>);
    }
  }
  function showTable(tableId){
    let tableIndex = tableList.map(item=>item.id).indexOf(tableId);
    setMain(<BoardList boardList={tableList[tableIndex].boardList} form={tableList[tableIndex]} onSaveTable={saveTable}/>)

  }
  function saveTableForm(tableObj){
    tableList.push({
      id:tableObj.id,
      name: tableObj.name,
      color:tableObj.color,
      edit:tableObj.edit,
      boardList:[],
    });
    setTableList([...tableList]);

    setMain(<BoardList form={tableObj} onSaveTable={saveTable}/>);
  }
  function saveTable(tableId, boardList){

    let index = tableList.map(item=>item.id).indexOf(tableId);
    tableList[index].boardList = boardList;
    setTableList([...tableList]);
    console.log(tableList);
  }

  return(
    <div className="main">
      <MainHeader onChangeName={handleChangeMain}/>
      {main}
    </div>
  )
}
function MyBoards({boardList, onShowTable}){
  function showTable(boardId){
    onShowTable(boardId);
  }
  return(
    <div className="myBoards">
       <ul className="myBoardsList">
        {boardList.map(board=>{
          return <li key={board.id} style={{backgroundColor:board.color}} onClick={e=>showTable(board.id)}>
            <div className="miniBoard"id={board.name}>
              {board.name}
            </div>
          </li>
        })}
       </ul>
    </div>
  );
}


ReactDOM.render(
  <Main />,
  document.getElementById('root')
);

reportWebVitals();
