import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar/Navbar';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { TaskModal } from '../components/TaskModal/TaskModal';
import { TaskDetailsModal } from '../components/TaskDetailsModal/TaskDetailsModal';
import { ConfirmDialog } from '../components/ConfirmDialog/ConfirmDialog';
import { ToastContainer } from '../components/Toast/Toast';
import { useTasks } from '../context/TaskContext';
import './DashboardLayout.css';

export const DashboardLayout = () => {
  const {
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    toasts,
    removeToast
  } = useTasks();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  // Handlers for modal interactions
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
  };

  const handleOpenViewModal = (task) => {
    setViewingTask(task);
  };

  const handleOpenDeleteConfirm = (task) => {
    setDeletingTask(task);
  };

  const handleConfirmDelete = () => {
    if (deletingTask) {
      deleteTask(deletingTask.id);
      if (viewingTask?.id === deletingTask.id) {
        setViewingTask(null);
      }
      setDeletingTask(null);
    }
  };

  const handleSaveTask = (formData) => {
    if (editingTask) {
      updateTask(editingTask.id, formData);
      if (viewingTask?.id === editingTask.id) {
        setViewingTask((prev) => ({ ...prev, ...formData }));
      }
      setEditingTask(null);
    } else {
      createTask(formData);
      setIsCreateModalOpen(false);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Component */}
      <Sidebar
        isOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
        onOpenCreateModal={handleOpenCreateModal}
      />

      {/* Main Content Area */}
      <div className="dashboard-main-area">
        <Navbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenCreateModal={handleOpenCreateModal}
        />

        <main className="dashboard-content-body">
          <Outlet
            context={{
              onOpenCreateModal: handleOpenCreateModal,
              onOpenEditModal: handleOpenEditModal,
              onOpenViewModal: handleOpenViewModal,
              onOpenDeleteConfirm: handleOpenDeleteConfirm,
              onChangeStatus: updateTaskStatus
            }}
          />
        </main>
      </div>

      {/* Modals & Dialogs */}
      <TaskModal
        isOpen={isCreateModalOpen}
        mode="create"
        onSave={handleSaveTask}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <TaskModal
        isOpen={!!editingTask}
        mode="edit"
        initialData={editingTask}
        onSave={handleSaveTask}
        onClose={() => setEditingTask(null)}
      />

      <TaskDetailsModal
        isOpen={!!viewingTask}
        task={viewingTask}
        onClose={() => setViewingTask(null)}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteConfirm}
        onChangeStatus={updateTaskStatus}
      />

      <ConfirmDialog
        isOpen={!!deletingTask}
        title="Delete Task?"
        message={`Are you sure you want to permanently delete "${deletingTask?.title}"? This action cannot be reverted.`}
        confirmText="Delete Task"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingTask(null)}
      />

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
