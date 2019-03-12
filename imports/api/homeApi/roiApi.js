import HomeApiClient from './homeApiClient';


class RoiApiClient extends HomeApiClient {
  getRoisForClient(clientId) {
    const url = this.absoluteUrl(`/api/v1/clients/${clientId}/rois/`);
    return this.doGet(url);
  }

  createRoi({ clientId, startDate, endDate, notes, signature }) {
    const url = this.absoluteUrl('/api/v1/rois/');
    return this.doPost(url, {
      clientId,
      startDate,
      endDate,
      notes,
      signature,
    });
  }

  getRoi(id) {
    const url = this.absoluteUrl(`/api/v1/rois/${id}/`);
    return this.doGet(url);
  }

  updateRoi(id, { startDate, endDate, notes }) {
    const url = this.absoluteUrl(`/api/v1/rois/${id}/`);
    return this.doPatch(url, {
      startDate,
      endDate,
      notes,
    });
  }

  deleteRoi(id) {
    const url = this.absoluteUrl(`/api/v1/rois/${id}/`);
    return this.doDel(url);
  }
}

export default RoiApiClient;
