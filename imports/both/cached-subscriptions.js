/**
 * Created by pgorecki on 04.05.17.
 */

// TODO: this should be moved to client-only code when router is moved to client as well

import { SubsManager } from 'meteor/meteorhacks:subs-manager';

export const CollectionsCountCache = new SubsManager();
export const ClientsCache = new SubsManager();
export const EligibleClientsCache = new SubsManager();
export const HousingMatchCache = new SubsManager();
export const HousingUnitsCache = new SubsManager();
export const GlobalHouseholdsCache = new SubsManager();
