import React, { ImgHTMLAttributes, memo } from 'react';
import cn from 'classnames';
import s from './Image.module.scss';
import { CityVariant } from '@shared/types/city';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Стейт для скелетона */
  isLoading?: boolean;
  /** Вариант отображения */
  variant?: CityVariant;
}

export const Image: React.FC<ImageProps> = memo(({ isLoading = false, src, className, variant, ...props }) =>
  isLoading || !src ? (
    <div className={cn(s.image__preparation, variant === 'single' && s.image__preparation_single, className)} />
  ) : (
    <img {...props} src={src} className={s.image} />
  )
);
