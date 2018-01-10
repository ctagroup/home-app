import React from 'react';
import Modal from 'react-modal';
import connectField from 'uniforms/connectField';
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


class QuestionPickerField extends React.Component {
  constructor() {
    super();
    this.state = {
      isModalOpened: false,
      searchString: '',
    };
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleSeachChange = this.handleSeachChange.bind(this);
  }

  handleOpenModal() {
    this.setState({ isModalOpened: true });
  }

  handleCloseModal() {
    this.setState({
      isModalOpened: false,
      searchString: '',
    });
  }

  handleSeachChange(event) {
    this.setState({ searchString: event.target.value });
  }

  handlePickQuestion(question) {
    this.props.onChange(question.hmisId);
    this.setState({ isModalOpened: false });
  }

  renderModal() {
    const filteredQuestions = this.props.questions.filter(
      q => stringContains(q.title, this.state.searchString)
    );
    const items = filteredQuestions.map(q => (
      <li key={q.hmisId} className="question">
        <button
          className="btn btn-default pick-question"
          onClick={() => this.handlePickQuestion(q)}
        >
          Pick
        </button>
        <span className="question-text">{q.title}</span>
      </li>
    ));

    return (
      <Modal
        isOpen={this.state.isModalOpened}
        onRequestClose={this.handleCloseModal}
        style={customStyles}
        ariaHideApp={false}
      >
        <p>Pick a question:
          <input
            className="question-search"
            type="text"
            value={this.state.searchString}
            onChange={this.handleSeachChange}
            placeholder="Search for a question"
          />
        </p>
        <ul className="questions-list">{items}</ul>
      </Modal>
    );
  }

  render() {
    const originalTitle = this.props.questions
      .filter(q => q.hmisId === this.props.value)
      .map(q => q.title)
      .pop();
    return (
      <div>
        <strong>Associated Question</strong><br />
        <p><strong>Id:</strong> {this.props.value || 'n/a'}</p>
        <p><strong>Title:</strong> {originalTitle}</p>
        <p>
          <button className="btn btn-default" onClick={this.handleOpenModal}>
            Pick Question
          </button>
          &nbsp;
          <button className="btn btn-warning" onClick={() => { this.props.onChange(''); }}>
            Clear
          </button>
        </p>
        {this.renderModal()}
      </div>
    );
  }
}

export default connectField(QuestionPickerField);
