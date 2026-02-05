'use client';

import AddTaskModal from './AddTaskModal';
import TaskModal from './TaskModal';
import Toast from './Toast';

export default function ModalProvider() {
  return (
    <>
      <AddTaskModal />
      <TaskModal />
      <Toast />
    </>
  );
}
