import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import HomeApiClient from './homeApiClient';


class TagApiClient extends HomeApiClient {
  getTagsForClient(clientId) {
    const url = this.absoluteUrl(`/api/v1/clients/${clientId}/tags/`);
    return this.doGet(url);
  }

  createClientTag({ clientId, appliedOn, operation, tagId }) {
    const url = this.absoluteUrl('/api/v1/tags/');
    return this.doPost(url, {
      clientId,
      appliedOn,
      operation,
      tagId,
      createdBy: Meteor.userId(),
    });
  }

  createTag({ name, score }) {
    const url = this.absoluteUrl('/api/v1/tags/');
    return this.doPost(url, {
      name,
      score,
    });
  }
  // TODO: cover with permissions:

  getTags() {
    const url = this.absoluteUrl('/api/v1/tags/');
    return this.doGet(url);
  }

  getTag(id) {
    const url = this.absoluteUrl(`/api/v1/tags/${id}/`);
    return this.doGet(url);
  }

  // NB: Only admins can edit tags:
  updateTag(id, { name, score }) {
    Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
    const url = this.absoluteUrl(`/api/v1/tags/${id}/`);
    return this.doPatch(url, {
      name,
      score,
    });
  }

  deleteTag(id) {
    Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
    const url = this.absoluteUrl(`/api/v1/tags/${id}/`);
    return this.doDel(url);
  }
}

export default TagApiClient;
