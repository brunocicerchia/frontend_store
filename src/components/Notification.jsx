import React, { useEffect } from 'react';

export default function Notification({ type = 'info', message, onClose, duration = 5000 }) {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: '✓',
      iconBg: 'bg-green-500',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: '✕',
      iconBg: 'bg-red-500',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: '⚠',
      iconBg: 'bg-yellow-500',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'ℹ',
      iconBg: 'bg-blue-500',
    },
  };

  const style = styles[type] || styles.info;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className={`${style.bg} ${style.border} border rounded-lg shadow-lg p-4 max-w-md flex items-start gap-3`}>
        <div className={`${style.iconBg} text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold`}>
          {style.icon}
        </div>
        <div className="flex-1">
          <p className={`${style.text} text-sm font-medium`}>{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${style.text} hover:opacity-70 transition-opacity flex-shrink-0`}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
