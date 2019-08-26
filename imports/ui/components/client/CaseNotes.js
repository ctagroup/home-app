import moment from 'moment';
import React, { useState, useEffect } from 'react';
import Alert from '/imports/ui/alert';
import { formatDateTime } from '/imports/both/helpers';


const CaseNote = ({ id, title, description, createdBy, modified, onEdit, onDelete }) => (
  <React.Fragment>
    <div style={{ float: 'right' }}>
      <div className="dropdown">
        <button
          className="btn btn-default dropdown-toggle"
          type="button"
          id={`dropdownMenu${id}`}
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="true"
        >
          <i className="fa fa-cog" style={{ marginRight: 4 }}></i>
          <span className="caret"></span>
        </button>
        <ul className="dropdown-menu" aria-labelledby={`dropdownMenu${id}`}>
          <li><a href="#" onClick={() => onEdit({ id })}>Edit</a></li>
          <li role="separator" className="divider"></li>
          <li><a href="#" onClick={() => onDelete({ id })}>Delete</a></li>
        </ul>
      </div>
    </div>
    <h4 className="list-group-item-heading">{title}</h4>
    <p className="list-group-item-text">{description}</p>
    <div style={{ fontSize: '80%', color: 'gray', marginTop: 10 }}>
      By {createdBy.fullName} on {formatDateTime(modified)}
    </div>
  </React.Fragment>
);

const CaseNoteInlineEdit = ({ id = 0, title, description, onSave, onCancel, isSubmitting }) => {
  const [editTitle, setEditTitle] = useState(title || '');
  const [editDescription, setEditDescription] = useState(description || '');
  return (
    <form>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          className="form-control"
          id="title"
          placeholder="Note title"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          className="form-control"
          rows="3"
          onChange={(e) => setEditDescription(e.target.value)}
          value={editDescription}
        />
      </div>
      <button
        className="btn btn-primary"
        disabled={isSubmitting}
        onClick={(e) => {
          e.preventDefault();
          onSave({ id, title: editTitle, description: editDescription });
        }}
      >Save</button>
      &nbsp;
      <button
        className="btn btn-default"
        onClick={(e) => {
          e.preventDefault();
          onCancel(id);
        }}
      >Cancel</button>
    </form>
  );
};


const CaseNotes = ({ client }) => {
  const [editedNoteId, setEditedNoteId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc');
  const [lastDataFetch, setLastDataFetch] = useState(0);

  const sortOrderLabels = {
    asc: 'Oldest to newest',
    desc: 'Newest to oldest',
  };

  const [notes, setNotes] = useState([]);

  useEffect(() => {
    Meteor.call('caseNotes.list', client.dedupClientId, (err, res) => {
      if (err) {
        Alert.error(err);
        setNotes([]);
      } else {
        setNotes(res);
      }
    });
  }, [client.dedupClientId, lastDataFetch]);

  function handleNoteCreate({ title, description }) {
    setIsSubmitting(true);
    const data = {
      clientId: client.dedupClientId,
      title,
      description,
    };
    Meteor.call('caseNotes.create', data, (err) => {
      setIsSubmitting(false);
      if (err) {
        Alert.error(err);
      } else {
        Alert.success('Note created');
        setEditedNoteId(null);
        setLastDataFetch(lastDataFetch + 1);
      }
    });
  }

  function handleNoteUpdate({ id, title, description }) {
    setIsSubmitting(true);
    Meteor.call('caseNotes.update', { id, title, description }, (err) => {
      setIsSubmitting(false);
      if (err) {
        Alert.error(err);
      } else {
        Alert.success('Note updated');
        setEditedNoteId(null);
        setLastDataFetch(lastDataFetch + 1);
      }
    });
  }

  function handleNoteDelete(id) {
    setIsSubmitting(true);
    Meteor.call('caseNotes.delete', id, (err) => {
      setIsSubmitting(false);
      if (err) {
        Alert.error(err);
      } else {
        Alert.success('Note deleted');
        setLastDataFetch(lastDataFetch + 1);
      }
    });
  }

  function handleSortChange(direction) {
    setSortOrder(direction);
  }

  const sortedNotes = notes.sort((a, b) => (sortOrder === 'asc' ?
    moment(a.modified) - moment(b.modified) : moment(b.modified) - moment(a.modified)
  ));

  return (
    <React.Fragment>
      <div className="d-flex justify-content-between">
        <h3>Client case notes</h3>
        <div style={{ marginTop: 10, color: 'gray' }}>
          Sort By&nbsp;
          <div className="dropdown" style={{ display: 'inline-block' }}>
            <button
              className="btn btn-default dropdown-toggle"
              type="button"
              id="sortDropdown"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="true"
            >
              {sortOrderLabels[sortOrder]}
              <span className="caret"></span>
            </button>
            <ul className="dropdown-menu" aria-labelledby="sortDropdown">
              <li>
                <a href="#" onClick={() => { handleSortChange('desc'); }}>{sortOrderLabels.desc}</a>
              </li>
              <li>
                <a href="#" onClick={() => { handleSortChange('asc'); }}>{sortOrderLabels.asc}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <ul className="list-group">
        {sortedNotes.map(n => (n.id === editedNoteId ?
          <li className="list-group-item" key={n.id}>
            <CaseNoteInlineEdit
              id={n.id}
              title={n.title}
              description={n.description}
              onSave={handleNoteUpdate}
              onCancel={() => setEditedNoteId(null)}
              isSubmitting={isSubmitting}
            />
          </li>
          :
          <li className="list-group-item" key={n.id}>
            <CaseNote
              {...n}
              onEdit={() => setEditedNoteId(n.id)}
              onDelete={() => handleNoteDelete(n.id)}
            />
          </li>
        ))}

        {editedNoteId === 0 &&
          <li className="list-group-item" key={0}>
            <CaseNoteInlineEdit
              onSave={editedNoteId === 0 ? handleNoteCreate : handleNoteUpdate}
              onCancel={() => setEditedNoteId(null)}
              isSubmitting={isSubmitting}
            />
          </li>
        }
        {editedNoteId === null &&
          <li className="list-group-item" key="new-button">
            <a href="#" onClick={() => setEditedNoteId(0)}>
              <i className="fa fa-plus" style={{ marginRight: 4 }}></i>Add note
            </a>
          </li>
        }
      </ul>
    </React.Fragment>
  );
};

export default CaseNotes;
