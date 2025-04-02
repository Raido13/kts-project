import React from 'react';
import cn from 'classnames';
import Text from '@shared/components/Text';
import s from './Card.module.scss';
import { cardVariant } from '@shared/types/card';
import { getTextFromReactNode } from '@shared/utils';
import Button from '@shared/components/Button';
import { imageMock } from '@shared/mock/cities';
import { Image } from '@shared/components/Image';
import { Like } from '@shared/components/Like';

export type CardProps = {
  /** Дополнительный classname */
  className?: string;
  /** Вариант отображения */
  variant?: cardVariant;
  /** Id карточки */
  cardId: string;
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

const Card: React.FC<CardProps> = ({
  className,
  variant = 'preview',
  cardId,
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
    <div onClick={onClick} className={cn(s.card, { [s.card_single]: !isPreview }, className)}>
      <Image
        isLoading={isLoading}
        src={image ?? imageMock}
        alt={imageText}
        className={s.card__image}
        variant={variant}
      />
      <div className={s.card__body}>
        <div className={s['card__body-top']}>
          {captionSlot && (
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
          <Like cardId={cardId} />
        </div>
        <div className={s['card__body-bottom']}>
          {contentSlot && (
            <Text isLoading={isLoading} view={isPreview ? 'p-18' : 'title'} weight={'bold'} className={s.card__price}>
              {contentSlot}
            </Text>
          )}
          <div className={s.card__actions}>
            {actionSlot}
            {!isPreview && (
              <Button isSkeletonLoading={isLoading} className={s.card__button}>
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
