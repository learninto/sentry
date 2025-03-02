import {Body, Header} from 'react-bootstrap/lib/Modal';
import styled from 'react-emotion';
import PropTypes from 'prop-types';
import React from 'react';
import {addErrorMessage, addSuccessMessage} from 'app/actionCreators/indicator';
import _ from 'lodash';
import {Location} from 'history';

import {SentryApp} from 'app/types';
import {t} from 'app/locale';
import Form from 'app/views/settings/components/forms/form';
import FormModel from 'app/views/settings/components/forms/model';
import JsonForm from 'app/views/settings/components/forms/jsonForm';
import space from 'app/styles/space';

class PublishRequestFormModel extends FormModel {
  getTransformedData() {
    const data = this.getData();
    //map object to list of questions
    const questionnaire = Array.from(this.fieldDescriptor.values()).map(field => {
      //we read the meta for the question that has a react node for the label
      return {
        question: field.meta || field.label,
        answer: data[field.name],
      };
    });
    return {questionnaire};
  }
}

type Props = {
  app: SentryApp;
  location: Location;
  closeModal: () => void;
};

export default class SentryAppPublishRequestModal extends React.Component<Props> {
  static propTypes = {
    app: PropTypes.object.isRequired,
  };

  form = new PublishRequestFormModel();

  get formFields() {
    const {app} = this.props;
    //replace the : with a . so we can reserve the colon for the question
    const scopes = app.scopes.map(scope => scope.replace(/:/, '-'));
    const scopeQuestionBaseText =
      'Please justify why you are requesting each of the following scopes: ';
    const scopeQuestionPlainText = `${scopeQuestionBaseText}${scopes.join(', ')}.`;

    const scopeLabel = (
      <React.Fragment>
        {scopeQuestionBaseText}
        {scopes.map((scope, i) => (
          <React.Fragment key={scope}>
            {i > 0 && ', '} <code>{scope}</code>
          </React.Fragment>
        ))}
        .
      </React.Fragment>
    );

    //No translations since we need to be able to read this email :)
    const baseFields = [
      {
        type: 'textarea',
        required: true,
        label: 'What does your integration do? Please be as detailed as possible.',
        autosize: true,
        rows: 1,
        inline: false,
      },
      {
        type: 'textarea',
        required: true,
        label: 'What value does it offer customers?',
        autosize: true,
        rows: 1,
        inline: false,
      },
      {
        type: 'textarea',
        required: true,
        label: scopeLabel,
        autosize: true,
        rows: 1,
        inline: false,
        meta: scopeQuestionPlainText,
      },
      {
        type: 'textarea',
        required: true,
        label: 'Do you operate the web service your integration communicates with?',
        autosize: true,
        rows: 1,
        inline: false,
      },
    ];
    //dynamically generate the name based off the index
    return baseFields.map((field, index) =>
      Object.assign({name: `question${index}`}, field)
    );
  }

  handleSubmitSuccess = () => {
    addSuccessMessage(t('Request to publish %s successful.', this.props.app.slug));
    this.props.closeModal();
  };

  handleSubmitError = () => {
    addErrorMessage(t('Request to publish %s fails.', this.props.app.slug));
  };

  render() {
    const {app} = this.props;
    const endpoint = `/sentry-apps/${app.slug}/publish-request/`;
    const forms = [
      {
        title: t('Questions to answer'),
        fields: this.formFields,
      },
    ];
    return (
      <React.Fragment>
        <Header>{t('Publish Request Questionnaire')}</Header>
        <Body>
          <Explanation>
            {t(
              `Please fill out this questionnaire in order to get your integration evaluated for publication.
              Once your integration has been approved, users outside of your organization will be able to install it.`
            )}
          </Explanation>
          <Form
            allowUndo
            apiMethod="POST"
            apiEndpoint={endpoint}
            onSubmitSuccess={this.handleSubmitSuccess}
            onSubmitError={this.handleSubmitError}
            model={this.form}
            submitLabel={t('Request Publication')}
            onCancel={() => this.props.closeModal()}
          >
            <JsonForm location={this.props.location} forms={forms} />
          </Form>
        </Body>
      </React.Fragment>
    );
  }
}

const Explanation = styled('div')`
  margin: ${space(1.5)} 0px;
  font-size: 18px;
`;
