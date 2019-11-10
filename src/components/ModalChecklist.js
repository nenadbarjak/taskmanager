import React, { useState, useContext } from 'react';
import { BoardContext } from '../contexts/BoardContext';
import { addChecklistItem, editChecklistItem, deleteChecklistItem } from '../actions/boardActions'

const ModalChecklist = ({ card, boardId }) => {

  const [checklistNote, setCheckListNote] = useState('')
  const { boardsDispatch } = useContext(BoardContext)

  const showInput = () => {
    document.getElementById('checklist-input').style.display = 'block'
    document.getElementById('checklist-button').style.display = 'none'
    document.getElementById('note-input').focus()
  }
  const closeInput = () => {
    document.getElementById('checklist-input').style.display = 'none'
  }

  const handleAddButtonClick = () => {
    document.getElementById('note-input-container').style.display = 'block'
    document.getElementById('add-item-button').style.display = 'none'
    document.getElementById('note-input').focus()
  }

  const handleCheckboxChange = (e, item) => {
    editChecklistItem(boardId, card.listId, card._id, item._id, {finished: e.target.checked}).then((result) => {
      boardsDispatch({
        type: 'EDIT_CHECKLIST_ITEM',
        boardId,
        listId: card.listId,
        cardId: card._id,
        checklistItemId: result.data._id,
        updates: {
          finished: result.data.finished
        }
      })
    })
  }

  const handleChecklistNoteChange = (e, item) => {
    if (!e.target.value) {
      removeItem(item._id)
    } else {
      editChecklistItem(boardId, card.listId, card._id, item._id, {note: e.target.value}).then((result) => {
        boardsDispatch({
          type: 'EDIT_CHECKLIST_ITEM',
          boardId,
          listId: card.listId,
          cardId: card._id,
          checklistItemId: result.data._id,
          updates: {
            note: result.data.note
          }
        })
      })
    }   
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!checklistNote) {
      return
    } else {
      addChecklistItem({
        boardId,
        listId: card.listId,
        cardId: card._id,
        checklistItem: {
          note: checklistNote
        }
      }).then((result) => {
        boardsDispatch({
          type: 'ADD_CHECKLIST_ITEM',
          boardId,
          listId: card.listId,
          cardId: card._id,
          checklistItem: result.data
        })
      }).catch((e) => {
        console.log(e)
      })

      setCheckListNote('')  
    }
  }

  const handleBlur = () => {
    if (!checklistNote && card.checklist.length === 0) {
      closeInput()
      document.getElementById('checklist-button').style.display = 'block'
    } else if (!checklistNote) {
      document.getElementById('note-input-container').style.display = 'none'
      document.getElementById('add-item-button').style.display = 'block'
    } else {
      addChecklistItem({
        boardId,
        listId: card.listId,
        cardId: card._id,
        checklistItem: {
          note: checklistNote
        }
      }).then((result) => {
        boardsDispatch({
          type: 'ADD_CHECKLIST_ITEM',
          boardId,
          listId: card.listId,
          cardId: card._id,
          checklistItem: result.data
        })
      }).catch((e) => {
        console.log(e)
      })
      
      setCheckListNote('') 
      document.getElementById('note-input').focus()
    }
  }

  const removeItem = (itemId) => {
    deleteChecklistItem(boardId, card.listId, card._id, itemId).then((result) => {
      boardsDispatch({
        type: 'REMOVE_CHECKLIST_ITEM',
        boardId,
        listId: card.listId,
        cardId: card._id,
        checklistItemId: result.data._id  
      })
    })
  }

  const finishedChecklistItems = card && card.checklist.filter((item) => {
    return item.finished === true
  })

  const progress = card && Math.round(finishedChecklistItems.length / card.checklist.length * 100)

  return (  
    <div> 
      <div className="checklist-container">
        <div 
          id="checklist-button" 
          style={card.checklist.length > 0 ? {display: 'none'} : {display: 'block'}}
        >
          <button className="checklist-button" onClick={showInput}><span>&#9745; Add checklist</span></button>
        </div>
        <div 
          id="checklist-input" 
          className="checklist-input" 
          style={card.checklist.length > 0 ? {display: 'block'} : {display: 'none'}}
        >
          <h3>Checklist</h3>
          {(card.checklist.length > 0) && 
            <div className="progress">
              <div 
                className="progress-bar" 
                style={{width: `${progress}%`}}
              >
                {progress + '%'}
              </div>
            </div>
          }
          {card.checklist.length > 0 && 
            card.checklist.map((item) => {
              return (
                <div key={item._id} className="checklist-item">
                  <div className="checkbox-container">
                    <input 
                      type="checkbox" 
                      checked={item.finished} 
                      onChange={(e) => handleCheckboxChange(e, item)}
                    />
                  </div>  
                  <div className="checklist-note-input-container">
                    <input 
                      type="text" 
                      value={item.note} 
                      style={item.finished ? ({textDecoration: "line-through"}) : ({})} 
                      className="checklist-note-input" 
                      onChange={(e) => handleChecklistNoteChange(e, item)} 
                    />
                  </div>
                  <div 
                    className="delete-checklist-item" 
                    onClick={() => removeItem(item._id)}
                  >
                    <i className="far fa-trash-alt"></i>
                  </div>
                </div>
              )
            })
          }
          <div id="note-input-container" style={{display: 'block'}}>
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                id="note-input" 
                className="note-input" 
                placeholder=" Add an item" 
                value={checklistNote} 
                onChange={(e) => setCheckListNote(e.target.value)} 
                onBlur={handleBlur} 
              />
            </form>
          </div>
          <button id="add-item-button" className="add-item-button" onClick={handleAddButtonClick}>Add an item</button>
        </div>
      </div>
    </div>
  );
}
 
export default ModalChecklist;