import { ReactiveVar } from 'meteor/reactive-var';

import './dropdownHelper.html';

/**
 * A helper template to create a dropdown list of options:
 * @param placeholder — name of selection ; defaults to 'Select...'
 * @param options — list of available options in [{id, label}, ...] format ; defaults to []
 * @param key — output key to store selected value in Session
 */
Template.dropdownHelper.onCreated(function dropdownHelperOnCreated() {
  this.selected = this.data && this.data.store || new ReactiveVar(false);
});

Template.dropdownHelper.events(
  {
    'click .optionItem'(evt, tmpl) {
      tmpl.selected.set(this.value);
      Session.set(tmpl.data.key, this.value);
    },
  }
);

function formatOptions(data, selectedId, placeholder = 'Select...') {
  const options = data.map(({ id, label, name, title }) => ({
    value: id,
    label: label || name || title,
    selected: id === selectedId,
  }));
  return [{
    value: null,
    label: placeholder,
  }, ...options];
}

Template.dropdownHelper.helpers({
  selectedValue() {
    const selectedId = Template.instance() && Template.instance().selected.get();
    const selected = formatOptions(this && this.options || [], selectedId, this.placeholder)
      .filter(p => p.selected);
    if (selected.length) return selected[0].label;
    return this.placeholder || 'Select...';
  },
  options() {
    if (this && this.options) {
      const selectedId = Template.instance() && Template.instance().selected.get();
      return formatOptions(this.options, selectedId, this.placeholder);
    }
    return formatOptions([], null, this.placeholder);
  },
});
