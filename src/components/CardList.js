import React from 'react';
import moment from 'moment'
import Card from './Card';



const CardList = ({ id, list }) => {
  const taskList = list.tasks

  return (
    <div>
      {taskList && taskList.map((task, index) => {
        let textColor = 'black'
        if (task.dueDate - moment() < 0) {
          textColor = 'red'
        } else if (task.dueDate - moment() < 86400000) {
          textColor = 'green'
        }

        const finishedChecklistItems = task && task.checklist.filter((item) => {
          return item.finished === true
        })

        return (
          <Card 
            task={task} 
            textColor={textColor} 
            finishedChecklistItems={finishedChecklistItems} 
            key={task.id} 
            id={task.id}
            index={index}  
          />
      )
      })}
    </div>
  );
}
 
export default CardList;