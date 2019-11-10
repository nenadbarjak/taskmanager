import React, { useContext, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { BoardContext } from '../contexts/BoardContext';
import List from './List';
import NewColumn from './NewColumn';
import { getBoards, dragAndDrop } from '../actions/boardActions'


const Board = () => {
  const { boards, boardsDispatch } = useContext(BoardContext)

  const board = boards.length > 0 && boards.find(board => board.isActive)

  const getInitState = () => {
    getBoards().then((result) => {
      const boards = result.data

      boardsDispatch({
        type: 'SET_BOARDS',
        boards
      })
    }).catch ((e) => {
      console.log(e)
    })
  }

  useEffect(() => {
    if (boards.length === 0) {
      getInitState()
      
    }
  }, [])

  
  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result

    if (!destination) {
      return
    }
    // In case of drag and drop, the state is updated before the database
    //  to avoid bad UX when the dragged card is first returned to its original position
    // and only after the resposne from server is moved to the correct position

    // TODO: apply a logic that will undo the state dispatch in case server sends back an error.
    boardsDispatch({
      type: 'DRAG_HAPPENED',
      payload: {
        boardId: board._id,
        droppableIdStart: source.droppableId,
        droppableIdEnd: destination.droppableId,
        droppableIndexStart: source.index,
        droppableIndexEnd: destination.index,
        draggableId,
        type
      }
    })

    dragAndDrop({
      boardId: board._id,
      droppableIdStart: source.droppableId,
      droppableIdEnd: destination.droppableId,
      droppableIndexStart: source.index,
      droppableIndexEnd: destination.index,
      draggableId,
      type
    }).then((result) => {
 
    }).catch((e) => {
      console.log(e)
    })       
  }
  
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="all-list" direction="horizontal" type="list">
        {provided => (
          <div className="board"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {board && board.lists.map((list, index) => {
              return (
                <div 
                className="list-column" 
                key={list._id}
                
              >
                <List list={list} index={index} />
              </div>
              )
            })}
            <NewColumn boardId={board._id} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
 
export default Board;