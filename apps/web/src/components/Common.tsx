import React from 'react';
import { AlertCircle, FolderOpen, RefreshCw } from 'lucide-react';

interface LoadingSkeletonProps {
  count?: number;
  height?: string;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 3,
  height = 'h-12',
  className = '',
}) => {
  return (
    <div className={`space-y-3 w-full ${className}`} id="loading-skeleton">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`w-full bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse ${height}`}
          id={`skeleton-item-${i}`}
        />
      ))}
    </div>
  );
};

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Found',
  description = 'There is currently no information to display here.',
  icon = <FolderOpen className="w-12 h-12 text-slate-400" />,
  action,
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
      id="empty-state"
    >
      <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-950 rounded-full">{icon}</div>
      <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
        {description}
      </p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'An unexpected error occurred while communicating with the recruitment servers.',
  onRetry,
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center p-8 text-center bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900/30 shadow-sm"
      id="error-state"
    >
      <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/40 rounded-full text-red-600 dark:text-red-400">
        <AlertCircle className="w-12 h-12" />
      </div>
      <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
        Connection / Load Error
      </h3>
      <p className="text-sm text-red-700 dark:text-red-300 max-w-md mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium rounded-lg shadow transition duration-150"
          id="retry-btn"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Request
        </button>
      )}
    </div>
  );
};
