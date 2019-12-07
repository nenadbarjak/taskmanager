import React, { useRef, useState, useContext } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd'
import uuid from 'uuid/v1'
import moment from 'moment'
import ListHeader from './ListHeader'
import AddCardButton from './AddCardButton'
import Card from './Card'
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

  const sendData = (title) => {
    const id = uuid()

    boardsDispatch({
      type: 'ADD_CARD',
      boardId: list.boardId,
      listId: list.id,
      card: {
        title,
        id,
        listId: list.id,
        description: '',
        modalVisible: false,
        dueDate: undefined,
        completed: false,
        assignedTo: undefined,
        checklist: []
      }
    })

    addCard({
      boardId: list.boardId,
      listId: list.id,
      card: {
        title,
        id,
        listId: list.id
      }
    }).then((result) => {
      return
    }).catch((e) => {
      console.log(e)
      boardsDispatch({
        type: 'EDIT_BOARD',
        boardId: list.boardId,
        updates: {
          errMsg: 'ERROR! COULD NOT CONNECT TO DATABASE. PLEASE REFRESH THE PAGE AND TRY AGAIN.'
        }
      })
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!cardTitle) {
      closeForm()
    } else {
      sendData(cardTitle)     
      
      setCardTitle('')
      closeForm()
    }
  }

  const handleBlur = () => {
    if (!cardTitle) {
      closeForm()
    } else {
      sendData(cardTitle) 

      setCardTitle('')
      closeForm()
    }
  }

  return (
    <Draggable draggableId={String(list.id)} index={index}>
      {provided => (
        <div
          className="list-column"
        
          {...provided.draggableProps} 
          ref={provided.innerRef}
          {...provided.dragHandleProps}
        >
          <Droppable droppableId={String(list.id)}>
            {provided => (
              <div
                style={{height: '100%'}} 
                {...provided.droppableProps}
                ref={provided.innerRef}
                >
                <ListHeader title={list.title} listId={list.id} boardId={list.boardId} />
                <AddCardButton openForm={openForm} />
                <div>
                  <div ref={addCardContainer} className="add-card-container">
                    <form onSubmit={handleSubmit}>
                      <input ref={inputEl} type="text" onChange={handleChange} className="card-title-input" placeholder="Enter a title for this card" onBlur={handleBlur} />
        
                    </form>
                  </div>
                </div>

                {
                  list.cards.map((card, index) => {
                    let textColor = 'black'
                    if (card.dueDate - moment() < 0) {
                      textColor = 'red'
                    } else if (card.dueDate - moment() < 86400000) {
                      textColor = 'green'
                    }

                    const finishedChecklistItems = card && card.checklist.filter((item) => {
                      return item.finished === true
                    })

                    return (
                      <Card 
                        boardId={list.boardId}
                        card={card} 
                        textColor={textColor} 
                        finishedChecklistItems={finishedChecklistItems} 
                        key={card.id} 
                        id={card.id}
                        index={index}  
                      />
                    )
                  })
                }
                
                
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