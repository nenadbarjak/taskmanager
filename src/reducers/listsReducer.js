const listsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LISTS':
      return [...action.lists]
    case 'ADD_LIST':
      return [...state, action.list]
    case 'EDIT_LIST_TITLE':
      return state.map((list) => {
        if (list.id === action.id) {
          return {
            ...list,
            title: action.title
          }
        } else {
          return list
        }
      })
    case 'REMOVE_LIST':
      return state.filter((list) => list.id !== action.id)
    case 'ADD_CARD':
      return state.map((list) => {
        if (list.id === action.task.listId) {
          return {
            ...list,
            tasks: [...list.tasks, action.task]
          }
        } else {
          return list
        }
      })
    case 'EDIT_CARD':
      return state.map((list) => {
        if (list.id === action.listId) {  
          return {
            ...list,
            tasks: list.tasks.map((task) => {
              if (task.id === action.id) {
                return {
                  ...task,
                  ...action.updates
                }
              } else {
                return task
              }
            })
          } 
        } else {
          return list
        }
      })
    case 'REMOVE_CARD':
      return state.map((list) => {
        if (list.id === action.listId) {
          return {
            ...list,
            tasks: list.tasks.filter((task) => {
              return task.id !== action.id
            })
          } 
        } else {
          return list
        }
      })
    case 'REMOVE_CHECKLIST_ITEM':
      return state.map((list) => {
        if (list.id === action.listId) {
          return {
            ...list,
            tasks: list.tasks.map((task) => {
              if (task.id === action.id) {
                return {
                  ...task,
                  checklist: task.checklist.filter((item) => {
                    return item.id !== action.itemId
                  })
                }
              } else {
                return task
              }
            })
          }
        } else {
          return list
        }
      })
    case 'DRAG_HAPPENED':
      const {
        droppableIdStart,
        droppableIdEnd,
        droppableIndexStart,
        droppableIndexEnd,
        draggableId,
        type
      } = action.payload

      const newState = [...state]

      // dragging lists
      if (type === "list") {
        const list = newState.splice(droppableIndexStart, 1)
        newState.splice(droppableIndexEnd, 0, ...list)

        return newState
      }
      
      // in the same list
      if (droppableIdStart === droppableIdEnd) {
        const list = state.find((list) => droppableIdStart === String(list.id))
        const card = list.tasks.splice(droppableIndexStart, 1)
        list.tasks.splice(droppableIndexEnd, 0, ...card)
      }
      // other list
      if (droppableIdStart !== droppableIdEnd) {
        // find the list where drag started
        const listStart = state.find(list => droppableIdStart === String(list.id))

        // pull out the card from this list
        const card = listStart.tasks.splice(droppableIndexStart, 1)

        // find the list where drag ended
        const listEnd = state.find(list => droppableIdEnd === String(list.id))

        // put the card in the new list
        listEnd.tasks.splice(droppableIndexEnd, 0, ...card)

        //change the listId prop of the card
        card[0].listId = droppableIdEnd

      }
      return newState

    default: 
      return state
  }
}

export { listsReducer as default }