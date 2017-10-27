import React from 'react';
import SortableTree from 'react-sortable-tree';
import ItemInspector from '/imports/ui/components/surveyBuilder/ItemInspector.js';

export default class SurveyBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      definition: JSON.parse(props.survey.definition),
      currentItem: null,
    };
    this.generateNodeProps = this.generateNodeProps.bind(this);
    this.handleItemChange = this.handleItemChange.bind(this);
  }

  componentWillMount() {
    this.setState({
      treeData: this.definitionToTree(this.state.definition),
    });
  }

  componentDidUpdate() {
  }

  getTreeProps(treeData) {
    const nodeProps = {};
    (function getNodeProps(children = []) {
      children.forEach(node => {
        nodeProps[node.definition.id] = Object.assign(nodeProps[node.definition.id] || {}, {
          expanded: node.expanded,
        });
        getNodeProps(node.children);
      });
    }(treeData));
    return nodeProps;
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
      ],
    };
  }

  handleItemChange(updatedItem) {
    const definition = ((function updateDefinitionItem(root, item) {
      if (root.id === item.id) {
        Object.assign(root, item);
      }
      _.each(root.items || [], (child) => { updateDefinitionItem(child, item); });
      return root;
    })(this.state.definition, updatedItem));
    this.setState({
      definition,
      treeData: this.definitionToTree(definition, this.state.treeData),
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

  render() {
    return (
      <div className="survey-builder">
        <div className="tree-view">
          <SortableTree
            treeData={this.state.treeData}
            onChange={treeData => this.setState({ treeData })}
            generateNodeProps={this.generateNodeProps}
          />
        </div>
        <div className="item-inspector">
          {this.renderItemInspector()}
        </div>
      </div>
    );
  }
}
