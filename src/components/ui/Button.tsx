import React, { forwardRef, memo, useMemo } from 'react';
import { ComponentBaseProps } from '../../types';

/**
 * Type for defining the button variant.
 */
type ButtonVariant = 'primary' | 'secondary' | 'ghost';

/**
 * Type for defining the button size.
 */
type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Interface for Button props.
 */
interface ButtonProps extends ComponentBaseProps {
  /** The content of the button. */
  children: React.ReactNode;
  /** The visual variant of the button. */
  variant?: ButtonVariant;
  /** The size of the button. */
  size?: ButtonSize;
  /** If true, the button will be disabled. */
  disabled?: boolean;
  /** Click event handler. */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * A reusable button primitive styled with Tailwind CSS.
 *
 * @component
 * @example
 * <Button variant="primary" size="md" onClick={() => console.log('Clicked')}>
 *   Click me
 * </Button>
 */
const Button = memo(forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    onClick,
    className = '',
    ...props
  }, ref) => {

    const baseClasses = useMemo(() => {
      let classes = 'inline-flex items-center justify-center rounded-md font-medium transition-colors ';

      if (disabled) {
        classes += 'opacity-50 cursor-not-allowed ';
      } else {
        classes += 'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ';
      }

      switch (variant) {
        case 'primary':
          classes += 'bg-primary text-primary-foreground hover:bg-primary/90 ';
          break;
        case 'secondary':
          classes += 'bg-secondary text-secondary-foreground hover:bg-secondary/80 ';
          break;
        case 'ghost':
          classes += 'hover:bg-accent hover:text-accent-foreground ';
          break;
        default:
          throw new Error(`Invalid button variant: ${variant}`);
      }

      switch (size) {
        case 'sm':
          classes += 'px-2.5 py-1.5 text-sm';
          break;
        case 'md':
          classes += 'px-4 py-2 text-base';
          break;
        case 'lg':
          classes += 'px-6 py-3 text-lg';
          break;
        default:
          throw new Error(`Invalid button size: ${size}`);
      }

      return classes;
    }, [variant, size, disabled]);

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${className}`}
        onClick={onClick}
        disabled={disabled}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
));

Button.displayName = 'Button';

export default Button;