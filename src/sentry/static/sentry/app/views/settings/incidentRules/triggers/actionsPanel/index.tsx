import React from 'react';
import styled from 'react-emotion';

import {
  IncidentRule,
  Trigger,
  Action,
  ActionType,
  TargetType,
} from 'app/views/settings/incidentRules/types';
import {Organization, Project} from 'app/types';
import {PanelBody, PanelItem, PanelHeader} from 'app/components/panels';
import {t} from 'app/locale';
import LoadingIndicator from 'app/components/loadingIndicator';
import SelectControl from 'app/components/forms/selectControl';
import SelectMembers from 'app/components/selectMembers';
import space from 'app/styles/space';
import withOrganization from 'app/utils/withOrganization';

type Props = {
  organization: Organization;
  projects: Project[];
  rule: IncidentRule;
  loading: boolean;
  error: boolean;

  actions: Action[];
  className?: string;
  trigger?: Trigger;
  onAdd: (type: Action['type']) => void;
  onChange: (index: number, action: Action) => void;
};

const ActionLabel = {
  [ActionType.EMAIL]: t('E-mail'),
  [ActionType.SLACK]: t('Slack'),
  [ActionType.PAGER_DUTY]: t('Pagerduty'),
};

const TargetLabel = {
  [TargetType.USER]: t('Member'),
  [TargetType.TEAM]: t('Team'),
};

class ActionsPanel extends React.Component<Props> {
  handleAddAction = (value: {label: string; value: Action['type']}) => {
    this.props.onAdd(value.value);
  };

  handleChangeTarget = (index: number, value) => {
    const {actions} = this.props;
    const newAction = {
      ...actions[index],
      targetType: Number(value.value),
      targetIdentifier: '',
    };

    this.props.onChange(index, newAction);
  };

  handleChangeTargetIdentifier = (index, value) => {
    const {actions} = this.props;
    const newAction = {
      ...actions[index],
      targetIdentifier: value.value,
    };

    this.props.onChange(index, newAction);
  };

  render() {
    const {actions, loading, organization, projects, rule} = this.props;

    const items = Object.entries(ActionLabel).map(([value, label]) => ({value, label}));

    return (
      <React.Fragment>
        <PanelSubHeader>
          <div>{t('Actions')}</div>
        </PanelSubHeader>
        <PanelBody>
          {loading && <LoadingIndicator />}
          {actions.map((action: Action, i: number) => {
            const isUser = action.targetType === TargetType.USER;
            const isTeam = action.targetType === TargetType.TEAM;

            return (
              <PanelItemGrid key={i}>
                {ActionLabel[action.type]}

                <SelectControl
                  value={action.targetType}
                  options={Object.entries(TargetLabel).map(([value, label]) => ({
                    value,
                    label,
                  }))}
                  onChange={this.handleChangeTarget.bind(this, i)}
                />

                {(isUser || isTeam) && (
                  <SelectMembers
                    key={isTeam ? 'team' : 'member'}
                    showTeam={isTeam}
                    project={projects.find(({slug}) => slug === rule.projects[0])}
                    organization={organization}
                    value={action.targetIdentifier}
                    onChange={this.handleChangeTargetIdentifier.bind(this, i)}
                  />
                )}
              </PanelItemGrid>
            );
          })}
          <PanelItem>
            <StyledSelectControl
              placeholder={t('Add an Action')}
              onChange={this.handleAddAction}
              options={items}
            />
          </PanelItem>
        </PanelBody>
      </React.Fragment>
    );
  }
}

const ActionsPanelWithSpace = styled(ActionsPanel)`
  margin-top: ${space(4)};
`;

const PanelSubHeader = styled(PanelHeader)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: ${space(1)} ${space(2)};
`;

const PanelItemGrid = styled(PanelItem)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  grid-gap: ${space(2)};
`;

const StyledSelectControl = styled(SelectControl)`
  width: 100%;
`;

export default withOrganization(ActionsPanelWithSpace);
