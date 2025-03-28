import React, { ImgHTMLAttributes } from 'react';
import cn from 'classnames';
import s from './Image.module.scss';
import { cardVariant } from '@shared/lib/types/card';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Стейт для скелетона */
  isLoading?: boolean;
  /** Вариант отображения */
  variant?: cardVariant;
}

export const Image: React.FC<ImageProps> = ({ isLoading = false, className, variant, ...props }) =>
  isLoading ? (
    <div className={cn(s.image__preparation, variant === 'single' && s.image__preparation_single, className)} />
  ) : (
    <img {...props} className={className} />
  );
