interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function Spinner({ size = 'md', text = 'Loading...' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="h-screen flex flex-col items-center justify-center space-y-4"
    >
      <div
        className={`${sizeClasses[size]} border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin`}
      />
      {text && (
        <div className="text-center text-xl font-semibold">
          {text}
        </div>
      )}
      <span className="sr-only">{text}</span>
    </div>
  )
}