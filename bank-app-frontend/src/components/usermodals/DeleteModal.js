import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const DeleteModal = ({ isOpen, onRequestClose, onDelete, userName }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Delete User"
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
    >
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl mb-4 font-bold">Delete User</h2>
        <p className="mb-4">Are you sure you want to delete the user "{userName}"?</p>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onDelete}
            className="bg-red-500 text-white py-2 px-4 rounded-lg text-sm"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={onRequestClose}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
