import React, { useContext } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { ListContext } from '../contexts/ListContext';
import List from './List';
import NewColumn from './NewColumn';

const Board = () => {
  const { lists, listsDispatch } = useContext(ListContext)
  
  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result

    if (!destination) {
      return
    }
    listsDispatch({
      type: 'DRAG_HAPPENED',
      payload: {
        droppableIdStart: source.droppableId,
        droppableIdEnd: destination.droppableId,
        droppableIndexStart: source.index,
        droppableIndexEnd: destination.index,
        draggableId,
        type
      }
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
            {lists.map((list, index) => {
              return (
                <div 
                className="list-column" 
                key={list.id}
                
              >
                <List list={list} index={index} />
              </div>
              )
            })}
            <NewColumn />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
 
export default Board;