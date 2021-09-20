import React from 'react';

import { defaultGetItemLabel, SelectProps } from '../../Select/helpers';
import { COMPONENT_NAME } from '../../Select/Select';
import { EventInterceptorHandler } from '../EventInterceptor';

export const useSelectEventsHandler = <PROPS extends SelectProps>(
  props: PROPS,
  handler: EventInterceptorHandler,
  controlRef: React.RefObject<HTMLDivElement | null>,
) => {
  const newProps: PROPS = { ...props };

  React.useEffect(() => {
    if (newProps.value) {
      const value = {
        component: COMPONENT_NAME,
        event: 'change',
        options: {
          placeholder: newProps.placeholder,
          label: newProps.getItemLabel
            ? newProps.getItemLabel(newProps.value)
            : defaultGetItemLabel(newProps.value),
          value: newProps.value,
          pageURL: window.location.href,
          DOMRef: controlRef.current,
        },
      };
      handler!(value);
    }
  }, [newProps.value]);

  return props as PROPS;
};
