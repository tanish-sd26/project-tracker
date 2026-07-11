interface LoadingSpinnerProps { label?: string; }

export function LoadingSpinner({ label = 'Loading…' }: LoadingSpinnerProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-3" role="status" aria-live="polite">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
      <p className="text-sm font-medium text-gray-500">{label}</p>
    </div>
  );
}
