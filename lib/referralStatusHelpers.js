/**
 * Created by udit on 18/10/16.
 */

referralStatusHelpers = {
  generateStatusTagMarkup(statusCode, timestamp = '') {
    const status = HomeConfig.collections.clients.referralStatus[statusCode];
    let timestampStr = '';
    if (timestamp) {
      timestampStr = `${timestamp} - `;
    }
    return `<span data-toggle="tooltip" title="${timestampStr}${status.desc}"
      class="js-tooltip label label-${status.cssClass}">${status.title}</span>`;
  },
};
