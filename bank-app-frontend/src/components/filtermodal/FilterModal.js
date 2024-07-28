import React from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

Modal.setAppElement('#root');

const FilterModal = ({ isOpen, onRequestClose, filterDate, handleDateChange }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Filter by Date"
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
    >
      <div className="bg-white  max-w-sm p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl mb-4 font-bold">Select Date to Filter</h2>
        <DatePicker
          selected={filterDate}
          onChange={handleDateChange}
          inline
        />
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={onRequestClose}
            className="bg-red-500 text-white py-2 px-4 rounded-lg text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FilterModal;
