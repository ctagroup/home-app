import moment from 'moment';


export function translateString(str, translations) {
  if (typeof str !== 'string') return str;
  return Object.keys(translations).reduce((translated, key) => {
    const parts = translated.split(key);
    return parts.join(translations[key]);
  }, str);
}

export const dataCollectionStages = {
  ENTRY: 1,
  UPDATE: 2,
  EXIT: 3,
  ANNUAL: 5, // Annual Assessments
};

export const dataCollectionStageNames =
  Object.keys(dataCollectionStages)
  .reduce((acc, key) => ({ ...acc, [dataCollectionStages[key]]: key.toLowerCase() }), {});

export const getStageId = (name) => dataCollectionStages[name.toUpperCase()];
export const getStageName = (id) => dataCollectionStageNames[id];
export const formatDate = (date) => (date ? moment(date).format('MM/DD/YYYY') : '');
export const formatDateTime = (date) => moment(date).format('MM/DD/YYYY h:mm A');
