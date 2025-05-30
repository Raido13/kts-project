import { Range } from '@shared/types/slider';
import { FC, HTMLAttributes, useMemo } from 'react';
import cn from 'classnames';
import s from './Slider.module.scss';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@shared/hooks';

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

export const Slider: FC<SliderProps> = observer(({ min = 3, max = 10, className, ...props }) => {
  const rootStore = useRootStore();
  const { setViewPerPage } = rootStore.paginationStore;
  const viewPerPage = rootStore.paginationStore.viewPerPage;
  const paginatedCities = rootStore.citiesDataStore.paginatedCities;
  const markList = [];

  for (let i = min; i <= max; i += STEP) {
    markList.push(i);
  }

  const getPercentage = (n: number) => ((n - min) / (max - min)) * 100;
  const percentage = getPercentage(viewPerPage <= max ? viewPerPage : max);
  const isDisabled = useMemo(
    () => paginatedCities.length < min || paginatedCities.length > max,
    [max, min, paginatedCities]
  );

  return (
    <div className={cn(s.slider, className)}>
      <input
        type={'range'}
        min={min}
        max={max}
        onChange={(e) => setViewPerPage(Number(e.target.value) as Range<3, 10>)}
        className={s.slider__range}
        disabled={isDisabled}
        {...props}
      />
      <div className={s.slider__track}>
        <div className={s.slider__marks}>
          {markList.map((m) => {
            const markPercentage = getPercentage(m);

            return <div key={m} className={s[`slider__marks-item`]} style={{ left: `${markPercentage}%` }} />;
          })}
        </div>
        <div
          className={cn(s.slider__fill, isDisabled && s.slider__fill_disabled)}
          style={{ width: `calc(${percentage}% + ${FILL_OFFSET}px)` }}
        />
        <div
          className={cn(s.slider__thumb, isDisabled && s.slider__thumb_disabled)}
          style={{ left: `${percentage}%` }}
        />
      </div>
    </div>
  );
});
