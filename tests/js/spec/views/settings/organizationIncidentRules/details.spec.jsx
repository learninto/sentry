import {mount} from 'enzyme';
import React from 'react';

import {initializeOrg} from 'app-test/helpers/initializeOrg';
import IncidentRulesDetails from 'app/views/settings/organizationIncidentRules/details';

describe('Incident Rules Details', function() {
  it('renders', function() {
    const {organization, routerContext} = initializeOrg();
    const rule = TestStubs.IncidentRule();
    const req = MockApiClient.addMockResponse({
      url: `/projects/${organization.slug}/alert-rules/${rule.id}/`,
      body: rule,
    });
    mount(
      <IncidentRulesDetails
        params={{
          orgId: organization.slug,
          incidentRuleId: rule.id,
        }}
        organization={organization}
      />,
      routerContext
    );

    expect(req).toHaveBeenCalled();
  });
});
