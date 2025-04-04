import React from 'react';
import cn from 'classnames';
import Text from '@shared/components/Text';
import s from './City.module.scss';
import { CityVariant } from '@shared/types/city';
import { getTextFromReactNode } from '@shared/utils';
import Button from '@shared/components/Button';
import { imageMock } from '@shared/mock/cities';
import { Image } from '@shared/components/Image';
import { Like } from '@shared/components/Like';

export type CityProps = {
  /** Дополнительный classname */
  className?: string;
  /** Вариант отображения */
  variant?: CityVariant;
  /** Id карточки */
  cityId: string;
  /** URL изображения */
  image?: string;
  /** Слот над заголовком */
  captionSlot?: React.ReactNode;
  /** Заголовок карточки */
  title: React.ReactNode;
  /** Описание карточки */
  subtitle: React.ReactNode;
  /** Содержимое карточки (футер/боковая часть), может быть пустым */
  contentSlot?: React.ReactNode;
  /** Клик на карточку */
  onClick?: React.MouseEventHandler;
  /** Слот для действия */
  actionSlot?: React.ReactNode;
  /** Стейт для скелетона */
  isLoading?: boolean;
};

const City: React.FC<CityProps> = ({
  className,
  variant = 'preview',
  cityId,
  image,
  captionSlot,
  title,
  subtitle,
  contentSlot,
  onClick,
  actionSlot,
  isLoading = false,
}) => {
  const imageText = getTextFromReactNode(title);
  const isPreview = variant === 'preview';

  return (
    <div onClick={onClick} className={cn(s.city, { [s.city_single]: !isPreview }, className)}>
      <Image
        isLoading={isLoading}
        src={image ?? imageMock}
        alt={imageText}
        className={s.city__image}
        variant={variant}
      />
      <div className={s.city__body}>
        <div className={s['city__body-top']}>
          {(isLoading || captionSlot) && (
            <Text isLoading={isLoading} view={'p-14'} color={'secondary'}>
              {captionSlot}
            </Text>
          )}
          <Text isLoading={isLoading} view={isPreview ? 'p-20' : 'title'} weight={'bold'} maxLines={2}>
            {title}
          </Text>
          <Text isLoading={isLoading} view={isPreview ? 'p-16' : 'p-20'} color={'secondary'} maxLines={3}>
            {subtitle}
          </Text>
          <Like cityId={cityId} />
        </div>
        <div className={s['city__body-bottom']}>
          {(isLoading || contentSlot) && (
            <Text isLoading={isLoading} view={isPreview ? 'p-18' : 'title'} weight={'bold'} className={s.city__price}>
              {contentSlot}
            </Text>
          )}
          <div className={s.city__actions}>
            {actionSlot}
            {!isPreview && (
              <Button isSkeletonLoading={isLoading} className={s.city__button}>
                More info
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default City;
