import React, { useContext } from 'react';
import '../styles/ModalHeader.css'
import { BoardContext } from '../contexts/BoardContext';
import { editCard } from '../actions/boardActions'

const ModalHeader = ({ card, boardId }) => {

  const { boardsDispatch } = useContext(BoardContext)

  const sendErrMsg = () => {
    boardsDispatch({
      type: 'EDIT_BOARD',
      boardId,
      updates: {
        errMsg: 'ERROR! COULD NOT CONNECT TO DATABASE. PLEASE REFRESH THE PAGE AND TRY AGAIN.'
      }
    })
  }

  const sendData = (payload) => {
    boardsDispatch({
      type: 'EDIT_CARD',
      boardId,
      listId: card.listId,
      cardId: card.id,
      updates: payload
    })

    editCard(boardId, card.listId, card.id, payload).then((result) => {
      return
    }).catch((e) => {
      console.log(e)

      sendErrMsg()
    })
  }

  return (  
    <div className="modal-content-header">
      <div>
        <button 
          onClick={() => sendData({ completed: !card.completed })} 
          style={card.completed ? {background: 'green', color: 'white'} : {}} 
          className="mark-complete-button"
        >
          {card.completed ? 
            <span>&#9745; Completed</span> : 
            <span>&#9744; Mark Complete</span>
          }
        </button>
      </div>
      <div>
        <span className="close-modal fas fa-times fa-2x" onClick={() => sendData({ modalVisible: !card.modalVisible })}></span>
      </div>
    </div>
  );
}
 
export default ModalHeader;