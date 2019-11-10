import React, { useContext } from 'react';
import { BoardContext } from '../contexts/BoardContext';
import { editCard } from '../actions/boardActions'

const ModalHeader = ({ card, boardId }) => {

  const { boardsDispatch } = useContext(BoardContext)

  const closeModal = () => {
    editCard(boardId, card.listId, card._id, {modalVisible: null}).then((result) => {
      boardsDispatch({
        type: 'EDIT_CARD',
        boardId,
        listId: result.data.listId,
        cardId: result.data._id,  
        updates: {
          modalVisible: result.data.modalVisible
        }
      })
    }).catch((e) => {
      console.log(e)
    })
  }

  const toggleCompleted = () => {
    editCard(boardId, card.listId, card._id, {completed: !card.completed}).then((result) => {
      boardsDispatch({
        type: 'EDIT_CARD',
        boardId,
        listId: result.data.listId,
        cardId: result.data._id,
        updates: {
          completed: result.data.completed
        }
      })
    })
  }

    return (  
        <div className="modal-content-header">
          <div>
            <button 
              onClick={toggleCompleted} 
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
            <span className="close-modal fas fa-times fa-2x" onClick={closeModal}></span>
          </div>
        </div>
    );
}
 
export default ModalHeader;