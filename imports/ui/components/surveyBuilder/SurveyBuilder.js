import _ from 'lodash';
import React from 'react';
import SortableTree from 'react-sortable-tree';
import ItemInspector from '/imports/ui/components/surveyBuilder/ItemInspector.js';


export default class SurveyBuilder extends React.Component {
  constructor(props) {
    super(props);
    const definition = JSON.parse(props.survey.definition);
    this.state = {
      definition,
      currentItem: definition.items.length ? definition.items[0] : null,
    };
    this.generateNodeProps = this.generateNodeProps.bind(this);
    this.handleItemChange = this.handleItemChange.bind(this);
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

  addQuestionToDefinition(question) {
    const item = { ...question, id: question._id, type: 'question', hmisId: question._id };
    delete item._id;
    delete item.updatedAt;
    delete item.createdAt;
    delete item.version;

    this.handleItemAdd(item, this.state.definition);
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
            this.setState({
              currentItem: node.definition,
            });
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
  }

  handleItemChange(updatedItem) {
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

  renderItem(item) {
    return item.title;
  }

  renderItemInspector() {
    const item = this.state.currentItem;
    if (!item) {
      return null;
    }
    return <ItemInspector item={item} onChange={this.handleItemChange} />;
  }

  renderQuestionBank() {
    const nodeProps = this.getTreeProps(this.state.treeData);

    const validQuestions = this.props.questions.filter(
      q => !(nodeProps[q._id] && nodeProps[q._id].isFromBank)
    );
    const items = validQuestions.map(q => (
      <li key={q._id}>
        <span>{q.title}</span>
        <button onClick={() => this.addQuestionToDefinition(q)}>Add</button>
      </li>
    ));
    return (
      <div className="question-bank">
        <h4>Question Bank</h4>
        <ul>
          {items}
        </ul>
      </div>
    );
  }

  render() {
    const externalNodeType = 'yourNodeType';
    const { shouldCopyOnOutsideDrop } = this.state;
    return (
      <div>
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
          {this.renderItemInspector()}
        </div>
        {this.renderQuestionBank()}
      </div>
    );
  }
}
