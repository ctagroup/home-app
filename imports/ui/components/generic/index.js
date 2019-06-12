import React from 'react';
import { formatDate, formatDateTime } from '/imports/both/helpers';

import { ClientName } from './ClientName';
import { Link } from './Link';
import { ErrorLabel } from './ErrorLabel';
import { Warning } from './Warning';

export { ClientName, Link, ErrorLabel, Warning };

export const Date = ({ date }) => <span>{formatDate(date)}</span>;

export const DateTime = ({ date }) => <span>{formatDateTime(date)}</span>;
