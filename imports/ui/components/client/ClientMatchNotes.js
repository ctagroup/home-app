import React, { useState, useEffect } from 'react';
import Alert from '/imports/ui/alert';

function CreateNoteForm({ onCreateNote }) {
  const [note, setNote] = useState('a note');
  const [emailTitle, setEmailTitle] = useState('test email');
  const [emailRecipients, setEmailRecipients] = useState('przemyslaw@toptal.com');
  const [sendByEmail, setSendByEmail] = useState(true);

  function handleSendByEmail() {
    setSendByEmail(!sendByEmail);
  }

  return (
    <form>
      <p><strong>New Note</strong></p>
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
              onClick={() => handleSendByEmail()}
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
        className="btn btn-default"
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

export default function ClientMatchNotes({ matchId, step }) {
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
    return notes
      .filter(n => n.step == step) // eslint-disable-line
      .map(n => (
        <li key={n.id}>
          {n.note} (<a href="#" onClick={() => handleDeleteNote(n.id)}>Delete</a>)
        </li>
      ));
  }

  return (
    <div>
      <p>Notes for matchId {matchId} and step {step}:</p>
      <ul>Notes</ul>
      {renderNotes()}
      <br />
      <CreateNoteForm onCreateNote={handleCreateNote} />
    </div>
  );
}
