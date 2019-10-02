import React, { createContext, useReducer } from 'react';
import uuid from 'uuid/v1'
import listsReducer from '../reducers/listsReducer'
import usersReducer from '../reducers/usersReducer'

export const ListContext = createContext()


const listsInitState = [
  {
    title: 'To Do',
    id: '1',
    tasks: [
      {
        title: 'Task 1',
        id: uuid(),
        listId: '1',
        description: '', 
        modalVisible: false, 
        dueDate: undefined, 
        completed: false, 
        checklist: [], 
        assignedTo: undefined
      }
    ]
  },
  {
    title: 'In Progress',
    id: '2',
    tasks: []
  },
  {
    title: 'Done',
    id: '3',
    tasks: []
  }
]

const usersInitState = [
  {
    id: 1,
    firstName: 'Luke',
    lastName: 'Skywalker',
    initials: 'LS'
  },
  {
    id: 2,
    firstName: 'Darth',
    lastName: 'Vader',
    initials: 'DV'
  },
  {
    id: 3,
    firstName: 'Han',
    lastName: 'Solo',
    initials: 'HS'
  },
  {
    id: 4,
    firstName: 'Master',
    lastName: 'Yoda',
    initials: 'MY'
  },
  {
    id: 5,
    firstName: 'Princess',
    lastName: 'Leia',
    initials: 'PL'
  },
  {
    id: 6,
    firstName: 'Obi-Wan',
    lastName: 'Kenobi',
    initials: 'OK'
  }
]

const ListContextProvider = (props) => {
  const [users] = useReducer(usersReducer, usersInitState)
  const [lists, listsDispatch] = useReducer(listsReducer, listsInitState)

  return (
    <ListContext.Provider value={{lists, listsDispatch, users}}>
      {props.children}
    </ListContext.Provider>
  );
}
 
export default ListContextProvider;