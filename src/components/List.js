import React, { useRef, useState, useContext } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd'
import ListHeader from './ListHeader'
import AddCardButton from './AddCardButton'
import CardList from './CardList'
import { BoardContext } from '../contexts/BoardContext';
import { addCard } from '../actions/boardActions'

const List = ({ list, index }) => {

  const { boardsDispatch } = useContext(BoardContext)

  const [cardTitle, setCardTitle] = useState()

  const addCardContainer = useRef()
  const inputEl = useRef()
  const openForm = () => {
    addCardContainer.current.style.display = 'block'
    inputEl.current.focus()
  }
  const closeForm = () => {
    addCardContainer.current.style.display = 'none'
    inputEl.current.value = ''
  }

  const handleChange = (e) => {
    setCardTitle(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!cardTitle) {
      closeForm()
    } else {      
      addCard({
        boardId: list.boardId, 
        listId: list._id,
        card: {
          title: cardTitle,
          listId: list._id
        }
      }).then((result) => {
        boardsDispatch({
          type: 'ADD_CARD',
          boardId: list.boardId,
          listId: result.data.listId,
          card: {
            title: result.data.title,
            _id: result.data._id,
            listId: result.data.listId,
            description: result.data.description,
            modalVisible: result.data.modalVisible,
            dueDate: result.data.modalVisible,
            completed: result.data.completed,
            checklist: result.data.checklist,
            assignedTo: result.data.assignedTo
          }
        })
      })
      
      setCardTitle('')
      closeForm()
    }
  }

  const handleBlur = () => {
    if (!cardTitle) {
      closeForm()
    } else {
      addCard({
        boardId: list.boardId, 
        listId: list._id,
        card: {
          title: cardTitle,
          listId: list._id
        }
      }).then((result) => {
        boardsDispatch({
          type: 'ADD_CARD',
          boardId: list.boardId,
          listId: result.data.listId,
          card: {
            title: result.data.title,
            _id: result.data._id,
            listId: result.data.listId,
            description: result.data.description,
            modalVisible: result.data.modalVisible,
            dueDate: result.data.modalVisible,
            completed: result.data.completed,
            checklist: result.data.checklist,
            assignedTo: result.data.assignedTo
          }
        })
      })
      setCardTitle('')
      closeForm()
    }
  }

  return (
    <Draggable draggableId={String(list._id)} index={index}>
      {provided => (
        <div 
          {...provided.draggableProps} 
          ref={provided.innerRef}
          {...provided.dragHandleProps}
        >
          <Droppable droppableId={String(list._id)}>
            {provided => (
              <div 
                {...provided.droppableProps}
                ref={provided.innerRef}
                >
                <ListHeader title={list.title} listId={list._id} boardId={list.boardId} />
                <AddCardButton openForm={openForm} />
                <div>
                  <div ref={addCardContainer} className="add-card-container">
                    <form onSubmit={handleSubmit}>
                      <input ref={inputEl} type="text" onChange={handleChange} className="card-title-input" placeholder="Enter a title for this card" onBlur={handleBlur} />
        
                    </form>
                  </div>
                </div>

                <CardList id={list._id} list={list}/>
                
                
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
 
  );
}
 
export default List;