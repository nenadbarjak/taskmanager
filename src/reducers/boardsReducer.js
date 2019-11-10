const boardReducer = (state, action) => {
  switch (action.type) {
    case 'SET_BOARDS':
      return [...action.boards]

    case 'ADD_BOARD':
      return [...state, action.board]

    case 'REMOVE_BOARD':
      return state.filter(board => board._id !== action.boardId)

    // case 'EDIT_BOARD_TITLE ???

    case 'ADD_LIST':
      return state.map((board) => {
        if (board._id === action.boardId) {
          return {
            ...board,
            lists: [...board.lists, action.list]
          }
        } else {
          return board
        }
      })

    case 'REMOVE_LIST':
      return state.map((board) => {
        if (board._id === action.boardId) {
          return {
            ...board,
            lists: board.lists.filter(list => list._id !== action.listId)
          }
        } else {
          return board
        }
      })

    case 'EDIT_LIST_TITLE':
      return state.map((board) => {
        if (board._id === action.boardId) {
          return {
            ...board,
            lists: board.lists.map((list) => {
              if (list._id === action.listId) {
                return {
                  ...list,
                  title: action.title
                }
              } else {
                return list
              }
            })
          }
        } else {
          return board
        }
      })

    case 'ADD_CARD':
      return state.map((board) => {
        if (board._id === action.boardId) {
          return {
            ...board,
            lists: board.lists.map((list) => {
              if (list._id === action.listId) {
                return {
                  ...list,
                  cards: [
                    action.card,
                    ...list.cards
                  ]
                }
              } else {
                return list
              }
            })
          }
        } else {
          return board
        }
      })
    case 'EDIT_CARD':
      return state.map((board) => {
        if (board._id === action.boardId) {
            return {
              ...board,
              lists: board.lists.map((list) => {
                if (list._id === action.listId) {
                  return {
                    ...list,
                    cards: list.cards.map((card) => {
                      if (card._id === action.cardId) {
                        return {
                          ...card,
                          ...action.updates
                        }
                      } else {
                        return card
                      }
                    })
                  }
                } else {
                  return list
                }
              })
            }
        } else {
          return board
        }
      })
    case 'REMOVE_CARD':
      return state.map((board) => {
        if (board._id === action.boardId) {
          return {
            ...board,
            lists: board.lists.map((list) => {
              if (list._id === action.listId) {
                return {
                  ...list,
                  cards: list.cards.filter(card => card._id !== action.cardId)
                }
              } else {
                return list
              }
            })
          }
        } else {
          return board
        }
      })

    case 'ADD_CHECKLIST_ITEM':
      return state.map((board) => {
        if (board._id === action.boardId) {
          return {
            ...board,
            lists: board.lists.map((list) => {
              if (list._id === action.listId) {
                return {
                  ...list,
                  cards: list.cards.map((card) => {
                    if (card._id === action.cardId) {
                      return {
                        ...card,
                        checklist: [
                          ...card.checklist,
                          action.checklistItem
                        ]
                      }
                    } else {
                      return card
                    }
                  })
                }
              } else {
                return list
              }
            })
          }
        } else return board
      })
    
    case 'EDIT_CHECKLIST_ITEM':
      return state.map((board) => {
        if (board._id === action.boardId) {
          return {
            ...board,
            lists: board.lists.map((list) => {
              if (list._id === action.listId) {
                return {
                  ...list,
                  cards: list.cards.map((card) => {
                    if (card._id === action.cardId) {
                      return {
                        ...card,
                        checklist: card.checklist.map((item) => {
                          if (item._id === action.checklistItemId) {
                            return {
                              ...item,
                              ...action.updates
                            }
                          } else {
                            return item
                          }
                        })
                      }
                    } else {
                      return card
                    }
                  })
                }
              } else {
                return list
              }
            })
          }
        } else return board
      })

    case 'REMOVE_CHECKLIST_ITEM':
      return state.map((board) => {
        if (board._id === action.boardId) {
          return {
            ...board,
            lists: board.lists.map((list) => {
              if (list._id === action.listId) {
                return {
                  ...list,
                  cards: list.cards.map((card) => {
                    if (card._id === action.cardId) {
                      return {
                        ...card,
                        checklist: card.checklist.filter(item => item._id !== action.checklistItemId)
                      }
                    } else {
                      return card
                    }
                  })
                }
              } else {
                return list
              }
            })
          }
        } else return board
      })

    case 'DRAG_HAPPENED':
        const {
          boardId,
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
          const board = state.find(board => board._id === boardId)
          
          const list = board.lists.splice(droppableIndexStart, 1)
          board.lists.splice(droppableIndexEnd, 0, ...list)
  
          return newState
        }
        
        // in the same list
        if (droppableIdStart === droppableIdEnd) {
          const board = state.find(board => board._id === boardId) 

          const list = board.lists.find(list => droppableIdStart === list._id)
          const card = list.cards.splice(droppableIndexStart, 1)
          list.cards.splice(droppableIndexEnd, 0, ...card)
        }
        // other list
        if (droppableIdStart !== droppableIdEnd) {
          const board = state.find(board => board._id === boardId) 

          // find the list where drag started
          const listStart = board.lists.find(list => droppableIdStart === list._id)
  
          // pull out the card from this list
          const card = listStart.cards.splice(droppableIndexStart, 1)
  
          // find the list where drag ended
          const listEnd = board.lists.find(list => droppableIdEnd === list._id)

          //change the listId prop of the card
          card[0].listId = droppableIdEnd
  
          // put the card in the new list
          listEnd.cards.splice(droppableIndexEnd, 0, ...card)  
        }
        return newState
    default: 
        return state
  }
}

export { boardReducer as default }