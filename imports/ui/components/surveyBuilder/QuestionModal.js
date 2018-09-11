import React from 'react';
import Modal from 'react-modal';
import { stringContains } from '/imports/api/utils';


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 2000,
  },
};

export default class QuestionModal extends React.Component {
  constructor() {
    super();
    this.state = {
      searchString: '',
      hudQuestionsOnly: false,
    };
    this.handleSeachChange = this.handleSeachChange.bind(this);
    this.triggerHUD = this.triggerHUD.bind(this);
  }

  handleSeachChange(event) {
    this.setState({ searchString: event.target.value });
  }

  triggerHUD() {
    this.setState({ hudQuestionsOnly: !this.state.hudQuestionsOnly });
  }

  render() {
    // TODO: other schema versions select
    let filteredQuestions = this.props.questions.filter(
      q => stringContains(q.title, this.state.searchString)
    );
    if (this.props.hudSurvey && this.state.hudQuestionsOnly) {
      filteredQuestions = filteredQuestions.filter(q => q.hudQuestion);
    }
    const items = filteredQuestions.map(q => (
      <li key={q.hmisId}>
        <button onClick={(event) => this.props.handleClose(event, q)}>Add</button>
        <span>{q.title}</span>
      </li>
    ));

    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.handleClose}
        style={customStyles}
      >
        <h2>Add Question</h2>
        <p>Add a question from Question Bank.
          {this.props.hudSurvey && <span>
            <label>
              HUD only:
              <input
                type="checkbox"
                value={this.state.hudQuestionsOnly}
                onChange={this.triggerHUD}
              />
            </label>
            {this.state.hudQuestionsOnly && <select><option>2017</option></select>}
          </span>}
          <input
            type="text"
            value={this.state.searchString}
            onChange={this.handleSeachChange}
            placeholder="Search for a question"
          />
        </p>
        <ul className="questions-list">{items}</ul>
        or
        <button
          className="btn btn-primary"
          onClick={(event) => this.props.handleClose(event, null)}
        >
          Add new question
        </button>
      </Modal>
    );
  }
}
