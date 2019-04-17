import React from 'react';
import { formatDate, formatDateTime } from '/imports/both/helpers';

import { ClientName } from './ClientName';
import { Link } from './Link';
import { ErrorLabel } from './ErrorLabel';

export { ClientName, Link, ErrorLabel };

export const Date = ({ date }) => <span>{formatDate(date)}</span>;

export const DateTime = ({ date }) => <span>{formatDateTime(date)}</span>;
