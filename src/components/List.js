import React, { useRef, useState, useContext } from 'react';
import uuid from 'uuid/v1'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import ListHeader from './ListHeader'
import AddCardButton from './AddCardButton'
import CardList from './CardList'
import { ListContext } from '../contexts/ListContext';

const List = ({ list, index }) => {

  const { listsDispatch } = useContext(ListContext)

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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!cardTitle) {
      closeForm()
    } else {
      listsDispatch({
        type: 'ADD_CARD',
        task: {
          title: cardTitle,
          id: uuid(),
          listId: list.id,
          description: '',
          modalVisible: false,
          dueDate: undefined,
          completed: false,
          checklist: [],
          assignedTo: undefined
        }
      })
      setCardTitle('')
      closeForm()
    }
  }

  const handleBlur = () => {
    if (!cardTitle) {
      closeForm()
    } else {
      listsDispatch({
        type: 'ADD_CARD',
        task: {
          title: cardTitle,
          id: uuid(),
          listId: list.id,
          description: '',
          modalVisible: false,
          dueDate: undefined,
          completed: false,
          checklist: [],
          assignedTo: undefined
        }
      })
      setCardTitle('')
      closeForm()
    }
  }

  return (
    <Draggable draggableId={String(list.id)} index={index}>
      {provided => (
        <div 
          {...provided.draggableProps} 
          ref={provided.innerRef}
          {...provided.dragHandleProps}
        >
          <Droppable droppableId={String(list.id)}>
            {provided => (
              <div 
                {...provided.droppableProps}
                ref={provided.innerRef}
                >
                <ListHeader title={list.title} id={list.id} />
                <AddCardButton openForm={openForm} />
                <div>
                  <div ref={addCardContainer} className="add-card-container">
                    <form onSubmit={handleSubmit}>
                      <input ref={inputEl} type="text" onChange={handleChange} className="card-title-input" placeholder="Enter a title for this card" onBlur={handleBlur} />
        
                    </form>
                  </div>
                </div>

                <CardList id={list.id} list={list}/>
                
                
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