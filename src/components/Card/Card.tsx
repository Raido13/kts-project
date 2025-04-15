import React from 'react';
import cn from 'classnames';
import Text from '@shared/components/Text';
import s from './Card.module.scss';
import { CityVariant } from '@shared/types/city';
import { getTextFromReactNode } from '@shared/utils';
import Button from '@shared/components/Button';
import { Image } from '@shared/components/Image';
import { Like } from '@shared/components/Like';
import { Comment } from '@shared/components/Comment';

export type CardProps = {
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
  /** Лоадер скелетона */
  isLoading?: boolean;
  /** Температура в цельсии */
  temp?: string;
  /** Время в городе */
  localTime?: string;
};

const Card: React.FC<CardProps> = ({
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
  temp,
  localTime,
}) => {
  const imageText = getTextFromReactNode(title);
  const isPreview = variant === 'preview';

  return (
    <div onClick={onClick} className={cn(s.card, { [s.card_single]: !isPreview }, className)}>
      <Image isLoading={isLoading} src={isLoading ? undefined : image} alt={imageText} variant={variant} />
      <div className={s.card__body}>
        <div className={s['card__body-top']}>
          {isLoading ||
            (isPreview && (
              <Text isLoading={isLoading} view={'p-14'} color={'secondary'}>
                {captionSlot}
              </Text>
            ))}
          <Text isLoading={isLoading} view={isPreview ? 'p-20' : 'title'} weight={'bold'} maxLines={2}>
            {title}
          </Text>
          <Text isLoading={isLoading} view={isPreview ? 'p-16' : 'p-20'} color={'secondary'} maxLines={3}>
            {subtitle}
          </Text>
          <Like cityId={cityId} />
          {!isPreview && <Comment cityId={cityId} />}
          {(temp || localTime) && (
            <div className={s.card__info}>
              {temp && (
                <Text isLoading={isLoading} view={'p-18'} weight={'bold'}>
                  {temp}
                </Text>
              )}
              {localTime && (
                <Text isLoading={isLoading} view={'p-18'} weight={'bold'}>
                  {localTime}
                </Text>
              )}
            </div>
          )}
        </div>
        <div className={s['card__body-bottom']}>
          {isPreview && (
            <Text isLoading={isLoading} view={isPreview ? 'p-18' : 'title'} weight={'bold'} className={s.card__price}>
              {contentSlot}
            </Text>
          )}
          <div className={s.card__actions}>
            {actionSlot}
            {!isPreview && (
              <Button className={s.card__button} skeletonLoading={true}>
                More info
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
