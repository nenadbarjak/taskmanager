import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { BoardContext } from '../contexts/BoardContext';
import List from './List';
import NewColumn from './NewColumn';
import { getBoards, dragAndDrop } from '../actions/boardActions'
import { setAxiosToken } from '../services/axiosPreset'

const Board = ({ history }) => {
  const { boards, boardsDispatch, auth, authDispatch } = useContext(BoardContext) 

  const [isLoading, setIsLoading] = useState(false)

  const board = boards.length > 0 && boards.find(board => board.isActive)

  const getInitState = () => {
    setIsLoading(true)
    getBoards().then((result) => {
      setIsLoading(false)
      const boards = result.data

      if (boards.length === 0 || !boards.find(board => board.isActive)) {
        history.push('/addboard')
      }
      boardsDispatch({
        type: 'SET_BOARDS',
        boards
      })
    }).catch ((e) => {
      console.log(e)

      if (e.response.status === 401) {
        setIsLoading(false)

        const token = JSON.parse(localStorage.getItem('TM_App_token'))

        if (token) {
          (localStorage.removeItem('TM_App_token'))
        }

        setAxiosToken()

        authDispatch({ type: 'LOGOUT' })
        history.push('/signin')
      }
    })
  }

  useEffect(() => {
    if (boards.length === 0 && auth.token) {
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
  
  if (!auth.token) {
    return <Redirect to='/signin' />
  } 

  if (isLoading) {
    return <div className="spinner"><span className="fas fa-spinner fa-5x fa-spin"></span></div>
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
                <List key={list.id} list={list} index={index} />
              )
            })}
            {provided.placeholder}

            <NewColumn boardId={board.id} />
            
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
 
export default Board;