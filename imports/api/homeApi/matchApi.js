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

  createMatch({ name, score }) {
    const url = this.absoluteUrl('/api/v1/matching/');
    return this.doPost(url, {
      name,
      score,
    });
  }
  // TODO: cover with permissions:

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
    const url = this.absoluteUrl(`/api/v1/matching/matches/${clientMatchId}/`);
    return this.doGet(url);
  }

  createNote(clientMatchId, step, note) {
    const url = this.absoluteUrl('/api/v1/matching/notes/');
    return this.doPost(url, {
      step,
      note,
      clientMatch: clientMatchId,
    });
  }

  deleteNote(noteId) {
    const url = this.absoluteUrl(`/api/v1/matching/notes/${noteId}/`);
    return this.doDel(url);
  }

  getClientMatches(clientId) {
    const url = this.absoluteUrl(`/api/v1/clients/${clientId}/matches/`);
    return this.doGet(url);
  }
}

export default MatchApiClient;
