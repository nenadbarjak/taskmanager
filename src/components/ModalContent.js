import React, { useContext, useState, useRef   } from 'react';
import Modal from 'react-modal'
import moment from 'moment'
import uuid from 'uuid/v1'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select'
import { ListContext } from '../contexts/ListContext';


const ModalContent = () => {

  const { lists, listsDispatch, users } = useContext(ListContext)

  const usedLists = [...lists]

  const listContainingTask = usedLists.filter((list) => {
    const task = list && list.tasks && list.tasks.find((elem) => {
      return elem.modalVisible
    })
    return task 
  })

  const task = listContainingTask && listContainingTask.length > 0 && listContainingTask[0].tasks.filter((item) => item.modalVisible === true)[0]

  const user = users.filter((item) => task && item.id === task.assignedTo)[0]

  const [checklistNote, setCheckListNote] = useState('')

  const usersList = useRef()

  let textColor = 'black'
  if (task && task.dueDate - moment() < 0) {
    textColor = 'red'
  } else if (task && task.dueDate - moment() < 86400000) {
    textColor = 'green'
  }
  
  const handleChange = (e) => {
    listsDispatch({
      type: 'EDIT_CARD',
      id: task.id,
      listId: task.listId,
      updates: {
        [e.target.id]: e.target.value
      }
    })
  }
  const handleCheckboxChange = (item) => {
    listsDispatch({
      type: 'EDIT_CARD', 
      id: task.id,
      listId: task.listId, 
      updates: {
        checklist: task.checklist.map((elem) => {
          if (elem.id === item.id) { 
            return {
              ...elem,
              finished: !elem.finished
            }
          } else {
          return elem
          }
        })
      }
    })
  }
  const handleChecklistNoteChange = (e, item) => {
    listsDispatch({
      type: 'EDIT_CARD', 
      id: task.id,
      listId: task.listId, 
      updates: {
        checklist: task.checklist.map((elem) => {
          if (elem.id === item.id) { 
            return {
              ...elem,
              note: e.target.value
            }
          } else {
          return elem
          }
        })
      }
    })
  }

  const showInput = () => {
    document.getElementById('checklist-input').style.display = 'block'
    document.getElementById('checklist-button').style.display = 'none'
    document.getElementById('note-input').focus()
  }
  const closeInput = () => {
    document.getElementById('checklist-input').style.display = 'none'
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!checklistNote) {
      return
    } else {
      listsDispatch({
        type: 'EDIT_CARD',
        id: task.id,
        listId: task.listId,
        updates: {
          checklist: [
            ...task.checklist,
            {note: checklistNote, id: uuid(), finished: false}
          ]
        }
      })
      setCheckListNote('')  
    }
  }
  const handleBlur = () => {
    if (!checklistNote && task.checklist.length === 0) {
      closeInput()
      document.getElementById('checklist-button').style.display = 'block'
    } else if (!checklistNote) {
      document.getElementById('note-input-container').style.display = 'none'
      document.getElementById('add-item-button').style.display = 'block'
    } else {
      listsDispatch({
        type: 'EDIT_CARD',
        id: task.id,
        listId: task.listId,
        updates: {
          checklist: [
            ...task.checklist,
            {note: checklistNote, id: uuid(), finished: false}
          ]
        }
      })
      setCheckListNote('') 
      document.getElementById('note-input').focus()
    }
  }
  const handleAddButtonClick = () => {
    document.getElementById('note-input-container').style.display = 'block'
    document.getElementById('add-item-button').style.display = 'none'
    document.getElementById('note-input').focus()
  }
  
  const removeItem = (taskId, itemId) => {
    listsDispatch({
      type: 'REMOVE_CHECKLIST_ITEM',
      id: taskId,
      listId: task.listId,
      itemId
    })
  }

  const showDatePicker = () => {
    document.getElementById('due-date').style.display = 'none'
    document.getElementById('datepicker').style.display = 'block'
    document.getElementById('date-input').focus()
  }
  const closeDatePicker = () => {
    document.getElementById('due-date').style.display = 'flex'
    document.getElementById('datepicker').style.display = 'none'
  }
  const showUsersList = () => {
    document.getElementById('assigned-to').style.display = 'none'
    document.getElementById('users-list').style.display = 'block'
    usersList.current.focus()
  }
  const closeUsersList = () => {
    document.getElementById('assigned-to').style.display = 'flex'
    document.getElementById('users-list').style.display = 'none'
  }

  const changeDate = (date, id) => {
    listsDispatch({
      type: 'EDIT_CARD',
      id,
      listId: task.listId,
      updates: {
        dueDate: date
      }
    })
  }

  const handleUserChange = (e) => {
    listsDispatch({
      type: 'EDIT_CARD',
      id: task.id,
      listId: task.listId,
      updates: {
        assignedTo: e ? (e.value) : (undefined)
      }
    })
    closeUsersList()
  }
  const showUnassignButton = () => {
    const unassignButton = document.getElementById('unassign-button')
    if (unassignButton) {
      unassignButton.style.visibility = 'visible'
    }
  }
  const hideUnassignButton = () => {
    const unassignButton = document.getElementById('unassign-button')
    if (unassignButton) {
      unassignButton.style.visibility = 'hidden'
    }
  }
  const unAssignUser = (e) => {
    e.stopPropagation()
    listsDispatch({
      type: 'EDIT_CARD',
      id: task.id,
      listId: task.listId,
      updates: {
        assignedTo: undefined
      }
    })
  }

  const clearDate = (e) => {
    e.stopPropagation() 
    listsDispatch({
      type: 'EDIT_CARD',
      id: task.id,
      listId: task.listId,
      updates: {
        dueDate: undefined
      }
    })
  }
  const showClearDateButton = () => {
    const clearDateButton = document.getElementById('cleardate-button')
    if (clearDateButton) {
      clearDateButton.style.visibility = 'visible'
    }
  }
  const hideCLearDateButton = () => {
    const clearDateButton = document.getElementById('cleardate-button')
    if (clearDateButton) {
      clearDateButton.style.visibility = 'hidden'
    }
  }

  const finishedChecklistItems = task && task.checklist.filter((item) => {
    return item.finished === true
  })

  const progress = task && Math.round(finishedChecklistItems.length / task.checklist.length * 100)
  
  return (
   
    <Modal
      isOpen={task && task.modalVisible}
      onRequestClose={() => listsDispatch({type: 'EDIT_CARD', id: task.id, listId: task.listId, updates: {modalVisible: false}})}
      className="task-modal"
      overlayClassName="task-modal-overlay"
    >
      {task && task.modalVisible && <div className="modal-content">
        <div className="modal-content-header">
          <div>
            <button onClick={() => listsDispatch({type: 'EDIT_CARD', id: task.id, listId: task.listId, updates: {completed: !task.completed}})} style={task.completed ? {background: 'green', color: 'white'} : {}} className="mark-complete-button">{task.completed ? <span>&#9745; Completed</span> : <span>&#9744; Mark Complete</span>}</button>
          </div>
          <div>
            <span className="close-modal fas fa-times fa-2x" onClick={() => listsDispatch({type: 'EDIT_CARD', id: task.id, listId: task.listId, updates: {modalVisible: false}})}></span>
          </div>
        </div>
        <div className="modal-title-assigned-due">
          <input type="text" onChange={handleChange} value={task.title} id="title" className="modal-title-input" />
          <div className="assigned-due-container">
            <div id="assigned-to" className="modal-assigned-to" onClick={showUsersList} onMouseEnter={showUnassignButton} onMouseLeave={hideUnassignButton  }>
              <div className={task.assignedTo ? "avatar" : "avatar-unassigned"}><div>{task.assignedTo ? user.initials : <i className="far fa-user"></i>}</div></div>
              <div><span>{task.assignedTo ? `Assigned to: ${user.firstName} ${user.lastName}` : 'Unassigned'}</span></div>
              {task.assignedTo && <div className="unassign-cleardate" id="unassign-button" onClick={unAssignUser}><span className="fas fa-times-circle fa-lg"></span></div>}
            </div>
            <div id="users-list">
              <Select
                ref={usersList} 
                options={users.map((user) => ({value: user.id, label: user.firstName + ' ' + user.lastName}))}
                onBlur={closeUsersList}
                isClearable
                isSearchable
                defaultValue={(task.assignedTo) ? ({value: user.id, label: user.firstName + ' ' + user.lastName}) : (undefined)}
                defaultMenuIsOpen
                onChange={handleUserChange}
              />
            </div>
            <div className="modal-due-date" id="due-date" onClick={showDatePicker} onMouseEnter={showClearDateButton} onMouseLeave={hideCLearDateButton}>
              <div className="calendar-icon"><span className="far fa-calendar"></span></div>
              <div><span>Due Date: </span></div>
              <div><span style={{color: `${textColor}`}}> {task.dueDate && moment(task.dueDate).calendar()}</span></div>
              {task.dueDate && <div className="unassign-cleardate" id="cleardate-button" onClick={clearDate}><span className="fas fa-times-circle fa-lg"></span></div>}
            </div>
            <div id="datepicker">
              <DatePicker id="date-input"
                selected={task.dueDate}
                showTimeSelect
                onChange={(date) => changeDate(date, task.id)}
                onBlur={closeDatePicker}
              />
            </div>
          </div>
        </div>
        <div className="modal-description">
          <div>
            <h3>Description</h3>
          </div>
          <textarea onChange={handleChange} id="description" className="task-description-input" value={task.description} placeholder="Add a more detailed description..."></textarea>
        </div>
        <div> 
          <div className="checklist-container">
            <div 
              id="checklist-button" 
              style={task.checklist.length > 0 ? {display: 'none'} : {display: 'block'}}
            >
              <button className="checklist-button" onClick={showInput}><span>&#9745; Add checklist</span></button>
            </div>
            <div 
              id="checklist-input" 
              className="checklist-input" 
              style={task.checklist.length > 0 ? {display: 'block'} : {display: 'none'}}
            >
              <h3>Checklist</h3>
              {(task.checklist.length > 0) && <div className="progress">
                <div className="progress-bar" style={{width: `${progress}%`}}>{progress + '%'}</div>
              </div>}
              {(task.checklist.length > 0) && task.checklist.map((item) => {
                return (
                  <div key={item.id} className="checklist-item">
                    <div className="checkbox-container">
                      <input type="checkbox" checked={item.finished} onChange={() => handleCheckboxChange(item)}/>
                    </div>  
                    <div className="checklist-note-input-container">
                      <input type="text" value={item.note} style={item.finished ? ({textDecoration: "line-through"}) : ({})} className="checklist-note-input" onChange={(e) => handleChecklistNoteChange(e, item)} />
                    </div>
                    <div className="delete-checklist-item" onClick={() => removeItem(task.id, item.id)}>
                      <i className="far fa-trash-alt"></i>
                    </div>
                  </div>
                )
              })}
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

      </div>}
    </Modal>
  );
}
 
export default ModalContent;