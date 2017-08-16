import './singleGlobalHouseholdMember.html';


Template.singleGlobalHouseholdMember.helpers(
  {
    isHOH(hohId, currentId) {
      return currentId === hohId ? 'checked' : '';
    },
    isRelationshipToHOHSelected(relationshipToHeadOfHousehold, currentVal) {
      return currentVal === relationshipToHeadOfHousehold ? 'selected' : '';
    },
  }
);
