import React, { ImgHTMLAttributes } from 'react';
import cn from 'classnames';
import s from './Image.module.scss';
import { CityVariant } from '@shared/types/city';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Стейт для скелетона */
  isLoading?: boolean;
  /** Вариант отображения */
  variant?: CityVariant;
}

export const Image: React.FC<ImageProps> = ({ isLoading = false, className, variant, ...props }) =>
  isLoading ? (
    <div className={cn(s.image__preparation, variant === 'single' && s.image__preparation_single, className)} />
  ) : (
    <img {...props} className={cn(s.image, variant === 'single' && s.image_single)} />
  );
