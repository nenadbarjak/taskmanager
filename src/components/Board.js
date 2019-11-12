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
    
    boardsDispatch({
      type: 'DRAG_HAPPENED',
      payload: {
        boardId: board.id,
        droppableIdStart: source.droppableId,
        droppableIdEnd: destination.droppableId,
        droppableIndexStart: source.index,
        droppableIndexEnd: destination.index,
        draggableId,
        type
      }
    })

    dragAndDrop({
      boardId: board.id,
      droppableIdStart: source.droppableId,
      droppableIdEnd: destination.droppableId,
      droppableIndexStart: source.index,
      droppableIndexEnd: destination.index,
      draggableId,
      type
    }).then((result) => {
      return
    }).catch((e) => {
      console.log(e)

      boardsDispatch({
        type: 'EDIT_BOARD',
        boardId: board.id,
        updates: {
          errMsg: 'ERROR! COULD NOT CONNECT TO DATABASE. PLEASE REFRESH THE PAGE AND TRY AGAIN.'
        }
      })
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
                key={list.id}
                
              >
                <List list={list} index={index} />
              </div>
              )
            })}
            <NewColumn boardId={board.id} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
 
export default Board;