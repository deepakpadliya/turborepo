import { CollisionPriority } from '@dnd-kit/abstract';
import { useDroppable } from '@dnd-kit/react';

const styles = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 10,
  padding: 20,
  minWidth: 200,
  backgroundColor: 'rgba(0,0,0,0.1)',
  borderRadius: 10,
};

export function Column({children, id}) {
  const {ref} = useDroppable({
    id,
    type: 'column',
    accept: ['item'],
    collisionPriority: CollisionPriority.Low,
  });

  return (
    <div style={styles} ref={ref}>
      {children}
    </div>
  );
}
