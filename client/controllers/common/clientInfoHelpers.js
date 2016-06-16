/**
 * Created by Kavi on 4/9/16.
 */
var gender_categories,veteranStatus,ethnicity_categories,race_categories,residencePrior,destination_category,relationship_categories,times_Homeless,disabling_cond;

var getUniversalElements=function(){
	var questionsCollection = adminCollectionObject("questions");
	var universalElements= questionsCollection.find({'category':'Universal Data Elements'}).fetch();

	for ( var i in universalElements ) {

		var q_name = universalElements[i].name;

		switch (q_name) {
			case "gender":
				gender_categories = universalElements[i].options;
				break;
			case "veteranStatus":
				veteranStatus = universalElements[i].options;
				break;
			case "ethnicity":
				ethnicity_categories = universalElements[i].options;
				break;
			case "race":
				race_categories=universalElements[i].options;
				break;
			case "residencePrior_to_entry":
				residencePrior = universalElements[i].options;
				break;
			case "destination":
				destination_category = universalElements[i].options;
				break;
			case "relationshiptohoh":
				relationship_categories = universalElements[i].options;
				break;
			case "timesHomelesspastthreeyears":
				times_Homeless = universalElements[i].options;
				break;
			case "disabling_cond":
				disabling_cond = universalElements[i].options;
				break;
		}

	}

};

Template.viewClient.helpers(
	{
		alertMessages: function () {
			var params = Router.current().params;
			if ( params && params.query && params.query.updated ) {
				return "<p class='notice bg-success text-success'>Client is updated successfully.</p>";
			}

			if ( params && params.query && params.query.addedToHMIS ) {
				return "<p class='notice bg-success text-success'>Client is added to HMIS successfully.</p>";
			}

			if ( params && params.query && params.query.addClientToHMISError ) {
				return "<p class='notice bg-danger text-danger'>Something went wrong while adding the client to HMIS. Please contact the administrator.</p>";
			}
		}
	}
);


