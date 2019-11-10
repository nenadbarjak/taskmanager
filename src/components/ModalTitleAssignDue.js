import React, { useContext, useRef } from 'react';
import moment from 'moment'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select'
import { BoardContext } from '../contexts/BoardContext';
import { editCard } from '../actions/boardActions'

const ModalTitleAssignDue = ({ card, boardId }) => {

  const { boardsDispatch, users } = useContext(BoardContext)

  const user = users.filter((item) => card && item.id === card.assignedTo)[0]
  const usersList = useRef()

  let textColor = 'black'
  if (card && card.dueDate - moment() < 0) {
    textColor = 'red'
  } else if (card && card.dueDate - moment() < 86400000) {
    textColor = 'green'
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

  const handleChange = (e) => {
    editCard(boardId, card.listId, card._id, {title: e.target.value}).then((result) => {
      boardsDispatch({
        type: 'EDIT_CARD',
        boardId,
        listId: result.data.listId,
        cardId: result.data._id,
        updates: {
          title: result.data.title
        }
      })
    }).catch((e) => {
      console.log(e)
    })   
  }

  const changeDate = (date, id) => {
    editCard(boardId, card.listId, id, {dueDate: date.getTime()}).then((result) => {
      boardsDispatch({
        type: 'EDIT_CARD',
        boardId,
        listId: result.data.listId,
        cardId: result.data._id,
        updates: {
          dueDate: result.data.dueDate
        }
      })
    }).catch((e) => {
      console.log(e)
    })    
  }

  const clearDate = (e) => {
    e.stopPropagation()
    
    editCard(boardId, card.listId, card._id, {dueDate: null}).then((result) => {
      boardsDispatch({
        type: 'EDIT_CARD',
        boardId,
        listId: result.data.listId,
        cardId: result.data._id,
        updates: {
          dueDate: result.data.dueDate
        }
      })
    }).catch((e) => {
      console.log(e)
    })  
  }

  const handleUserChange = (e) => {
    editCard(boardId, card.listId, card._id, {assignedTo: e ? e.value : null}).then((result) => {
      boardsDispatch({
        type: 'EDIT_CARD',
        boardId,
        listId: result.data.listId,
        cardId: result.data._id,
        updates: {
          assignedTo: result.data.assignedTo
        }
      })
    })
    
    closeUsersList()
  }

  const unAssignUser = (e) => {
    e.stopPropagation()

    editCard(boardId, card.listId, card._id, {assignedTo: null}).then((result) => {
      boardsDispatch({
        type: 'EDIT_CARD',
        boardId,
        listId: result.data.listId,
        cardId: result.data._id,
        updates: {
          assignedTo: result.data.assignedTo
        }
      })
    }).catch((e) => {
      console.log(e)
    })
  }

  return (  
    <div className="modal-title-assigned-due">
      <input 
        type="text" 
        onChange={handleChange} 
        value={card.title} 
        id="title" 
        className="modal-title-input" 
      />

      <div className="assigned-due-container">
        <div 
          id="assigned-to" 
          className="modal-assigned-to" 
          onClick={showUsersList} 
          onMouseEnter={showUnassignButton} 
          onMouseLeave={hideUnassignButton}
        >
          <div className={card.assignedTo ? "avatar" : "avatar-unassigned"}>
            <div>
              {card.assignedTo ? user.initials : <i className="far fa-user"></i>}
            </div>
          </div>
          <div>
            <span>{card.assignedTo ? `Assigned to: ${user.firstName} ${user.lastName}` : 'Unassigned'}</span>
          </div>
          {card.assignedTo && 
            <div 
              className="unassign-cleardate" 
              id="unassign-button" 
              onClick={unAssignUser}
            >
              <span className="fas fa-times-circle fa-lg"></span>
            </div>
          }
        </div>

        <div id="users-list">
          <Select
            ref={usersList} 
            options={users.map((user) => ({value: user.id, label: user.firstName + ' ' + user.lastName}))}
            onBlur={closeUsersList}
            isClearable
            isSearchable
            defaultValue={(card.assignedTo) ? ({value: user.id, label: user.firstName + ' ' + user.lastName}) : (undefined)}
            defaultMenuIsOpen
            onChange={handleUserChange}
          />
        </div>

        <div 
          className="modal-due-date" 
          id="due-date" 
          onClick={showDatePicker} 
          onMouseEnter={showClearDateButton} 
          onMouseLeave={hideCLearDateButton}
        >
          <div className="calendar-icon">
            <span className="far fa-calendar"></span>
          </div>
          <div>
            <span>Due Date: </span>
          </div>
          <div>
            <span style={{color: `${textColor}`}}> {card.dueDate && moment(card.dueDate).calendar()}</span>
          </div>
          {card.dueDate && 
            <div 
              className="unassign-cleardate" 
              id="cleardate-button" 
              onClick={clearDate}
            >
              <span className="fas fa-times-circle fa-lg"></span>
            </div>
          }
        </div>

        <div id="datepicker">
          <DatePicker id="date-input"
            selected={card.dueDate}
            showTimeSelect
            onChange={(date) => changeDate(date, card._id)}
            onBlur={closeDatePicker}
          />
        </div>
      </div>
    </div>
  );
}
 
export default ModalTitleAssignDue;