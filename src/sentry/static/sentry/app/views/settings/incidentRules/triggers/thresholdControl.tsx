import React from 'react';
import styled from 'react-emotion';

import {ThresholdControlValue} from 'app/views/settings/incidentRules/types';
import {t} from 'app/locale';
import Input from 'app/views/settings/components/forms/controls/input';
import SelectControl from 'app/components/forms/selectControl';
import space from 'app/styles/space';

type Props = ThresholdControlValue & {
  onChange: (value: {isBelow: boolean; threshold: string | number}) => void;
};

function ThresholdControl({isBelow, threshold, onChange, ...props}: Props) {
  const onChangeThresholdType = ({value}) => {
    onChange({isBelow: value, threshold});
  };
  const onChangeThreshold = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({isBelow, threshold: e.target.value});
  };

  return (
    <div {...props}>
      <SelectControl
        value={isBelow}
        options={[{value: true, label: t('Below')}, {value: false, label: t('Above')}]}
        onChange={onChangeThresholdType}
      />
      <Input
        type="number"
        placeholder="300"
        value={threshold}
        onChange={onChangeThreshold}
      />
    </div>
  );
}

export default styled(ThresholdControl)`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 3fr;
  grid-gap: ${space(1)};
`;