Template.clientForm.helpers(
	{
		getUniversalElements:function () {
			getUniversalElements();
		},
		getFirstName: function () {

			if ( this && this.firstName ) {
				return this.firstName;
			}

			if ( Router.current().params.query && Router.current().params.query.firstName ) {
				return Router.current().params.query.firstName;
			}

			return "";
		},
		getDOB: function () {
			if ( this && this.dob ) {
				return moment(this.dob).format('MM/DD/YYYY');
			}

			return "";
		},
		getDefaultRace: function () {
			return [
				{
					value: '1',
					description: 'American Indian or Alaska Native'
				}, {
					value: '2',
					description: 'Asian'
				}, {
					value: '3',
					description: 'Black or African American'
				}, {
					value: '4',
					description: 'American Indian or Alaska Native'
				}, {
					value: '5',
					description: 'White'
				}
			];
		},
		getExtraRace:function () {
			return race_categories;
		},
		getDefaultEthnicity: function () {
			return [
				{
					value: '0',
					description: 'Non-Hispanic/Non-Latino'
				}, {
					value: '1',
					description: 'Hispanic/Latino'
				}
			];
		},
		getExtraEthnicity:function () {
			return ethnicity_categories;
		},
		getDefaultGender:function () {
			return [
				{
					value: '0',
					description: 'Female'
				}, {
					value: '1',
					description: 'Male'
				}, {
					value: '2',
					description: 'Transgender male to female'
				}, {
					value: '3',
					description: 'Transgender female to male'
				}, {
					value: '4',
					description: 'Other'
				}
			];
		},
		getExtraGender:function () {
			return gender_categories;
		},
		getDefaultVeteranStatus: function () {
			return [
				{
					value: '0',
					description: 'No'
				}, {
					value: '1',
					description: 'Yes'
				}
			];
		},
		getExtraVeteranStatusOptions:function () {
			return veteranStatus;
		},
		getDefaultDisablingCondition: function () {
			return [
				{
					value: '0',
					description: 'No'
				}, {
					value: '1',
					description: 'Yes'
				}
			];
		},
		getExtraDisablingCondition:function () {
			return disabling_cond;
		},
		getDefaultResidencePrior: function () {
			return [
				{
					value: '1',
					description: 'Emergency shelter, including hotel or motel paid for with emergency shelter'
				}, {
					value: '15',
					description: 'Foster care home or foster care group home'
				}, {
					value: '6',
					description: 'Hospital or other residential non-psychiatric medical facility'
				}, {
					value: '14',
					description: 'Hotel or motel paid for without emergency shelter voucher'
				}, {
					value: '7',
					description: 'Jail, prison or juvenile detention facility'
				}, {
					value: '24',
					description: 'Long-term care facility or nursing home'
				}, {
					value: '23',
					description: 'Owned by client, no ongoing housing subsidy'
				}, {
					value: '21',
					description: 'Owned by client, with ongoing housing subsidy'
				}, {
					value: '3',
					description: 'Permanent housing for formerly homeless persons'
				}, {
					value: '16',
					description: 'Place not meant for habitation'
				}, {
					value: '4',
					description: 'Psychiatric hospital or other psychiatric facility'
				}, {
					value: '22',
					description: 'Rental by client, no ongoing housing subsidy'
				}, {
					value: '19',
					description: 'Rental by client, with VASH subsidy'
				}, {
					value: '25',
					description: 'Rental by client, with GPD TIP subsidy'
				}, {
					value: '20',
					description: 'Rental by client, with other ongoing housing subsidy'
				}, {
					value: '26',
					description: 'Residential project or halfway house with no homeless criteria'
				}, {
					value: '18',
					description: 'Safe Haven'
				}, {
					value: '12',
					description: 'Staying or living in a family member’s room, apartment or house'
				}, {
					value: '13',
					description: 'Staying or living in a friend’s room, apartment or house'
				}, {
					value: '5',
					description: 'Substance abuse treatment facility or detox center'
				}, {
					value: '2',
					description: 'Transitional housing for homeless persons (including homeless youth)'
				}, {
					value: 'Other',
					description: 'Other'
				}
			];
		},
		getExtraResidencePrior:function () {
			return residencePrior;
		},
		getEntryDate: function () {
			if ( this && this.entryDate ) {
				return moment(this.entryDate).format('MM/DD/YYYY');
			}

			return "";
		},
		getExitDate: function () {
			if ( this && this.exitDate ) {
				return moment(this.exitDate).format('MM/DD/YYYY');
			}

			return "";
		},
		getDefaultDestination:function () {
			return [
				{
					value: '24',
					description: 'Deceased'
				}, {
					value: '1',
					description: 'Emergency shelter, including hotel or motel paid for with emergency shelter'
				}, {
					value: '15',
					description: 'Foster care home or foster care group home'
				}, {
					value: '6',
					description: 'Hospital or other residential non-psychiatric medical facility'
				}, {
					value: '14',
					description: 'Hotel or motel paid for without emergency shelter voucher'
				}, {
					value: '7',
					description: 'Jail, prison or juvenile detention facility'
				}, {
					value: '25',
					description: 'Long-term care facility or nursing home'
				}, {
					value: '26',
					description: 'Moved from one HOPWA funded project to HOPWA PH'
				}, {
					value: '27',
					description: 'Moved from one HOPWA funded project to HOPWA TH'
				}, {
					value: '11',
					description: 'Owned by client, no ongoing housing subsidy'
				}, {
					value: '21',
					description: 'Owned by client, with ongoing housing subsidy'
				}, {
					value: '3',
					description: 'Permanent housing for formerly homeless persons'
				}, {
					value: '16',
					description: 'Place not meant for habitation'
				}, {
					value: '4',
					description: 'Psychiatric hospital or other psychiatric facility'
				}, {
					value: '10',
					description: 'Rental by client, no ongoing housing subsidy'
				}, {
					value: '19',
					description: 'Rental by client, with VASH subsidy'
				}, {
					value: '28',
					description: 'Rental by client, with GPD TIP subsidy'
				}, {
					value: '20',
					description: 'Rental by client, with other ongoing housing subsidy'
				}, {
					value: '29',
					description: 'Residential project or halfway house with no homeless criteria'
				}, {
					value: '18',
					description: 'Safe Haven'
				}, {
					value: '22',
					description: 'Staying or living with family, permanent tenure'
				}, {
					value: '12',
					description: 'Staying or living with family, temporary tenure'
				}, {
					value: '23',
					description: 'Staying or living with friends, permanent tenure'
				}, {
					value: '13',
					description: 'Staying or living with friends, temporary tenure'
				}, {
					value: '5',
					description: 'Substance abuse treatment facility or detox center'
				}, {
					value: '2',
					description: 'Transitional housing for homeless persons (including homeless youth)'
				}, {
					value: '17',
					description: 'Other'
				}
			];
		},
		getExtraDestination:function () {
			return destination_category;
		},
		getDefaultRelationshipToHoh:function () {
			return [
				{
					value: '1',
					description: 'Self'
				}, {
					value: '2',
					description: 'Head of household’s child'
				}, {
					value: '3',
					description: 'Head of household’s spouse or partner'
				}, {
					value: '4',
					description: 'Head of household’s other relation member (other relation to head of household)'
				}, {
					value: '5',
					description: 'Other: non-relation member'
				}
			];
		},
		getExtraRelationshipToHoh:function () {
			return relationship_categories;
		},
		getDefaultTimesHomeless:function () {
			return [
				{
					value: '0',
					description: 'No'
				}, {
					value: '1',
					description: 'Yes'
				}
			];
		},
		getExtraTimesHomeless:function () {
			return times_Homeless;
		}
	}
);
