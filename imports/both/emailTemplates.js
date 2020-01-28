import { fullName } from '/imports/api/utils';


export const referralNoteEmail = ({ dedupClientId, step, note, user }) =>
`
<p>Hello,</p>

<p>This is a message from the the Monterey CARS system in regards to the following client
<b>${dedupClientId}</b> currently in the referral process. The client is currently on
step <b>${step.id} (${step.title})</b>.</p>

<p>${note}</p>

<p>This message was sent on behalf of ${fullName(user)}, please reply to this message at
the following address: ${user.emailAddress}</p>

<p>Thanks.</p>
`;
