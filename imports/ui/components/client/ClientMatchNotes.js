import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Alert from '/imports/ui/alert';


export function CreateNoteForm({ onCreateNote, permissions }) {
  const [note, setNote] = useState('');
  const [emailTitle, setEmailTitle] = useState('');
  const [emailRecipients, setEmailRecipients] = useState('');
  const [sendByEmail, setSendByEmail] = useState(false);

  function handleSendByEmail() {
    setSendByEmail(!sendByEmail);
  }

  return (
    <form>
      <p><strong>New Note</strong></p>
      <div className="form-group">
        <textarea
          className="form-control"
          disabled={!permissions.canUpdateReferrals}
          onChange={e => setNote(e.target.value)}
          value={note}
        />
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              disabled={!permissions.canUpdateReferrals}
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
                  disabled={!permissions.canUpdateReferrals}
                  className="form-control"
                  value={emailTitle}
                  onChange={e => setEmailTitle(e.target.value)}
                />
                <label>Recipients</label>
                <input
                  type="text"
                  disabled={!permissions.canUpdateReferrals}
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
        className="btn btn-default"
        disabled={!permissions.canUpdateReferrals}
        onClick={e => {
          e.preventDefault();
          onCreateNote({
            note,
            sendByEmail,
            emailTitle: sendByEmail ? emailTitle : '',
            emailRecipients: sendByEmail ? emailRecipients.split(',') : [],
          });
          setNote('');
          setEmailTitle('');
          setEmailRecipients('');
        }}
      >Create Note</button>
    </form>
  );
}

export default function ClientMatchNotes({ matchId, step, handleDataReload, permissions }) {
  const [lastDataFetch, setLastDataFetch] = useState(new Date());
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    Meteor.call('matchApi', 'getClientMatch', matchId, (err, res) => {
      if (err) {
        setNotes([{
          id: '0',
          text: `An error has occurred ${err}`,
        }]);
      } else {
        setNotes(res.notes);
      }
    });
  }, [lastDataFetch]);

  function handleCreateNote({ note, sendByEmail, emailTitle, emailRecipients }) {
    handleDataReload();
    Meteor.call('matching.createNote', matchId, step, note, err => {
      if (err) {
        Alert.error(err);
      } else {
        Alert.success('Note created');
        setLastDataFetch(new Date());
        if (sendByEmail) {
          Meteor.call('matching.sendNoteByEmail', emailTitle, note, emailRecipients, err2 => {
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

  function handleDeleteNote(noteId) {
    handleDataReload();
    Meteor.call('matching.deleteNote', noteId, err => {
      if (err) {
        Alert.error(err);
      } else {
        Alert.success('Note deleted');
        setLastDataFetch(new Date());
      }
    });
  }

  function renderNotes() {
    const notesForThisStep = notes.filter(n => n.step == step); // eslint-disable-line
    if (notesForThisStep.length === 0) {
      return <p><em>No notes for this step</em></p>;
    }
    const items = notesForThisStep.map(n => (
      <li key={n.id}>
        {moment(n.created).format('M/D/Y')}:
        &nbsp;{n.note} (<a href="#" onClick={() => handleDeleteNote(n.id)}>Delete</a>)
      </li>
    ));
    return <ul>{items}</ul>;
  }

  return (
    <div>
      <div><strong>Notes</strong></div>
      {renderNotes()}
      <br />
      <CreateNoteForm onCreateNote={handleCreateNote} permissions={permissions} />
    </div>
  );
}
