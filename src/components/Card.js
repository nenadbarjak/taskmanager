import React, { useContext, useRef } from 'react';
import moment from 'moment'
import { Draggable } from 'react-beautiful-dnd'
import { BoardContext } from '../contexts/BoardContext'
import { editCard, deleteCard } from '../actions/boardActions'

const Card = ({ boardId, card, textColor, finishedChecklistItems, id, index }) => {
  const { boardsDispatch, users } = useContext(BoardContext) 

  const optionsContent = useRef()
  const showOptionsContent = (e) => {
    e.stopPropagation()
    optionsContent.current.style.display = 'flex'

    const closeOptionsContent = (e) => {
      if (!e.target.matches('.card-options')) {
         if (optionsContent.current) {optionsContent.current.style.display = 'none'}
        document.removeEventListener('click', closeOptionsContent)
      }
    }
    document.addEventListener('click', closeOptionsContent)
  }

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

  const markComplete = (e) => {
    e.stopPropagation()

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
    }).catch((e) => {
      console.log(e)
    })
    
  }

  const handleDelete = (e) => {
    e.stopPropagation()

    deleteCard(boardId, card.listId, card._id).then((result) => {
      boardsDispatch({
        type: 'REMOVE_CARD',
        boardId,
        listId: result.data.listId,
        cardId: result.data._id
      })
    }).catch((err) => {
      console.log(err)
    })    
  }

  const showModal = () => {
    editCard(boardId, card.listId, card._id, {modalVisible: true}).then((result) => {
      boardsDispatch({
        type: 'EDIT_CARD',
        boardId,
        listId: result.data.listId,
        cardId: result.data._id,          
        updates: {
          modalVisible: result.data.modalVisible
        }
      })
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
            <div className="card-title">{card.completed && <span className="fas fa-check-circle fa-lg" style={{color: 'green'}}></span>}<span className="card-title-text">{card.title}</span></div>
            <div className="card-content"> 
              <div className={card.assignedTo ? "avatar" : "avatar-unassigned"}><div>{card.assignedTo ? user.initials : <i className="far fa-user"></i>}</div></div>
              <div className="due-date" style={{color: `${textColor}`}}>{card.dueDate && moment(card.dueDate).calendar()}</div>
              {card.checklist.length > 0 && <div className="card-progress"><span className="far fa-check-square"></span>{` ${finishedChecklistItems.length} / ${card.checklist.length}`}</div>}
              <div className="card-options" ref={cardOptions}>
                <div className="open-card-options" onClick={showOptionsContent}>
                  <span className="fas fa-ellipsis-h fa-lg"></span>
                </div>
              </div>
            </div>
            <div className="options-content" ref={optionsContent}>
              <div onClick={markComplete}><span>{card.completed ? 'Mark Incomplete' : 'Mark Complete'}</span></div>
              <div onClick={handleDelete}><span style={{color: 'red'}}>Delete Card</span></div>
            </div>
          </div>
        </div>
      )}


    </Draggable>
  );
}
 
export default Card;