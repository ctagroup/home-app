import React from 'react';
import Question from './Question';
import Text from './Text';

export default class Section extends React.Component {
  renderItems() {
    const { formState, onChange, section } = this.props;
    const items = section.items || [];
    return items.map((item) => {
      switch (item.type) {
        case 'question':
          return (
            <Question
              key={`${item.type}:${item.id}`}
              item={item}
              formState={formState}
              onChange={onChange}
            />);
        case 'text':
          return (
            <Text
              key={`${item.type}:${item.id}`}
              item={item}
              formState={formState}
            />
          );
        default:
          return (<p key={`${item.type}:${item.id}`}>Unknown item: {item.type}</p>);
      }
    });
  }

  render() {
    return (
      <div>
        <h2>{this.props.section.title}</h2>
        {this.renderItems()}
      </div>
    );
  }
}
