import React from 'react';

function ClientEligibility(props) {
  const { eligibleClient, client } = props;
  if (eligibleClient.error) return null;
  return (<div className="row margin-top-35">{client.id}</div>);
  // return (
  //   <div className="row margin-top-35">
  //     <div className="col-xs-12">
  //       {eligibleClient.ignoreMatchProcess &&
  //         <div className="form-group">
  //           <h3>Matching Eligibility Status</h3>
  //           <p><strong>Removal notes: </strong>{eligibleClient.remarks}</p>
  //         </div>
  //       }
  //       {eligibleClient.ignoreMatchProcess &&
  //         <input className="btn btn-warning addToHousingList" value="Add client to active list" type="button" />
  //       }
  //       {!eligibleClient.ignoreMatchProcess &&
  //         <div>
  //           <div class='input-group js-datepicker'>
  //             <span class="input-group-addon">
  //               <i class="fa fa-calendar"></i>
  //             </span>
  //             <input id="removalDate" class="set-removal-date form-control" type="text" style="width: fit-content" />
  //           </div>
  //           <div class="form-group">
  //             <label for="removalReason">Choose a reason to delete: </label>
  //             <select class="removalReason form-control" name="removalReason" id="removalReason">
  //               {{#each reasonsList}}
  //                 <option value={{id}}>{{text}}</option>
  //               {{/each}}
  //             </select>
  //           </div>
  //           {{#if showRemovalDetails}}
  //           <div class="form-group">
  //             <label for="removalRemarks"> Additional notes </label>
  //             <input id="removalRemarks" class="form-control" type="text" name="removalRemarks" placeholder="Removal notes">
  //           </div>
  //           {{/if}}
  //           <input class="btn btn-danger removeFromHousingList" value="Remove client from active list" type="button" />
  //         </div>
  //       }
  //     </div>
  //   </div>
  // );
}

export default ClientEligibility;
