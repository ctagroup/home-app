import React from 'react';

export default class Item extends React.Component {
  renderTitle() {
    const title = `${this.props.item.title}`;
    switch (this.props.level) {
      case 1:
        return <h1 className="title">{title}</h1>;
      case 2:
        return <h2 className="title">{title}</h2>;
      case 3:
        return <h3 className="title">{title}</h3>;
      case 4:
        return <h4 className="title">{title}</h4>;
      case 5:
        return <h5 className="title">{title}</h5>;
      case 6:
        return <h6 className="title">{title}</h6>;
      default:
        return <div className="title">{title}</div>;
    }
  }

  renderTitleHTML(html) {
    switch (this.props.level) {
      case 1:
        return <h1 className="title" dangerouslySetInnerHTML={{ __html: html }} />;
      case 2:
        return <h2 className="title" dangerouslySetInnerHTML={{ __html: html }} />;
      case 3:
        return <h3 className="title" dangerouslySetInnerHTML={{ __html: html }} />;
      case 4:
        return <h4 className="title" dangerouslySetInnerHTML={{ __html: html }} />;
      case 5:
        return <h5 className="title" dangerouslySetInnerHTML={{ __html: html }} />;
      case 6:
        return <h6 className="title" dangerouslySetInnerHTML={{ __html: html }} />;
      default:
        return <div className="title" dangerouslySetInnerHTML={{ __html: html }} />;
    }
  }
}
