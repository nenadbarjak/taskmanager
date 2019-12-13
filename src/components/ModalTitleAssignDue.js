import React, { useContext, useRef, useState } from 'react';
import moment from 'moment'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select'
import { BoardContext } from '../contexts/BoardContext';
import { editCard } from '../actions/boardActions'

const ModalTitleAssignDue = ({ card, boardId }) => {

  const { boardsDispatch, users } = useContext(BoardContext)

  const [datepickerVisible, setDatepickerVisible] = useState(false)
  const [usersListVisible, setUsersListVisible] = useState(false)

  const user = users.filter((item) => card && item.id === card.assignedTo)[0]
  const usersList = useRef()

  let textColor = 'black'
  if (card && card.dueDate - moment() < 0) {
    textColor = 'red'
  } else if (card && card.dueDate - moment() < 86400000) {
    textColor = 'green'
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

  const sendData = (updates) => {
    boardsDispatch({
      type: 'EDIT_CARD',
      boardId,
      listId: card.listId,
      cardId: card.id,
      updates
    })

    editCard(boardId, card.listId, card.id, updates).then((result) => {
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

  const handleChange = (e) => {
    boardsDispatch({
      type: 'EDIT_CARD',
      boardId,
      listId: card.listId,
      cardId: card.id,
      updates: {
        title: e.target.value
      }
    })  
  }

  const handleBlur = () => {
    sendData({title: card.title})
  }

  const clearDate = (e) => {
    e.stopPropagation()

    sendData({dueDate: null})  
  }

  const handleUserChange = (e) => {
    sendData({assignedTo: e ? e.value : null})
    
    setUsersListVisible(false)
  }

  const unAssignUser = (e) => {
    e.stopPropagation()

    sendData({assignedTo: null})
  }

  return (  
    <div className="modal-title-assigned-due">
      <input 
        type="text" 
        onChange={handleChange} 
        value={card.title} 
        id="title" 
        className="modal-title-input"
        onBlur={handleBlur} 
      />

      <div className="assigned-due-container">
        { usersListVisible ? (
          <div id="users-list">
            <Select
              ref={usersList} 
              options={users.map((user) => ({value: user.id, label: user.firstName + ' ' + user.lastName}))}
              onBlur={() => setUsersListVisible(false)}
              isClearable
              isSearchable
              defaultValue={(card.assignedTo) ? ({value: user.id, label: user.firstName + ' ' + user.lastName}) : (undefined)}
              defaultMenuIsOpen
              onChange={handleUserChange}
              autoFocus
            />
          </div>
          ) : (
          <div 
            className="modal-assigned-to" 
            onClick={() => setUsersListVisible(true)} 
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
        )}
        
        { datepickerVisible ? (
          <div>
            <DatePicker 
              selected={card.dueDate}
              showTimeSelect
              onChange={(date) => sendData({ dueDate: date.getTime() })}
              onBlur={() => setDatepickerVisible(false)}
              autoFocus
            />
          </div>
        ) : (
          <div 
            className="modal-due-date"  
            onClick={() => setDatepickerVisible(true)} 
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
        )}      
      </div>
    </div>
  );
}
 
export default ModalTitleAssignDue;