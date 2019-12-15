import React, { useContext, useRef, useState, useEffect } from 'react';
import moment from 'moment'
import { Draggable } from 'react-beautiful-dnd'
import '../styles/Card.css'
import { BoardContext } from '../contexts/BoardContext'
import { editCard, deleteCard } from '../actions/boardActions'

const Card = ({ boardId, card, textColor, finishedChecklistItems, id, index }) => {
  const { boardsDispatch, users } = useContext(BoardContext) 

  const [optionsVisible, setOptionsVisible] = useState(false)

  const optionsContent = useRef()

  const showOptionsContent = (e) => {
    e.stopPropagation()
    
    setOptionsVisible(true)
  }

  const closeOptionsContent = (e) => {
    if (optionsContent.current && !optionsContent.current.contains(e.target)) {
      setOptionsVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', closeOptionsContent)

    return () => document.removeEventListener('mousedown', closeOptionsContent)
  })

  let user = users.filter((item) => {
    return item.id === card.assignedTo
  })[0]

  const cardOptions = useRef()

  const showCardOptions = () => {
    cardOptions.current.style.visibility = 'visible'
  }

  const hideCardOptions = () => {
    cardOptions.current.style.visibility = 'hidden'
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

  const markComplete = (e) => {
    e.stopPropagation()

    boardsDispatch({
      type: 'EDIT_CARD',
      boardId,
      listId: card.listId,
      cardId: card.id,
      updates: {
        completed: !card.completed
      }
    })
    editCard(boardId, card.listId, card.id, {completed: !card.completed}).then((result) => {
      return
    }).catch((e) => {
      console.log(e)

      sendErrMsg()
    })

    setOptionsVisible(false)
  }

  const handleDelete = (e) => {
    e.stopPropagation()

    boardsDispatch({
      type: 'REMOVE_CARD',
      boardId,
      listId: card.listId,
      cardId: card.id
    })

    deleteCard(boardId, card.listId, card.id).then((result) => {
      return
    }).catch((e) => {
      console.log(e)

      sendErrMsg()
    })  
  }

  const showModal = () => {
    boardsDispatch({
      type: 'EDIT_CARD',
      boardId,
      listId: card.listId,
      cardId: card.id,
      updates: {
        modalVisible: !card.modalVisible
      }
    })


    editCard(boardId, card.listId, card.id, {modalVisible: true}).then((result) => {
      return
    }).catch((e) => {
      console.log(e)
      
      sendErrMsg()
    }) 
  }

  const cardOpacity = card.completed ? 'completed-card' : ''

  return (
    <Draggable draggableId={String(id)} index={index}>
      {provided => (
        <div 
          className="card-container" 
          
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >  
          <div 
            onClick={showModal}
            className={`card ${cardOpacity}`}
            onMouseEnter={showCardOptions} 
            onMouseLeave={hideCardOptions} 
          >
            <div className="card-title">
              {card.completed && 
                <span className="fas fa-check-circle fa-lg" style={{color: 'green'}}></span>
              }
              <span className="card-title-text">{card.title}</span>
            </div>
            <div className="card-content"> 
              <div className={card.assignedTo ? "avatar" : "avatar-unassigned"}>
                <div>
                  {card.assignedTo ? user.initials : <i className="far fa-user"></i>}
                </div>
              </div>
              <div className="due-date" style={{color: `${textColor}`}}>
                {card.dueDate && moment(card.dueDate).calendar()}
              </div>
              {card.checklist.length > 0 && 
                <div className="card-progress">
                  <span className="far fa-check-square"></span>
                  {` ${finishedChecklistItems.length} / ${card.checklist.length}`}
                </div>
              }
              <div className="card-options" ref={cardOptions}>
                <div className="open-card-options" onClick={showOptionsContent}>
                  <span className="fas fa-ellipsis-h fa-lg"></span>
                </div>
              </div>
            </div>
            { optionsVisible && (
              <div className="options-content" ref={optionsContent}>
                <div onClick={markComplete}>
                  <span>{card.completed ? 'Mark Incomplete' : 'Mark Complete'}</span>
                </div>
                <div onClick={handleDelete}>
                  <span style={{color: 'red'}}>Delete Card</span>
                </div>
              </div>
            )}            
          </div>
        </div>
      )}
    </Draggable>
  );
}
 
export default Card;