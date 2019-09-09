import {RouteComponentProps} from 'react-router/lib/Router';
import React from 'react';

import {addSuccessMessage} from 'app/actionCreators/indicator';
import {t} from 'app/locale';
import AsyncView from 'app/views/asyncView';
import SettingsPageHeader from 'app/views/settings/components/settingsPageHeader';

import {IncidentRule} from './types';
import RuleForm from './ruleForm';

type State = {
  rule: IncidentRule;
} & AsyncView['state'];

type RouteParams = {
  orgId: string;
  incidentRuleId: string;
};
type Props = RouteComponentProps<RouteParams, {}>;

class IncidentRulesDetails extends AsyncView<Props, State> {
  getEndpoints() {
    const {orgId, incidentRuleId} = this.props.params;

    return [
      ['rule', `/projects/${orgId}/alert-rules/${incidentRuleId}/`] as [string, string],
    ];
  }

  handleSubmitSuccess = () => {
    addSuccessMessage(t('Successfully saved Incident Rule'));
  };

  renderBody() {
    const {orgId, incidentRuleId} = this.props.params;
    return (
      <div>
        <SettingsPageHeader title={t('Edit Incident Rule')} />

        <RuleForm
          orgId={orgId}
          incidentRuleId={incidentRuleId}
          onSubmitSuccess={this.handleSubmitSuccess}
          initialData={this.state.rule}
        />
      </div>
    );
  }
}

export default IncidentRulesDetails;
