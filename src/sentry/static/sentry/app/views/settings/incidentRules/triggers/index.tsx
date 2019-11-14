import React from 'react';
import styled from 'react-emotion';

import {IncidentRule, Trigger} from 'app/views/settings/incidentRules/types';
import {Organization, Project} from 'app/types';
import {t} from 'app/locale';
import Button from 'app/components/button';
import TriggersList from 'app/views/settings/incidentRules/triggers/list';
import withProjects from 'app/utils/withProjects';

type Props = {
  organization: Organization;
  projects: Project[];
  incidentRuleId?: string;
  rule: IncidentRule;

  onAdd: () => void;
  onEdit: (trigger: Trigger) => void;
  onDelete: (trigger: Trigger) => void;
};

class Triggers extends React.Component<Props> {
  handleNewTrigger = () => {};

  handleEditTrigger = () => {};

  render() {
    const {organization, projects, rule, onAdd, onDelete} = this.props;
    const hasTriggers = rule.triggers && rule.triggers.length > 0;

    return (
      <React.Fragment>
        <TriggersList
          organization={organization}
          projects={projects}
          rule={rule}
          triggers={rule.triggers}
          onDelete={onDelete}
          onEdit={this.handleEditTrigger}
        />

        {hasTriggers && (
          <FullWidthButton
            type="button"
            size="small"
            icon="icon-circle-add"
            disabled={!rule}
            onClick={onAdd}
          >
            {t('Add another Trigger')}
          </FullWidthButton>
        )}
      </React.Fragment>
    );
  }
}

const FullWidthButton = styled(Button)`
  width: 100%;
`;

export default withProjects(Triggers);
