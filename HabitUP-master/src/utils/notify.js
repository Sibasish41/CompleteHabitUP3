import { toast } from 'react-toastify';

const TOAST_CONFIG = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true
};

class Notify {
  static success(message, config = {}) {
    return toast.success(message, {
      ...TOAST_CONFIG,
      ...config,
      className: 'bg-green-50',
      progressClassName: 'bg-green-500'
    });
  }

  static error(message, config = {}) {
    return toast.error(message, {
      ...TOAST_CONFIG,
      ...config,
      className: 'bg-red-50',
      progressClassName: 'bg-red-500'
    });
  }

  static warning(message, config = {}) {
    return toast.warning(message, {
      ...TOAST_CONFIG,
      ...config,
      className: 'bg-yellow-50',
      progressClassName: 'bg-yellow-500'
    });
  }

  static info(message, config = {}) {
    return toast.info(message, {
      ...TOAST_CONFIG,
      ...config,
      className: 'bg-blue-50',
      progressClassName: 'bg-blue-500'
    });
  }

  // For long-running operations
  static async promise(promise, {
    pending = 'Loading...',
    success = 'Success!',
    error = 'Error occurred'
  } = {}) {
    return toast.promise(promise, {
      pending: {
        render: pending,
        ...TOAST_CONFIG,
        className: 'bg-blue-50',
        progressClassName: 'bg-blue-500'
      },
      success: {
        render: success,
        ...TOAST_CONFIG,
        className: 'bg-green-50',
        progressClassName: 'bg-green-500'
      },
      error: {
        render: typeof error === 'function' ? error : error,
        ...TOAST_CONFIG,
        className: 'bg-red-50',
        progressClassName: 'bg-red-500'
      }
    });
  }

  // For confirmation dialogs
  static confirm(message, onConfirm, onCancel) {
    const toastId = toast(
      <div>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => {
              toast.dismiss(toastId);
              onCancel?.();
            }}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(toastId);
              onConfirm();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>,
      {
        ...TOAST_CONFIG,
        autoClose: false,
        closeOnClick: false,
        className: 'bg-white'
      }
    );
  }
}

export default Notify;
