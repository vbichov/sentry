import React from 'react';
import styled from 'react-emotion';

import {t} from 'app/locale';
import Input from 'app/views/settings/components/forms/controls/input';
import SelectControl from 'app/components/forms/selectControl';

type Props = {
  isBelow: boolean;
  threshold: number;
};

function ThresholdControl({isBelow, threshold, ...props}: Props) {
  return (
    <div {...props}>
      <SelectControl
        value={isBelow ? t('Below') : t('Above')}
        options={[{value: true, label: t('Below')}, {value: false, label: t('Above')}]}
      />
      <Input placeholder="300" value={threshold} />
    </div>
  );
}

export default styled(ThresholdControl)`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 3fr;
`;
