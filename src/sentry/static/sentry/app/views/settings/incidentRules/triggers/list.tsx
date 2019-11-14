import React from 'react';

import {IncidentRule, Trigger} from 'app/views/settings/incidentRules/types';
import {Organization, Project} from 'app/types';
import {Panel, PanelBody, PanelHeader} from 'app/components/panels';
import {t} from 'app/locale';
import TriggerForm from 'app/views/settings/incidentRules/triggers/form';

type Props = {
  organization: Organization;
  projects: Project[];
  rule: IncidentRule;
  triggers: Trigger[];
  onDelete: (trigger: Trigger) => void;
  onEdit: (trigger: Trigger) => void;
};

export default class TriggersList extends React.Component<Props> {
  handleEdit = (trigger: Trigger) => {
    this.props.onEdit(trigger);
  };

  handleDelete = (trigger: Trigger) => {
    this.props.onDelete(trigger);
  };

  handleSave = () => {};

  render() {
    const {organization, projects, rule, triggers} = this.props;

    const isEmpty = triggers && !triggers.length;

    return (
      <Panel>
        <PanelHeader>{t('Define Trigger')}</PanelHeader>
        <PanelBody>
          {isEmpty ? (
            <TriggerForm
              organization={organization}
              projects={projects}
              rule={rule}
              trigger={null}
              onSave={this.handleSave}
            />
          ) : (
            triggers.map((trigger, index) => {
              return (
                <TriggerForm
                  key={index}
                  organization={organization}
                  projects={projects}
                  rule={rule}
                  trigger={trigger}
                  onSave={this.handleSave}
                />
              );
            })
          )}
        </PanelBody>
      </Panel>
    );
  }
}
