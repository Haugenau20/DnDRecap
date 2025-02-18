// components/core/Card.tsx
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Typography from './Typography';
import { useTheme } from '../../context/ThemeContext';

/**
 * Available padding sizes for the card
 */
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

/**
 * Props for the Card Header subcomponent
 */
interface CardHeaderProps {
  /** The title of the card */
  title?: React.ReactNode;
  /** Optional subtitle */
  subtitle?: React.ReactNode;
  /** Optional action component (e.g., button, menu) */
  action?: React.ReactNode;
  /** Optional className for custom styles */
  className?: string;
}

/**
 * Props for the Card Content subcomponent
 */
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  padding?: CardPadding;
}

/**
 * Props for the Card Footer subcomponent
 */
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Props for the main Card component
 */
interface CardProps {
  /** Main content of the card */
  children: React.ReactNode;
  /** Optional background color variant */
  variant?: 'default' | 'subtle';
  /** Optional hover effect */
  hoverable?: boolean;
  /** Optional click handler */
  onClick?: () => void;
  /** Optional className for custom styles */
  className?: string;
}

/**
 * Padding styles for different sizes
 */
const paddingStyles: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6'
};

/**
 * Card Header subcomponent
 */
export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  className
}) => {
  const styles = twMerge(
    clsx(
      'flex items-start justify-between px-6 pt-6',
      className
    )
  );

  return (
    <div className={styles}>
      <div className="flex-1">
        {typeof title === 'string' ? (
          <Typography variant="h3">{title}</Typography>
        ) : (
          title
        )}
        {typeof subtitle === 'string' ? (
          <Typography variant="body" color="secondary" className="mt-1">
            {subtitle}
          </Typography>
        ) : (
          subtitle
        )}
      </div>
      {action && <div className="ml-4">{action}</div>}
    </div>
  );
};

/**
 * Card Content subcomponent
 */
export const CardContent: React.FC<CardContentProps> = ({
  children,
  className,
  padding = 'md'
}) => {
  const styles = twMerge(
    clsx(
      paddingStyles[padding],
      className
    )
  );

  return <div className={styles}>{children}</div>;
};

/**
 * Card Footer subcomponent
 */
export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className
}) => {
  const styles = twMerge(
    clsx(
      'px-6 py-4 bg-gray-50 rounded-b-lg',
      className
    )
  );

  return <div className={styles}>{children}</div>;
};

/**
 * Main Card component that can be composed with Header, Content, and Footer
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      hoverable = false,
      onClick,
      className,
      ...props
    },
    ref
  ) => {
    const styles = twMerge(
      clsx(
        'rounded-lg shadow-sm overflow-hidden',
        'border border-gray-200',
        variant === 'default' ? 'bg-white' : 'bg-gray-50',
        hoverable && [
          'transition-shadow duration-200',
          'hover:shadow-md',
          onClick && 'cursor-pointer'
        ],
        className
      )
    );
    const { theme } = useTheme();

    return (
      <div
        className={clsx(
          'card',
          theme.name === 'dnd' && 'dnd-card',
          className
        )}
        ref={ref}
        // className={styles}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Example usage types for better DX
export interface CardComposition {
  Header: typeof CardHeader;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
}

// Add subcomponents to Card
(Card as unknown as CardComposition).Header = CardHeader;
(Card as unknown as CardComposition).Content = CardContent;
(Card as unknown as CardComposition).Footer = CardFooter;

export default Card as typeof Card & CardComposition;