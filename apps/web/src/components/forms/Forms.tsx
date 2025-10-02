import { useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import {move} from '@dnd-kit/helpers';
import { useDroppable } from "@dnd-kit/react";
import { Column } from "./Column";
import { Item } from "./Item";

import './Forms.scss'

const Forms = () => {
  const { ref } = useDroppable({
    id:'form',
    type:'group',
    accept:['group']
  });


  const [items, setItems] = useState({
    A: ['A0', 'A1', 'A2'],
    B: ['B0', 'B1'],
    C: [],
  });

  return (
    <div className="forms-container">
      {JSON.stringify(items, null, 2)}
      <div className="forms-header">
        <h1>Forms</h1>
        <button>Add Form</button>
      </div>
      <div className="forms-list">
        <DragDropProvider
      onDragOver={(event) => {
        setItems((items) => move(items, event));
      }}
    >
      <div ref={ref} style={{ display:'flex', flexDirection:'column', gap: 20, padding:'16px'}}>
        {Object.entries(items).map(([column, items]) => (
          <Column key={column} id={column}>
            {items.map((id, index) => (
              <Item key={id} id={id} index={index} column={column} />
            ))}
          </Column>
        ))}
      </div>
    </DragDropProvider>
      </div>
    </div>
  )
}

export default Forms;