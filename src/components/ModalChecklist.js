import React, { useState, useContext } from 'react';
import uuid from 'uuid/v1'
import '../styles/ModalChecklist.css'
import { BoardContext } from '../contexts/BoardContext';
import { addChecklistItem, editChecklistItem, deleteChecklistItem } from '../actions/boardActions'

const ModalChecklist = ({ card, boardId }) => {

  const [checklistNote, setCheckListNote] = useState('')
  const { boardsDispatch } = useContext(BoardContext)

  const [checklistVisible, setChecklistVisible] = useState(false)
  const [addItemButtonVisible, setAddItemButtonVisible] = useState(true)

  const showChecklist = () => {
    setChecklistVisible(true)
    setAddItemButtonVisible(false)
  }

  const sendErrMsg = () => {
    boardsDispatch({
      type: 'EDIT_BOARD',
      boardId,
      updates: {
        errMsg: 'ERROR! COULD NOT CONNECT TO DATABASE. PLEASE REFRESH THE PAGE AND TRY AGAIN.'
      }
    })
  }

  const sendNewItemData = (note) => {
    const id = uuid()

    boardsDispatch({
      type: 'ADD_CHECKLIST_ITEM',
      boardId,
      listId: card.listId,
      cardId: card.id,
      checklistItem: {
        note,
        id
      }
    })

    addChecklistItem({
      boardId,
      listId: card.listId,
      cardId: card.id,
      checklistItem: {
        note,
        id
      }
    }).then((result) => {
      return
    }).catch((e) => {
      console.log(e)

      sendErrMsg()
    })
  }

  const sendEditItemData = (checklistItemId, updates) => {
    boardsDispatch({
      type: 'EDIT_CHECKLIST_ITEM',
      boardId,
      listId: card.listId,
      cardId: card.id,
      checklistItemId,
      updates
    })
    
    editChecklistItem(boardId, card.listId, card.id, checklistItemId, updates).then((result) => {
      return
    }).catch((e) => {
      console.log(e)

      sendErrMsg()
    })
  }

  const handleCheckboxChange = (e, item) => {
    sendEditItemData(item.id, {finished: e.target.checked})
  }

  const handleChecklistNoteChange = (e, item) => {
    if (!e.target.value) {
      removeItem(item.id)
    } else {

      boardsDispatch({
        type: 'EDIT_CHECKLIST_ITEM',
        boardId,
        listId: card.listId,
        cardId: card.id,
        checklistItemId: item.id,
        updates: {
          note: e.target.value
        }
      })
    }   
  }

  const handleChecklistNoteInputBlur = (e, item) => {
    sendEditItemData(item.id, {note: e.target.value})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!checklistNote) {
      return
    } else {
      sendNewItemData(checklistNote)

      setCheckListNote('')  
    }
  }

  const handleBlur = () => {
    if (!checklistNote && card.checklist.length === 0) {
      setChecklistVisible(false)
    } else if (!checklistNote) {
      setAddItemButtonVisible(true)
    } else {
      sendNewItemData(checklistNote)
      
      setCheckListNote('') 
      document.getElementById('note-input').focus()
    }
  }

  const removeItem = (checklistItemId) => {
    boardsDispatch({
      type: 'REMOVE_CHECKLIST_ITEM',
      boardId,
      listId: card.listId,
      cardId: card.id,
      checklistItemId  
    })

    deleteChecklistItem(boardId, card.listId, card.id, checklistItemId).then((result) => {
      return
    }).catch((e) => {
      console.log(e)

      sendErrMsg()
    })
  }

  const finishedChecklistItems = card && card.checklist.filter((item) => {
    return item.finished === true
  })

  const progress = card && Math.round(finishedChecklistItems.length / card.checklist.length * 100)

  return (  
    <div> 
      <div>
        { card.checklist.length === 0 && !checklistVisible && 
          <div>
            <button className="checklist-button" onClick={showChecklist}><span>&#9745; Add checklist</span></button>
          </div>
        }
        { (checklistVisible || card.checklist.length > 0) && (
          <div>
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
                  <div key={item.id} className="checklist-item">
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
                        onBlur={(e) => handleChecklistNoteInputBlur(e, item)} 
                      />
                    </div>
                    <div 
                      className="delete-checklist-item" 
                      onClick={() => removeItem(item.id)}
                    >
                      <i className="far fa-trash-alt"></i>
                    </div>
                  </div>
                )
              })
            }           
            { addItemButtonVisible ? (
                <button className="add-item-button" onClick={() => setAddItemButtonVisible(false)}>Add an item</button>
              ) : (
                <div>
                  <form onSubmit={handleSubmit}>
                    <input 
                      type="text" 
                      id="note-input"  
                      placeholder=" Add an item" 
                      value={checklistNote} 
                      onChange={(e) => setCheckListNote(e.target.value)} 
                      onBlur={handleBlur} 
                      autoFocus
                    />
                  </form>
                </div>
              )             
            }
          </div>
        )}       
      </div>
    </div>
  );
}
 
export default ModalChecklist;