import moment from 'moment';
import React, { useState } from 'react';
import Alert from '/imports/ui/alert';
import { formatDateTime } from '/imports/both/helpers';
import { referralNoteEmail } from '/imports/both/emailTemplates';


const ReferralNote = ({
    id, note, createdBy = { fullName: 'Unknown' }, modified, onEdit, onDelete, permissions,
  }) =>
    (<React.Fragment>
      <div style={{ float: 'right' }}>
        <div className="dropdown">
          <button
            className="btn btn-default dropdown-toggle"
            type="button"
            id={`dropdownMenu${id}`}
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="true"
            disabled={!permissions.canUpdateReferrals}
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
      <p className="list-group-item-text">{note}</p>
      <div style={{ fontSize: '80%', color: 'gray', marginTop: 10 }}>
        By {createdBy.fullName} on {formatDateTime(modified)}
      </div>
    </React.Fragment>);

const ReferralNoteInlineEdit = ({ original = {}, onSave, onCancel, isSubmitting }) => {
  const [note, setNote] = useState(original.note || '');
  const [emailTitle, setEmailTitle] = useState('');
  const [emailRecipients, setEmailRecipients] = useState('');
  const [sendByEmail, setSendByEmail] = useState(false);

  function handleSendByEmail() {
    setSendByEmail(!sendByEmail);
  }

  const buttonLabel = original.id ? 'Update Note' : 'Create Note';

  return (
    <form>
      <div className="form-group">
        <label>Note</label>
        <textarea
          className="form-control"
          onChange={e => setNote(e.target.value)}
          value={note}
        />
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              checked={sendByEmail}
              onChange={() => handleSendByEmail()}
            /> Send note by email
          </label>
        </div>
          {
            sendByEmail ?
              <div>
                <label>Email title</label>
                <input
                  type="text"
                  className="form-control"
                  value={emailTitle}
                  onChange={e => setEmailTitle(e.target.value)}
                />
                <label>Recipients</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="separate emails by comma"
                  value={emailRecipients}
                  onChange={e => setEmailRecipients(e.target.value)}
                />
              </div>
            :
            null
          }
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={isSubmitting}
        onClick={async e => {
          e.preventDefault();
          const savedSuccessfully = await onSave({
            ...original,
            note,
            sendByEmail,
            emailTitle: sendByEmail ? emailTitle : '',
            emailRecipients: sendByEmail ? emailRecipients.split(',') : [],
          });
          if (savedSuccessfully) {
            setNote('');
            setEmailTitle('');
            setEmailRecipients('');
          }
        }}
      >{buttonLabel}</button>
      &nbsp;
      <button
        className="btn btn-default"
        onClick={(e) => {
          e.preventDefault();
          onCancel(original.id);
        }}
      >Cancel</button>
    </form>
  );
};


const ReferralNotes = ({ matchId, step, dedupClientId, notes, config,
  handleDataReload, permissions }) => {
  const [editedNoteId, setEditedNoteId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc');

  const sortOrderLabels = {
    asc: 'Oldest to newest',
    desc: 'Newest to oldest',
  };

  function handleSortChange(direction) {
    setSortOrder(direction);
  }

  function handleNoteCreate({ note, sendByEmail, emailTitle, emailRecipients }) {
    const emailBody = referralNoteEmail({
      dedupClientId,
      step: config.steps.find(s => s.id === step),
      note,
      user: Meteor.user().services.HMIS,
    });

    setIsSubmitting(true);
    Meteor.call('matching.createNote', matchId, step, note, err => {
      setIsSubmitting(false);
      if (err) {
        Alert.error(err);
      } else {
        Alert.success('Note created');
        setEditedNoteId(null);
        handleDataReload();
        if (sendByEmail) {
          Meteor.call('matching.sendNoteByEmail', emailTitle, emailBody, emailRecipients, err2 => {
            if (err2) {
              Alert.error(err2);
            } else {
              Alert.success('Email send');
            }
          });
        }
      }
    });
  }


  function handleNoteUpdate({ id, note, sendByEmail, emailTitle, emailRecipients }) {
    const emailBody = referralNoteEmail({
      dedupClientId,
      step: config.steps.find(s => s.id === step),
      note,
      user: Meteor.user().services.HMIS,
    });

    setIsSubmitting(true);
    Meteor.call('matching.updateNote', id, note, err => {
      setIsSubmitting(false);
      if (err) {
        Alert.error(err);
      } else {
        Alert.success('Note updated');
        setEditedNoteId(null);
        handleDataReload();
        if (sendByEmail) {
          Meteor.call('matching.sendNoteByEmail', emailTitle, emailBody, emailRecipients, err2 => {
            if (err2) {
              Alert.error(err2);
            } else {
              Alert.success('Email send');
            }
          });
        }
      }
    });
  }

  function handleNoteDelete(id) {
    setIsSubmitting(true);
    Meteor.call('matching.deleteNote', id, err => {
      if (err) {
        Alert.error(err);
      } else {
        Alert.success('Note deleted');
        setIsSubmitting(false);
        handleDataReload();
      }
    });
  }

  const sortedNotes = notes
    .filter(n => n.step == step) // eslint-disable-line
    .sort((a, b) => (sortOrder === 'asc' ?
      moment(a.modified) - moment(b.modified) : moment(b.modified) - moment(a.modified)
    ));

  let currentStepTitle;
  try {
    currentStepTitle = config.steps.find(s => s.id == step).title; // eslint-disable-line
  } catch (err) {
    currentStepTitle = `Step ${step}`;
  }

  return (
    <React.Fragment>
      <div className="d-flex justify-content-between">
        <h4>{currentStepTitle} notes</h4>
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
        {sortedNotes.map(n => (n.id === editedNoteId && permissions.canUpdateReferrals ?
          <li className="list-group-item" key={n.id}>
            <ReferralNoteInlineEdit
              original={n}
              onSave={handleNoteUpdate}
              onCancel={() => setEditedNoteId(null)}
              isSubmitting={isSubmitting}
            />
          </li>
          :
          <li className="list-group-item" key={n.id}>
            <ReferralNote
              {...n}
              config={config}
              permissions={permissions}
              onEdit={() => setEditedNoteId(n.id)}
              onDelete={() => handleNoteDelete(n.id)}
            />
          </li>
        ))}

        {editedNoteId === 0 && permissions.canUpdateReferrals &&
          <li className="list-group-item" key={0}>
            <ReferralNoteInlineEdit
              onSave={editedNoteId === 0 ? handleNoteCreate : handleNoteUpdate}
              onCancel={() => setEditedNoteId(null)}
              isSubmitting={isSubmitting}
            />
          </li>
        }
        {editedNoteId === null && permissions.canUpdateReferrals &&
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

export default ReferralNotes;
