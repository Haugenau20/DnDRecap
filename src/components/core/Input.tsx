// components/core/Input.tsx
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Typography from './Typography';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * Input size variations
 */
type InputSize = 'sm' | 'md' | 'lg';

/**
 * Input status for validation states
 */
type InputStatus = 'error' | 'success' | undefined;

/**
 * Props for the Input component
 */
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label text displayed above the input */
  label?: string;
  /** Helper text displayed below the input */
  helperText?: string;
  /** Error message displayed below the input */
  error?: string;
  /** Success message displayed below the input */
  successMessage?: string;
  /** Size variant of the input */
  size?: InputSize;
  /** Full width of container */
  fullWidth?: boolean;
  /** Left icon component */
  startIcon?: React.ReactNode;
  /** Right icon component */
  endIcon?: React.ReactNode;
  /** Container className */
  containerClassName?: string;
}

/**
 * Size-specific styles mapping
 */
const sizeStyles: Record<InputSize, string> = {
  sm: 'h-8 text-sm px-2',
  md: 'h-10 text-base px-3',
  lg: 'h-12 text-lg px-4'
};

/**
 * Get icon color based on input status
 */
const getIconColor = (status: InputStatus) => {
  switch (status) {
    case 'error':
      return 'text-red-500';
    case 'success':
      return 'text-green-500';
    default:
      return 'text-gray-400';
  }
};

/**
 * Input component for collecting user input with support for various states and sizes
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      successMessage,
      size = 'md',
      fullWidth = false,
      startIcon,
      endIcon,
      disabled = false,
      containerClassName,
      className,
      id: providedId,
      ...props
    },
    ref
  ) => {
    // Always call useId at the top level
    const generatedId = React.useId();
    // Use provided id or generated one
    const inputId = providedId || generatedId;
    
    // Determine input status
    const status: InputStatus = error ? 'error' : successMessage ? 'success' : undefined;

    // Combine styles for the input element
    const inputStyles = twMerge(
      clsx(
        // Base styles
        'w-full rounded-lg border bg-white transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:bg-gray-50 disabled:cursor-not-allowed',
        
        // Size styles
        sizeStyles[size],
        
        // Icon padding adjustments
        startIcon && 'pl-10',
        endIcon && 'pr-10',
        
        // Status-specific styles
        status === 'error' && [
          'border-red-500',
          'focus:border-red-500 focus:ring-red-500'
        ],
        status === 'success' && [
          'border-green-500',
          'focus:border-green-500 focus:ring-green-500'
        ],
        !status && [
          'border-gray-300',
          'focus:border-blue-500 focus:ring-blue-500'
        ],
        
        // Custom classes
        className
      )
    );

    // Container styles
    const containerStyles = twMerge(
      clsx(
        'flex flex-col',
        fullWidth && 'w-full',
        containerClassName
      )
    );

    return (
      <div className={containerStyles}>
        {/* Label */}
        {label && (
          <Typography
            as="label"
            htmlFor={inputId}
            variant="body-sm"
            className="mb-1.5 font-medium"
          >
            {label}
          </Typography>
        )}

        {/* Input wrapper for icons */}
        <div className="relative">
          {/* Start Icon */}
          {startIcon && (
            <div className={clsx(
              'absolute left-3 top-1/2 -translate-y-1/2',
              getIconColor(status)
            )}>
              {startIcon}
            </div>
          )}

          {/* Input element */}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            className={inputStyles}
            {...props}
          />

          {/* End Icon */}
          {(endIcon || status) && (
            <div className={clsx(
              'absolute right-3 top-1/2 -translate-y-1/2',
              getIconColor(status)
            )}>
              {status === 'error' ? (
                <AlertCircle size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
              ) : status === 'success' ? (
                <CheckCircle2 size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
              ) : (
                endIcon
              )}
            </div>
          )}
        </div>

        {/* Helper/Error/Success Text */}
        {(helperText || error || successMessage) && (
          <Typography
            variant="body-sm"
            color={
              error
                ? 'error'
                : successMessage
                ? 'success'
                : 'secondary'
            }
            className="mt-1.5"
            id={`${inputId}-${error ? 'error' : 'helper'}`}
          >
            {error || successMessage || helperText}
          </Typography>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;