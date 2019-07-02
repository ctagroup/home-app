import { init } from '@rematch/core';
import clientPage from '/imports/ui/models/clientPage';

const store = init({
  models: { clientPage },
});

export default store;
