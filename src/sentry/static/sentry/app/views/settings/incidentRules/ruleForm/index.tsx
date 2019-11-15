import findIndex from 'lodash/findIndex';
import React from 'react';

import {Project} from 'app/types';
import {addErrorMessage} from 'app/actionCreators/indicator';
import {deleteTrigger} from 'app/views/settings/incidentRules/actions';
import {tct} from 'app/locale';
import Form from 'app/views/settings/components/forms/form';
import RuleForm from 'app/views/settings/incidentRules/ruleForm/ruleForm';
import SentryTypes from 'app/sentryTypes';
import Triggers from 'app/views/settings/incidentRules/triggers';
import withApi from 'app/utils/withApi';
import withConfig from 'app/utils/withConfig';
import withProject from 'app/utils/withProject';

import {IncidentRule, Trigger} from '../types';

type Props = {
  project: Project;
  rule: IncidentRule;
  incidentRuleId?: string;
} & Pick<React.ComponentProps<typeof RuleForm>, 'api' | 'config' | 'organization'> & {
    onSubmitSuccess?: Form['props']['onSubmitSuccess'];
  };

type State = {
  rule: IncidentRule;
  projects: Project[];
};

class RuleFormContainer extends React.Component<Props, State> {
  static contextTypes = {
    project: SentryTypes.Project,
  };

  state: State = {
    rule: this.props.rule,
    projects: [this.props.project],
  };

  handleAddTrigger = () => {
    this.setState(({rule}) => ({
      rule: {
        ...rule,
        triggers: [...rule.triggers, {}],
      },
    }));
  };

  handleEditTrigger = (trigger: Trigger) => {
    this.setState(({rule}) => {
      const triggerIndex = findIndex(rule.triggers, ({id}) => id === trigger.id);
      const triggers = [...rule.triggers];
      triggers.splice(triggerIndex, 1, trigger);

      return {
        rule: {
          ...rule,
          triggers,
        },
      };
    });
  };

  handleDeleteTrigger = async (trigger: Trigger) => {
    const {api, organization} = this.props;

    // Optimistically update
    const triggerIndex = findIndex(this.state.rule.triggers, ({id}) => id === trigger.id);
    const triggersAfterDelete = [...this.state.rule.triggers];
    triggersAfterDelete.splice(triggerIndex, 1);

    this.setState(({rule}) => {
      return {
        rule: {
          ...rule,
          triggers: triggersAfterDelete,
        },
      };
    });

    // Trigger is potentially unsaved if it does not have an id, so don't try to remove from server
    if (!trigger.id) {
      return;
    }

    try {
      await deleteTrigger(api, organization.slug, trigger);
    } catch (err) {
      addErrorMessage(
        tct('There was a problem deleting trigger: [label]', {label: trigger.label})
      );

      // Add trigger back to list
      this.setState(({rule}) => {
        const triggers = [...rule.triggers];
        triggers.splice(triggerIndex, 0, trigger);

        return {
          rule: {
            ...rule,
            triggers,
          },
        };
      });
    }
  };

  render() {
    const {api, config, organization, incidentRuleId, onSubmitSuccess} = this.props;
    const {rule} = this.state;

    return (
      <Form
        apiMethod={incidentRuleId ? 'PUT' : 'POST'}
        apiEndpoint={`/organizations/${organization.slug}/alert-rules/${
          incidentRuleId ? `${incidentRuleId}/` : ''
        }`}
        initialData={rule}
        saveOnBlur={false}
        onSubmitSuccess={onSubmitSuccess}
      >
        <RuleForm
          api={api}
          config={config}
          organization={organization}
          rule={rule}
          projects={this.state.projects}
        />
        <Triggers
          projects={this.state.projects}
          rule={rule}
          organization={organization}
          incidentRuleId={incidentRuleId}
          onDelete={this.handleDeleteTrigger}
          onEdit={this.handleEditTrigger}
          onAdd={this.handleAddTrigger}
        />
      </Form>
    );
  }
}

export {RuleFormContainer};
export default withConfig(withApi(withProject(RuleFormContainer)));
