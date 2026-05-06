import { useEffect } from "react";

const Modal = ({ isOpen, onClose, title, children }) => {

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex justify-center items-start pt-20 px-6"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 w-full max-w-6xl h-[75vh] rounded-2xl shadow-xl p-6 relative overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Title */}
        {title && (
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            {title}
          </h2>
        )}

        {/* Body */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;