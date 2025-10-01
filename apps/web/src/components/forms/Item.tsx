import { useSortable } from '@dnd-kit/react/sortable';

export function Item({ id, column, index }) {
  const { ref } = useSortable({
    id,
    index,
    group: column,
    type: 'item',
    accept: ['item'],
  });

  return (
    <div ref={ref} style={{ width: '40%', justifyContent:'space-between', alignContent:'center', backgroundColor: 'white', padding: 10, borderRadius: 5, marginBottom: 10 }}>
      <button>{id}</button>
    </div>
  );
}