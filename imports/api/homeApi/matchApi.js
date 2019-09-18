import moment from 'moment';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import HomeApiClient from './homeApiClient';


class MatchApiClient extends HomeApiClient {
  getMatchingConfigs() {
    const url = this.absoluteUrl('/api/v1/matching/configs/');
    return this.doGet(url);
  }

  createMatchingConfig(agencyId, config) {
    const url = this.absoluteUrl('/api/v1/matching/configs/');
    return this.doPost(url, {
      agencyId,
      config,
      // createdBy: Meteor.userId(),
    });
  }

  deleteMatchingConfig(configId) {
    const url = this.absoluteUrl(`/api/v1/matching/configs/${configId}/`);
    return this.doDel(url);
  }

  getMatches() {
    const url = this.absoluteUrl('/api/v1/matching/matches');
    return this.doGet(url);
  }

  getMatch(id) {
    const url = this.absoluteUrl(`/api/v1/matching/matches/${id}/`);
    return this.doGet(url);
  }

  // NB: Only admins can edit matching:
  updateMatch(id, { name, score }) {
    Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
    const url = this.absoluteUrl(`/api/v1/matching/matches/${id}/`);
    return this.doPatch(url, {
      name,
      score,
    });
  }

  deleteMatch(id) {
    Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
    const url = this.absoluteUrl(`/api/v1/matching/${id}/`);
    return this.doDel(url);
  }

  getClientMatch(clientMatchId) {
    // TODO: same as getMatch
    const url = this.absoluteUrl(`/api/v1/matching/matches/${clientMatchId}/`);
    return this.doGet(url);
  }

  getClientMatches(dedupClientId) {
    const url = this.absoluteUrl(`/api/v1/clients/${dedupClientId}/matches/`);
    const data = this.doGet(url);
    return data.map(m => ({
      // TODO: add history sorting on on API side (latest -> newest)
      ...m,
      history: m.history.sort((a, b) => moment(a.created) - moment(b.created)),
    }));
  }

  createNote(clientMatchId, step, note) {
    const url = this.absoluteUrl('/api/v1/matching/notes/');
    return this.doPost(url, {
      step,
      note,
      clientMatch: clientMatchId,
    });
  }

  updateNote(noteId, note) {
    const url = this.absoluteUrl(`/api/v1/matching/notes/${noteId}/`);
    return this.doPatch(url, { note });
  }

  deleteNote(noteId) {
    const url = this.absoluteUrl(`/api/v1/matching/notes/${noteId}/`);
    return this.doDel(url);
  }

  createHousingMatch(clientId, projectId, startDate) {
    const url = this.absoluteUrl('/api/v1/matching/matches/');
    return this.doPost(url, {
      clientId,
      projectId,
      startDate,
      type: 'housing',
      matchConfig: 1,
    });
  }

  createMatchHistory(matchId, step, outcome) {
    const url = this.absoluteUrl('/api/v1/matching/history/');
    return this.doPost(url, {
      clientMatchId: matchId,
      step,
      outcome,
    });
  }

  matchPartialUpdate(matchId, data) {
    const url = this.absoluteUrl(`/api/v1/matching/matches/${matchId}/`);
    return this.doPatch(url, data);
  }
}

export default MatchApiClient;
