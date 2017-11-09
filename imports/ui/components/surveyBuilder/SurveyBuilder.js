import _ from 'lodash';
import React from 'react';
import SortableTree from 'react-sortable-tree';
import { trimText } from '/imports/api/utils';
import Alert from '/imports/ui/alert';
import FormInspector from '/imports/ui/components/surveyBuilder/FormInspector.js';
import ItemInspector from '/imports/ui/components/surveyBuilder/ItemInspector.js';
import QuestionModal from './QuestionModal';

let count = 1;
function generateItemId(type) {
  return `${type}-${count++}`;
}

export default class SurveyBuilder extends React.Component {
  constructor(props) {
    super(props);
    const definition = JSON.parse(props.survey.definition);
    this.state = {
      definition,
      inspectedItem: null, // definition.items[1].items[0].items[0],
      questionModalIsOpen: false,
    };
    this.generateNodeProps = this.generateNodeProps.bind(this);
    this.handleItemChange = this.handleItemChange.bind(this);
    this.handleCloseInspector = this.handleCloseInspector.bind(this);
    this.openQuestionModal = this.openQuestionModal.bind(this);
    this.handleCloseQuestionModal = this.handleCloseQuestionModal.bind(this);
    this.addSectionToDefinition = this.addSectionToDefinition.bind(this);
    this.addScoreToDefinition = this.addScoreToDefinition.bind(this);
    this.handleSaveFormDefinition = this.handleSaveFormDefinition.bind(this);
  }

  componentWillMount() {
    const treeData = this.generateTree(this.state.definition);
    this.setState({
      treeData,
    });
  }

  getTreeProps(treeData) {
    const nodeProps = {};
    (function getNodeProps(children = []) {
      children.forEach(node => {
        nodeProps[node.definition.id] = Object.assign(nodeProps[node.definition.id] || {}, {
          expanded: node.expanded,
          isFromBank: !!node.definition.hmisId,
        });
        getNodeProps(node.children);
      });
    }(treeData));
    return nodeProps;
  }

  addSectionToDefinition() {
    const item = {
      id: generateItemId('section', this.state.definition),
      title: 'New Section',
      type: 'section',
    };
    return this.handleItemAdd(item, this.state.definition);
  }

  addScoreToDefinition() {
    const item = {
      id: generateItemId('score', this.state.definition),
      text: 'New Score',
      type: 'score',
    };
    return this.handleItemAdd(item, this.state.definition);
  }

  addQuestionToDefinition(question) {
    const item = {
      ...question,
      id: question.id || question._id,
      type: 'question',
      hmisId: question._id, // TODO: replace with .hmisId in the future
    };
    delete item._id;
    delete item.updatedAt;
    delete item.createdAt;
    delete item.version;

    return this.handleItemAdd(item, this.state.definition);
  }

  generateTree(definition, prevTree = []) {
    return this.definitionToTree(definition, prevTree);
  }

  itemToTree(item, nodeProps) {
    return Object.assign({
      title: this.renderItem(item),
      subtitle: `${item.type} (${item.id})`,
      children: item.items ? item.items.map(child => this.itemToTree(child, nodeProps)) : undefined,
      className: item.type,
      definition: item,
    }, nodeProps[item.id]);
  }

  definitionToTree(definition, prevTree) {
    const nodeProps = this.getTreeProps(prevTree);
    const tree = definition.items.map(item => this.itemToTree(item, nodeProps));
    return tree;
  }

  generateNodeProps({ node }) {
    return {
      buttons: [
        <button
          onClick={() => {
            this.setState({ inspectedItem: node.definition });
          }}
        >Edit</button>,
        <button
          onClick={() => { this.handleItemDelete(node.definition.id); }}
        >Delete</button>,
      ],
    };
  }

  handleItemAdd(newItem, parent) {
    parent.items.push(newItem);
    const treeData = this.generateTree(this.state.definition, this.state.treeData);
    this.setState({
      definition: this.state.definition,
      treeData,
    });
    return newItem;
  }

  handleItemChange(updatedItem) {
    console.log(updatedItem);
    const definition = ((function updateItem(root, item) {
      if (root.id === item.id) {
        // TODO: handle ID update
        Object.assign(root, item);
      }
      _.each(root.items || [], (child) => { updateItem(child, item); });
      return root;
    })(this.state.definition, updatedItem));

    const treeData = this.generateTree(definition, this.state.treeData);
    this.setState({
      definition,
      treeData,
    });
  }

