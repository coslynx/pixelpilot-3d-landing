import React, { useMemo } from 'react';
import clsx from 'clsx';

export interface TextSplitterProps {
  text: string;
  splitBy?: 'word' | 'character';
  className?: string;
  animationDelayIncrement?: number;
}

/**
 * A component that splits text into words or characters for individual styling/animation.
 */
const TextSplitter: React.FC<TextSplitterProps> = ({
  text,
  splitBy = 'word',
  className,
  animationDelayIncrement,
}) => {
  const items = useMemo(() => {
    if (!text) return [];
    return splitBy === 'word' ? text.split(' ') : Array.from(text);
  }, [text, splitBy]);

  if (!items.length) {
    return null;
  }

  return (
    <>
      {items.map((item, index) => (
        <span
          key={index}
          className={clsx(className)}
          style={animationDelayIncrement ? { transitionDelay: `${index * animationDelayIncrement}ms` } : undefined}
        >
          {item}
        </span>
      ))}
    </>
  );
};

export default React.memo(TextSplitter);