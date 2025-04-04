import { Range } from '@shared/types/slider';
import { FC, HTMLAttributes } from 'react';
import cn from 'classnames';
import s from './Slider.module.scss';
import { observer } from 'mobx-react-lite';
import { citiesStore } from '@shared/stores';

interface SliderProps extends Omit<HTMLAttributes<HTMLInputElement>, 'onChange'> {
  /** Минимальное значение карточек, от 3 до 30 */
  min?: Range<3, 9>;
  /** Максимальное значение карточек, от 4 до 31 */
  max?: Range<4, 10>;
  /** Дополнительный класс */
  className?: string;
}

const STEP = 1;
const FILL_OFFSET = 8;

export const Slider: FC<SliderProps> = observer(({ min = 3, max = 30, className, ...props }) => {
  const { viewPerPage, setViewPerPage } = citiesStore;
  const markList = [];

  for (let i = min; i <= max; i += STEP) {
    markList.push(i);
  }

  const getPercentage = (n: number) => ((n - min) / (max - min)) * 100;
  const percentage = getPercentage(viewPerPage);

  return (
    <div className={cn(s.slider, className)}>
      <input
        type={'range'}
        min={min}
        max={max}
        onChange={(e) => setViewPerPage(Number(e.target.value) as Range<3, 10>)}
        className={s.slider__range}
        {...props}
      />
      <div className={s.slider__track}>
        <div className={s.slider__marks}>
          {markList.map((m) => {
            const markPercentage = getPercentage(m);

            return <div key={m} className={s[`slider__marks-item`]} style={{ left: `${markPercentage}%` }} />;
          })}
        </div>
        <div className={s.slider__fill} style={{ width: `calc(${percentage}% + ${FILL_OFFSET}px)` }} />
        <div className={s.slider__thumb} style={{ left: `${percentage}%` }} />
      </div>
    </div>
  );
});
