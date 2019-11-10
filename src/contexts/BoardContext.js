import React, { createContext, useReducer } from 'react';
import boardsReducer from '../reducers/boardsReducer'
import usersReducer from '../reducers/usersReducer'

export const BoardContext = createContext()

const boardsInitState = []

const usersInitState = [
  {
    id: '1',
    firstName: 'Luke',
    lastName: 'Skywalker',
    initials: 'LS'
  },
  {
    id: '2',
    firstName: 'Darth',
    lastName: 'Vader',
    initials: 'DV'
  },
  {
    id: '3',
    firstName: 'Han',
    lastName: 'Solo',
    initials: 'HS'
  },
  {
    id: '4',
    firstName: 'Master',
    lastName: 'Yoda',
    initials: 'MY'
  },
  {
    id: '5',
    firstName: 'Princess',
    lastName: 'Leia',
    initials: 'PL'
  },
  {
    id: '6',
    firstName: 'Obi-Wan',
    lastName: 'Kenobi',
    initials: 'OK'
  }
]

const BoardContextProvider = (props) => {
  const [users] = useReducer(usersReducer, usersInitState)
  const [boards, boardsDispatch] = useReducer(boardsReducer, boardsInitState)

  return (
    <BoardContext.Provider value={{boards, boardsDispatch, users}}>
      {props.children}
    </BoardContext.Provider>
  );
}
 
export default BoardContextProvider;