'use client';

import AddTaskModal from './AddTaskModal';
import TaskModal from './TaskModal';

export default function ModalProvider() {
  return (
    <>
      <AddTaskModal />
      <TaskModal />
    </>
  );
}
