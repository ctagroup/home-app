import React, { useState } from 'react';

function RecepientsList(props) {
  const [recepients, setRecepients] = useState([]);
  const [newRecepient, setNewRecepient] = useState('');

  const removeRecepient = (email) => {
    setRecepients(recepients.filter(recepient => recepient !== email));
  };

  const renderInputForm = () => {
    const onSubmit = (e) => {
      e.preventDefault();
      setRecepients([...recepients, newRecepient]);
      setNewRecepient('');
    };
    const onChange = (e) => {
      setNewRecepient(e.target.value);
    };
    return (
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="newRecepientInput"> Enter recepient email </label>
          <div className="input-group">
            <span className="input-group-addon" id="basic-addon1">@</span>
            <input
              id="newRecepientInput"
              className="form-control"
              type="text"
              name="newRecepientInput"
              aria-describedby="basic-addon1"
              placeholder="Email"
              onChange={onChange}
              value={newRecepient}
            />
          </div>
        </div>
      </form>
      );
  };
  const renderRecepient = (recepientEmail) => (<div>
    <div className="input-group">
      <span className="input-group-addon" id="basic-addon1">@</span>
      <input
        type="text"
        className="form-control"
        placeholder="someEmail"
        aria-describedby="basic-addon1"
        value={recepientEmail}
        disabled
      />
      <span className="input-group-addon" id="basic-addon2">
        <a href="#" onClick={() => removeRecepient(recepientEmail)}>
          <i className="fa fa-times" />
        </a>
      </span>
    </div>
  </div>);

  return (
    <div>
      <label>
        Recepients List
        {recepients.map(renderRecepient)}
      </label>
      {renderInputForm()}
    </div>
  );
}

export default RecepientsList;
