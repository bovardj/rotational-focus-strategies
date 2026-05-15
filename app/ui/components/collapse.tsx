import { ReactNode } from 'react';

interface CollapseProps {
  title: string;
  children: ReactNode;
  initialVisible?: boolean;
  shadow?: boolean;
  className?: string;
}

export default function Collapse({
  title,
  children,
  initialVisible,
  shadow = false,
  className = '',
}: CollapseProps) {
  return (
    <details
      open={initialVisible}
      className={`group rounded-md border border-gray-200 ${shadow ? 'shadow-sm' : ''} ${className}`}
    >
      <summary className="flex cursor-pointer select-none list-none items-center justify-between px-4 py-3 text-sm font-medium">
        <span>{title}</span>
        <svg
          className="ml-2 h-4 w-4 flex-shrink-0 transition-transform duration-200 group-open:rotate-90"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </summary>
      <div className="border-t border-gray-200 px-4 py-3 text-sm">
        {children}
      </div>
    </details>
  );
}
