// components/core/Input.tsx
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTheme } from '../../context/ThemeContext';

/**
 * Base props shared between input and textarea
 */
interface BaseInputProps {
  /** Label text displayed above the input */
  label?: string;
  /** Helper text displayed below the input */
  helperText?: string;
  /** Error message displayed below the input */
  error?: string;
  /** Success message displayed below the input */
  successMessage?: string;
  /** Size variant of the input */
  size?: 'sm' | 'md' | 'lg';
  /** Full width of container */
  fullWidth?: boolean;
  /** Left icon component */
  startIcon?: React.ReactNode;
  /** Right icon component */
  endIcon?: React.ReactNode;
  /** Container className */
  containerClassName?: string;
  rows?: number;
}

/**
 * Props specific to textarea inputs
 */
interface TextAreaInputProps extends BaseInputProps, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  isTextArea: true;
  rows?: number;
}

/**
 * Props specific to regular inputs
 */
interface StandardInputProps extends BaseInputProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  isTextArea?: false;
}

/**
 * Combined input props type
 */
type InputProps = TextAreaInputProps | StandardInputProps;

/**
 * Size-specific styles mapping
 */
const sizeStyles = {
  sm: 'h-8 text-sm px-2',
  md: 'h-10 text-base px-3',
  lg: 'h-12 text-lg px-4'
};

/**
 * Input component that supports both regular inputs and textareas
 */
export const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
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
      containerClassName,
      className,
      isTextArea,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const themePrefix = theme.name; // 'default' or 'dnd'

    const inputStyles = twMerge(
      clsx(
        'w-full rounded-lg border bg-white transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:bg-gray-50 disabled:cursor-not-allowed',
        !isTextArea && sizeStyles[size],
        isTextArea && 'p-3',
        startIcon && 'pl-10',
        endIcon && 'pr-10',
        
        // Theme-specific class
        `${themePrefix}-input`,
        
        // Standard error/success states
        error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
        successMessage && 'border-green-500 focus:border-green-500 focus:ring-green-500',
        !error && !successMessage && 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
        className
      )
    );

    const containerStyles = twMerge(
      clsx(
        'flex flex-col',
        fullWidth && 'w-full',
        containerClassName
      )
    );

    return (
      <div className={containerStyles}>
        {label && (
          <label className={clsx(
            'mb-1.5 text-sm font-medium',
            `${themePrefix}-typography-label`
          )}>
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {startIcon}
            </div>
          )}
          {isTextArea ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              className={inputStyles}
              rows={rows}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              className={inputStyles}
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          )}
          {endIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {endIcon}
            </div>
          )}
        </div>
        {(helperText || error || successMessage) && (
          <p className={clsx(
            'mt-1.5 text-sm',
            error && 'text-red-500',
            successMessage && 'text-green-500',
            !error && !successMessage && `${themePrefix}-typography-secondary`
          )}>
            {error || successMessage || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;