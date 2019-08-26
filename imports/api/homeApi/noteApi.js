import HomeApiClient from './homeApiClient';


class NoteApiClient extends HomeApiClient {
  getNotesForEntity(objectId, objectType) {
    const url = this.absoluteUrl(`/api/v1/notes/filter/${objectId}/${objectType}/`);
    return this.doGet(url);
  }

  createNote({ objectUuid, objectType, noteType = 'general', title = '', description = '' }) {
    const url = this.absoluteUrl('/api/v1/notes/');
    return this.doPost(url, {
      objectUuid,
      objectType,
      noteType,
      title,
      description,
    });
  }

  getNote(id) {
    const url = this.absoluteUrl(`/api/v1/notes/${id}/`);
    return this.doGet(url);
  }

  updateNote(id, fields) {
    const url = this.absoluteUrl(`/api/v1/notes/${id}/`);
    return this.doPatch(url, fields);
  }

  deleteNote(id) {
    const url = this.absoluteUrl(`/api/v1/notes/${id}/`);
    return this.doDel(url);
  }
}

export default NoteApiClient;
