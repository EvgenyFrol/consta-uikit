import './Slider.css';

import React, { useEffect } from 'react';

import { cn } from '../../utils/bem';
import { Popover } from '../Popover/Popover';
import { Text } from '../Text/Text';

import { checkFill, getPercent } from './helpers';
import { useActive } from './useActive';
import { useSlider } from './useSlider';

export type SliderProps = {
  className?: string;
  step?: number | number[];
  min: number;
  max: number;
  disabled?: boolean;
  division?: boolean;
  getTooltipContent: (value: number) => string;
  value?: number[] | number;
  onChange?: (
    event: Event | React.TouchEvent | React.MouseEvent,
    value: number,
    index: number,
  ) => void;
  onAfterChange?: (
    event: Event | React.TouchEvent | React.MouseEvent,
    value: number,
    index: number,
  ) => void;
  onChangeCommitted?: (event: Event | React.TouchEvent | React.MouseEvent, value: number[]) => void;
  prefix?:
    | React.ReactNode
    | (({ value }: { value: number | number[] }) => React.ReactElement)
    | undefined;
  suffix?:
    | React.ReactNode
    | (({ value }: { value: number | number[] }) => React.ReactElement)
    | undefined;
};

export const cnSlider = cn('Slider');

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>((props, ref) => {
  const { className, step = 1, disabled, getTooltipContent, division, prefix, suffix } = props;
  const {
    isActiveOne,
    changerActiveOne,
    isActiveTwo,
    changerActiveTwo,
    pointValueOne,
    pointValueTwo,
    clearActive,
  } = useActive();
  const {
    handleTouchStart,
    handleMouseDown,
    popoverPosition,
    sliderRef,
    valueDerived,
    dividedValue,
    minValue,
    maxValue,
    range,
    stopListening,
  } = useSlider(props, { clearActive, pointValueOne, pointValueTwo });

  useEffect(() => {
    return () => {
      if (isActiveOne || isActiveTwo) stopListening();
    };
  }, [minValue, maxValue, isActiveOne, isActiveTwo]);

  return (
    <div className={cnSlider({ disabled }, [className])} ref={ref}>
      {prefix && (
        <div className={cnSlider('Prefix', { disabled })}>
          {typeof prefix === 'function' ? prefix({ value: valueDerived }) : prefix}
        </div>
      )}
      <div
        role="button"
        aria-hidden="true"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        ref={sliderRef}
        className={cnSlider('Input', { division: division && !!step })}
      >
        {division && !!step && (
          <div className={cnSlider('Input-divided', { disabled })}>
            {dividedValue?.map((item, index) => (
              <div
                key={index}
                className={cnSlider('Input-divide', {
                  fill: checkFill(
                    dividedValue?.reduce((acc, item, i) => (i <= index - 1 ? acc + item : acc), 0),
                    valueDerived,
                    minValue,
                  ),
                  disabled,
                  active: isActiveOne || isActiveTwo,
                })}
                style={{ width: `${Math.min(getPercent(item, minValue, maxValue))}%` }}
              />
            ))}
          </div>
        )}
        {(!division || !step) && (
          <div
            className={cnSlider('fill', { isActive: isActiveOne || isActiveTwo, disabled })}
            style={{
              width: `${getPercent(
                Array.isArray(valueDerived)
                  ? valueDerived[1] - valueDerived[0]
                  : valueDerived - minValue,
                minValue,
                maxValue,
              )}%`,
              marginLeft: `${Math.min(
                Array.isArray(valueDerived)
                  ? getPercent(valueDerived[0] - minValue, minValue, maxValue)
                  : 0,
              )}%`,
            }}
          />
        )}
        {range.current && (
          <>
            <button
              type="button"
              aria-label="Left pin"
              onMouseDown={changerActiveOne.on}
              onTouchStart={changerActiveOne.on}
              className={cnSlider('Point', { isActive: isActiveOne || isActiveTwo, disabled })}
              ref={pointValueOne}
              style={{
                left: `${Math.trunc(
                  getPercent(
                    (Array.isArray(valueDerived) ? valueDerived[0] : valueDerived) - minValue,
                    minValue,
                    maxValue,
                  ),
                )}%`,
              }}
            />
            {!!getTooltipContent && isActiveOne && (
              <Popover
                direction="downCenter"
                spareDirection="upCenter"
                offset={18}
                position={popoverPosition}
              >
                <div className={cnSlider('Tooltip')}>
                  <Text size="xs">
                    {Math.round(Array.isArray(valueDerived) ? valueDerived[0] : valueDerived)}
                  </Text>
                </div>
              </Popover>
            )}
          </>
        )}
        <button
          type="button"
          aria-label="Right pin"
          onMouseDown={changerActiveTwo.on}
          onTouchStart={changerActiveTwo.on}
          className={cnSlider('Point', { isActive: isActiveOne || isActiveTwo, disabled })}
          ref={pointValueTwo}
          style={{
            left: `${Math.trunc(
              getPercent(
                (Array.isArray(valueDerived) ? valueDerived[1] : valueDerived) - minValue,
                minValue,
                maxValue,
              ),
            )}%`,
          }}
        />
        {!!getTooltipContent && isActiveTwo && (
          <Popover
            direction="downCenter"
            spareDirection="upCenter"
            offset={18}
            position={popoverPosition}
          >
            <div className={cnSlider('Tooltip')}>
              <Text size="xs">
                {getTooltipContent(Array.isArray(valueDerived) ? valueDerived[1] : valueDerived)}
              </Text>
            </div>
          </Popover>
        )}
      </div>
      {suffix && (
        <div className={cnSlider('Suffix', { disabled })}>
          {typeof suffix === 'function' ? suffix({ value: valueDerived }) : suffix}
        </div>
      )}
    </div>
  );
});
