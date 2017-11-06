import React from 'react';
import Modal from 'react-modal';

function stringContains(str, query) {
  const strLower = str.toLowerCase();
  const queryLower = query.toLowerCase();
  return strLower.indexOf(queryLower) !== -1;
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export default class QuestionModal extends React.Component {
  constructor() {
    super();
    this.state = {
      searchString: '',
    };
    this.handleSeachChange = this.handleSeachChange.bind(this);
  }

  handleSeachChange(event) {
    this.setState({ searchString: event.target.value });
  }

  render() {
    const filteredQuestions = this.props.questions.filter(
      q => stringContains(q.title, this.state.searchString)
    );
    const items = filteredQuestions.map(q => (
      <li key={q._id}>
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
          <input
            type="text"
            value={this.state.searchString}
            onChange={this.handleSeachChange}
            placeholder="Search for a question"
          />
        </p>
        {items}
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
