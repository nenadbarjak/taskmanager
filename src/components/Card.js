import React, { useContext, useRef } from 'react';
import moment from 'moment'
import { Draggable } from 'react-beautiful-dnd'
import { ListContext } from '../contexts/ListContext'

const Card = ({ task, textColor, finishedChecklistItems, id, index }) => {
  const { listsDispatch, users } = useContext(ListContext) 

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
    return item.id === task.assignedTo
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
    listsDispatch({
      type: 'EDIT_CARD',
      listId: task.listId,
      id: task.id,
      updates: {
        completed: !task.completed
      }
    })
  }
  const deleteCard = (e) => {
    e.stopPropagation()
    listsDispatch({
      type: 'REMOVE_CARD',
      listId: task.listId,
      id: task.id
    })
  }
  const showModal = () => {
    listsDispatch({
      type: 'EDIT_CARD', 
      id: task.id, 
      listId: task.listId, 
      updates: {
        modalVisible: true
      }
    })
  }
  const cardOpacity = task.completed ? 'completed-card' : ''

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
            className={`task-card ${cardOpacity}`}
            onMouseEnter={showCardOptions} 
            onMouseLeave={hideCardOptions} 
          >
            <div className="task-title">{task.completed && <span className="fas fa-check-circle fa-lg" style={{color: 'green'}}></span>}<span className="task-title-text">{task.title}</span></div>
            <div className="task-content"> 
              <div className={task.assignedTo ? "avatar" : "avatar-unassigned"}><div>{task.assignedTo ? user.initials : <i className="far fa-user"></i>}</div></div>
              <div className="due-date" style={{color: `${textColor}`}}>{task.dueDate && moment(task.dueDate).calendar()}</div>
              {task.checklist.length > 0 && <div className="card-progress"><span className="far fa-check-square"></span>{` ${finishedChecklistItems.length} / ${task.checklist.length}`}</div>}
              <div className="card-options" ref={cardOptions}>
                <div className="open-card-options" onClick={showOptionsContent}>
                  <span className="fas fa-ellipsis-h fa-lg"></span>
                </div>
              </div>
            </div>
            <div className="options-content" ref={optionsContent}>
              <div onClick={markComplete}><span>{task.completed ? 'Mark Incomplete' : 'Mark Complete'}</span></div>
              <div onClick={deleteCard}><span style={{color: 'red'}}>Delete Card</span></div>
            </div>
          </div>
        </div>
      )}


    </Draggable>
  );
}
 
export default Card;