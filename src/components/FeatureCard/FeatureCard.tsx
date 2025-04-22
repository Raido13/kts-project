import { FC } from 'react';
import Text from '@shared/components/Text';
import cn from 'classnames';
import s from './FeatureCard.module.scss';

interface FeatureCardProps {
  text: string;
  className?: string;
}

export const FeatureCard: FC<FeatureCardProps> = ({ text, className }) => (
  <div className={cn(s.feature, className)}>
    <Text tag={'p'} view={'p-16'} color={'accent'} className={s.feature__text}>
      {text}
    </Text>
  </div>
);
