import React from 'react';
import SurveyQuestion from '/imports/ui/components/SurveyQuestion';

export default class SurveySection extends React.Component {
  renderQuestions() {
    const { values, onChange, section } = this.props;
    const questions = section.questions || [];
    return questions.map(question => (
      <SurveyQuestion
        key={question.id}
        question={question}
        values={values}
        onChange={onChange}
      />
    ));
  }

  render() {
    return (
      <div>
        <h2>{this.props.section.title}</h2>
        {this.renderQuestions()}
      </div>
    );
  }
}
