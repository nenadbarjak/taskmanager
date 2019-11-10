import React, { useContext } from 'react';
import { BoardContext } from '../contexts/BoardContext';
import { editCard } from '../actions/boardActions'


const ModalDescription = ({ card, boardId }) => {
  const { boardsDispatch } = useContext(BoardContext)

  const handleChange = (e) => {
    editCard(boardId, card.listId, card._id, {description: e.target.value}).then((result) => {
      boardsDispatch({
        type: 'EDIT_CARD',
        boardId,
        listId: result.data.listId,
        cardId: result.data._id,
        updates: {
          description: result.data.description
        }
      })
    }).catch((e) => {
      console.log(e)
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
        placeholder="Add a more detailed description...">
      </textarea>
    </div>
  );
}
 
export default ModalDescription;