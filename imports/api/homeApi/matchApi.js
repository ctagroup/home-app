// import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import HomeApiClient from './homeApiClient';


class MatchApiClient extends HomeApiClient {
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
}

export default MatchApiClient;
