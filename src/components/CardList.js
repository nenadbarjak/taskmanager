import React from 'react';
import moment from 'moment'
import Card from './Card';



const CardList = ({ id, list }) => {
  const cardList = list.cards

  return (
    <div>
      {cardList && cardList.map((card, index) => {
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
            key={card._id} 
            id={card._id}
            index={index}  
          />
      )
      })}
    </div>
  );
}
 
export default CardList;