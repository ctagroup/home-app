import React from 'react';
import Alert from '/imports/ui/alert';
import { useStore } from '/imports/ui/components/hooks';


const initialState = {
  client: {
    suffix: '',
    ssn: '',
  },
  eligibleClient: {
    dedupClientId: null,
    error: false,
    ignoreMatchProcess: true, // if true then removed from match process
    remarks: '', // removal remarks
  },
  enrollments: [],
  referrals: [],
};

const actions = {
  setClient: (store, payload) => {
    store.setState({
      client: payload,
    });
  },

  setEligibleClient: (store, payload) => {
    store.setState({
      eligibleClient: payload,
    });
  },

  addToActiveList: (store, payload) => {
    console.log('add', payload);
    const eligibleClient = store.state.eligibleClient;
    const { dedupClientId } = payload;
    Meteor.call('eligibleClients.ignoreMatchProcess', dedupClientId, false, (err) => {
      if (err) {
        Alert.error('Failed to add client to active list', err);
      } else {
        store.setState({
          eligibleClient: {
            ...eligibleClient,
            ignoreMatchProcess: false,
          },
        });
        Alert.success('Client added to the matching process');
      }
    });
  },

  removeFromActiveList: (store, payload) => {
    console.log('rem', payload);
    const eligibleClient = store.state.eligibleClient;
    const { dedupClientId, removalReason, removalRemarks } = payload;
    const remarks = removalRemarks || removalReason;
    Meteor.call('eligibleClients.ignoreMatchProcess', dedupClientId, true, remarks, (err) => {
      if (err) {
        Alert.error('Failed to remove client from active list', err);
      } else {
        store.setState({
          eligibleClient: {
            ...eligibleClient,
            ignoreMatchProcess: true,
            remarks,
          },
        });
        Alert.success('Client removed for the matching process');
      }
    });
  },
};

export const useGlobalStore = useStore(React, initialState, actions);