  handleItemDelete(itemId) {
    ((function deleteItem(parent) {
      const items = parent.items || [];
      const idx = _.findIndex(items, (child) => child.id === itemId);
      if (idx === -1) {
        items.forEach((item) => deleteItem(item));
      } else {
        items.splice(idx, 1);
      }
    })(this.state.definition, itemId));

    const treeData = this.generateTree(this.state.definition, this.state.treeData);
    this.setState({
      definition: this.state.definition,
      treeData,
    });
  }

  handleCloseInspector() {
    this.setState({ inspectedItem: null });
  }

  openQuestionModal() {
    this.setState({ questionModalIsOpen: true });
  }

  handleCloseQuestionModal(event, question) {
    let addedQuestion;
    if (question === null) {
      const newQuestion = {
        id: generateItemId('question'),
        title: 'New Question',
        category: 'text',
      };
      addedQuestion = this.addQuestionToDefinition(newQuestion);
    } else {
      addedQuestion = this.addQuestionToDefinition(question);
    }
    this.setState({
      questionModalIsOpen: false,
      inspectedItem: addedQuestion,
    });
  }

  handleSaveFormDefinition() {
    const surveyId = this.props.survey._id;
    const definition = this.state.definition;

    const surveyDoc = {
      title: definition.title || 'Untitled Survey',
      active: false,
      editable: true,
      definition: JSON.stringify(definition),
    };

    if (surveyId) {
      const updatedDoc = Object.assign(this.props.survey, surveyDoc);
      Meteor.call('surveys.update', surveyId, updatedDoc, (err) => {
        if (err) {
          Alert.error(err);
        } else {
          Alert.success('Survey updated');
          Router.go('adminDashboardsurveysView');
        }
      });
    } else {
      Meteor.call('surveys.create', surveyDoc, (err) => {
        if (err) {
          Alert.error(err);
        } else {
          Alert.success('Survey created');
          Router.go('adminDashboardsurveysView');
        }
      });
    }
  }

  renderItem(item) {
    return trimText(item.title || item.text, 50);
  }

  renderItemInspector() {
    const item = this.state.inspectedItem;
    if (!item) {
      return null;
    }

    const originalQuestion = _.find(this.props.questions, q => q._id === item.id);

    return (<ItemInspector
      item={Object.assign({}, item)}
      originalQuestion={originalQuestion}
      onChange={this.handleItemChange}
      onClose={this.handleCloseInspector}
    />);
  }

  renderFormInspector() {
    return (<FormInspector
      definition={this.state.definition}
      onChange={this.handleItemChange}
    />);
  }

  renderQuestionModal() {
    const nodeProps = this.getTreeProps(this.state.treeData);
    const validQuestions = this.props.questions.filter(
      q => !(nodeProps[q._id] && nodeProps[q._id].isFromBank)
    );

    return (<QuestionModal
      isOpen={this.state.questionModalIsOpen}
      handleClose={this.handleCloseQuestionModal}
      questions={validQuestions}
    />);
  }

  render() {
    const externalNodeType = 'yourNodeType';
    const { shouldCopyOnOutsideDrop } = this.state;
    const isNewSurvey = !this.props.survey._id;
    return (
      <div>
        {<div>
          <button className="btn btn-default" onClick={this.openQuestionModal}>
            Add Question
          </button>
          <button className="btn btn-default" onClick={this.addSectionToDefinition}>
            Add Section
          </button>
          <button className="btn btn-default" onClick={this.addScoreToDefinition}>
            Add Score
          </button>
        </div>}
        <div className="survey-builder">
          <div className="tree-view">
            <SortableTree
              treeData={this.state.treeData}
              onChange={treeData => this.setState({ treeData })}
              generateNodeProps={this.generateNodeProps}
              dndType={externalNodeType}
              shouldCopyOnOutsideDrop={shouldCopyOnOutsideDrop}
            />
          </div>
          {this.state.inspectedItem ? this.renderItemInspector() : this.renderFormInspector()}
        </div>
        {this.renderQuestionModal()}
        <button
          className="btn btn-primary"
          onClick={this.handleSaveFormDefinition}
        >
          {isNewSurvey ? 'Create' : 'Update'}
        </button>
      </div>
    );
  }
}
