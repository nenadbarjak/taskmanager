import React, { useContext } from 'react';
import { BoardContext } from '../contexts/BoardContext';
import { editCard } from '../actions/boardActions'


const ModalDescription = ({ card, boardId }) => {
  const { boardsDispatch } = useContext(BoardContext)

  const handleChange = (e) => {
    boardsDispatch({
      type: 'EDIT_CARD',
      boardId,
      listId: card.listId,
      cardId: card.id,
      updates: {
        description: e.target.value
      }
    })   
  }

  const handleBlur = () => {
    editCard(boardId, card.listId, card.id, {description: card.description}).then((result) => {
      return
    }).catch((e) => {
      console.log(e)

      boardsDispatch({
        type: 'EDIT_BOARD',
        boardId,
        updates: {
          errMsg: 'ERROR! COULD NOT CONNECT TO DATABASE. PLEASE REFRESH THE PAGE AND TRY AGAIN.'
        }
      })
    })
  }

  return (  
    <div className="modal-description">
      <div>
        <h3>Description</h3>
      </div>
      <textarea 
        onChange={handleChange} 
        id="description" 
        className="card-description-input" 
        value={card.description} 
        placeholder="Add a more detailed description..."
        onBlur={handleBlur}
      >
      </textarea>
    </div>
  );
}
 
export default ModalDescription;