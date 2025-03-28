import * as React from 'react';
import s from './Text.module.scss';
import cn from 'classnames';

export type TextProps = {
  /** Дополнительный класс */
  className?: string;
  /** Стиль отображения */
  view?: 'title' | 'button' | 'p-20' | 'p-18' | 'p-16' | 'p-14';
  /** Html-тег */
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p' | 'span';
  /** Начертание шрифта */
  weight?: 'normal' | 'medium' | 'bold';
  /** Контент */
  children: React.ReactNode;
  /** Цвет */
  color?: 'primary' | 'secondary' | 'accent';
  /** Максимальное кол-во строк */
  maxLines?: number;
  /** Стейт для скелетона */
  isLoading?: boolean;
};

const Text: React.FC<TextProps> = ({
  className,
  view,
  tag,
  weight,
  children,
  color,
  maxLines,
  isLoading = false,
  ...props
}) => {
  const Element = tag ?? 'p';
  const styles: React.CSSProperties = {
    ...(maxLines && { WebkitLineClamp: maxLines }),
    ...(weight && { fontWeight: weight }),
  };

  return isLoading ? (
    <span className={s.text__preparation} />
  ) : (
    <Element
      className={cn(
        s.text,
        s[`text_${view ?? 'p-20'}`],
        s[`text_${color ?? 'primary'}`],
        isLoading && s.text_skeleton,
        className
      )}
      style={styles}
      {...props}
    >
      {children}
    </Element>
  );
};

export default Text;
