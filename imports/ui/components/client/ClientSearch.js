import React, { useMemo, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { fullName } from '/imports/api/utils';


const ClientSearch = ({ onClientSelect }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);

  const debouncedSearch = useMemo(() => _.debounce((query) => {
    console.log('searchClient');
    setIsLoading(true);
    Meteor.call('searchClient', query, (err, res) => {
      setIsLoading(false);
      if (err) {
        setSearchResults([]);
      } else {
        setSearchResults(res);
      }
    });
  }, 1000), []);


  function getSuggestionValue(suggestion) {
    return fullName(suggestion);
  }

  function renderSuggestion(suggestion) {
    return <div>{fullName(suggestion)} ({suggestion.schema})</div>;
  }

  function onSuggestionsFetchRequested({ value }) {
    debouncedSearch(value);
  }

  function onSuggestionsClearRequested() {
    setSearchResults([]);
  }

  function onSuggestionSelected(event, { suggestion }) {
    setSelectedClient(suggestion);
    if (onClientSelect) {
      onClientSelect(suggestion);
    }
  }

  function onChange(event, { newValue }) {
    setSearchString(newValue);
  }

  function onClearSearch() {
    setSearchString('');
    setSelectedClient(null);
    onClientSelect(null);
  }

  return (
    <div style={{ marginBottom: 10 }}>
      <Autosuggest
        style={{ display: 'inline' }}
        suggestions={searchResults}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        onSuggestionSelected={onSuggestionSelected}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        focusInputOnSuggestionClick={false}
        inputProps={{
          placeholder: 'Search for a client',
          value: searchString,
          onChange,
        }}
      />
      {isLoading && 'Searching...'}
      {selectedClient &&
        <button
          style={{ marginLeft: 8 }}
          className="btn btn-default"
          onClick={onClearSearch}
        >
          Clear
        </button>
      }
    </div>
  );
};

export default ClientSearch;
