/**
 * Created by Kavi on 4/9/16.
 */
var gender_categories,veteran_status,ethnicity_categories,race_categories,residence_prior,destination_category,relationship_categories,times_Homeless,disabling_cond;

var getUniversalElements=function(){
	var questionsCollection = adminCollectionObject("questions");
	var universalElements= questionsCollection.find({'category':'Universal Data Elements'}).fetch();

	for ( var i in universalElements ) {

		var q_name = universalElements[i].name;

		switch (q_name) {
			case "gender":
				gender_categories = universalElements[i].options;
				break;
			case "veteran_status":
				veteran_status = universalElements[i].options;
				break;
			case "ethnicity":
				ethnicity_categories = universalElements[i].options;
				break;
			case "race":
				race_categories=universalElements[i].options;
				break;
			case "residence_prior_to_entry":
				residence_prior = universalElements[i].options;
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
					value: 'American Indian or Alaska Native',
					description: 'American Indian or Alaska Native'
				}, {
					value: 'Asian',
					description: 'Asian'
				}, {
					value: 'Black or African American',
					description: 'Black or African American'
				}, {
					value: 'Native Hawaiian or Other Pacific Islander',
					description: 'American Indian or Alaska Native'
				}, {
					value: 'White',
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
					value: 'Non-Hispanic/Non-Latino',
					description: 'Non-Hispanic/Non-Latino'
				}, {
					value: 'Hispanic/Latino',
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
					value: 'Female',
					description: 'Female'
				}, {
					value: 'Male',
					description: 'Male'
				}, {
					value: 'Transgender male to female',
					description: 'Transgender male to female'
				}, {
					value: 'Transgender female to male',
					description: 'Transgender female to male'
				}, {
					value: 'Other',
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
					value: 'Yes',
					description: 'Yes'
				}, {
					value: 'No',
					description: 'No'
				}
			];
		},
		getExtraVeteranStatusOptions:function () {
			return veteran_status;
		},
		getDefaultDisablingCondition: function () {
			return [
				{
					value: 'Yes',
					description: 'Yes'
				}, {
					value: 'No',
					description: 'No'
				}
			];
		},
		getExtraDisablingCondition:function () {
			return disabling_cond;
		},
		getDefaultResidencePrior: function () {
			return [
				{
					value: 'Emergency shelter, including hotel or motel paid for with emergency shelter',
					description: 'Emergency shelter, including hotel or motel paid for with emergency shelter'
				}, {
					value: 'Foster care home or foster care group home',
					description: 'Foster care home or foster care group home'
				}, {
					value: 'Hospital or other residential non-psychiatric medical facility',
					description: 'Hospital or other residential non-psychiatric medical facility'
				}, {
					value: 'Hotel or motel paid for without emergency shelter voucher',
					description: 'Hotel or motel paid for without emergency shelter voucher'
				}, {
					value: 'Jail, prison or juvenile detention facility',
					description: 'Jail, prison or juvenile detention facility'
				}, {
					value: 'Long-term care facility or nursing home',
					description: 'Long-term care facility or nursing home'
				}, {
					value: 'Owned by client, no ongoing housing subsidy',
					description: 'Owned by client, no ongoing housing subsidy'
				}, {
					value: 'Owned by client, with ongoing housing subsidy',
					description: 'Owned by client, with ongoing housing subsidy'
				}, {
					value: 'Permanent housing for formerly homeless persons',
					description: 'Permanent housing for formerly homeless persons'
				}, {
					value: 'Place not meant for habitation',
					description: 'Place not meant for habitation'
				}, {
					value: 'Psychiatric hospital or other psychiatric facility',
					description: 'Psychiatric hospital or other psychiatric facility'
				}, {
					value: 'Rental by client, no ongoing housing subsidy',
					description: 'Rental by client, no ongoing housing subsidy'
				}, {
					value: 'Rental by client, with VASH subsidy',
					description: 'Rental by client, with VASH subsidy'
				}, {
					value: 'Rental by client, with GPD TIP subsidy',
					description: 'Rental by client, with GPD TIP subsidy'
				}, {
					value: 'Rental by client, with other ongoing housing subsidy',
					description: 'Rental by client, with other ongoing housing subsidy'
				}, {
					value: 'Residential project or halfway house with no homeless criteria',
					description: 'Residential project or halfway house with no homeless criteria'
				}, {
					value: 'Safe Haven',
					description: 'Safe Haven'
				}, {
					value: 'Staying or living in a family member’s room, apartment or house',
					description: 'Staying or living in a family member’s room, apartment or house'
				}, {
					value: 'Substance abuse treatment facility or detox center',
					description: 'Substance abuse treatment facility or detox center'
				}, {
					value: 'Transitional housing for homeless persons (including homeless youth)',
					description: 'Transitional housing for homeless persons (including homeless youth)'
				}, {
					value: 'Other',
					description: 'Other'
				}
			];
		},
		getExtraResidencePrior:function () {
			return residence_prior;
		},
		getEntryDate: function () {
			if ( this && this.entry_date ) {
				return moment(this.entry_date).format('MM/DD/YYYY');
			}

			return "";
		},
		getExitDate: function () {
			if ( this && this.exit_date ) {
				return moment(this.exit_date).format('MM/DD/YYYY');
			}

			return "";
		},
		getDefaultDestination:function () {
			return [
				{
					value: 'Emergency shelter, including hotel or motel paid for with emergency shelter',
					description: 'Emergency shelter, including hotel or motel paid for with emergency shelter'
				}, {
					value: 'Foster care home or foster care group home',
					description: 'Foster care home or foster care group home'
				}, {
					value: 'Hospital or other residential non-psychiatric medical facility',
					description: 'Hospital or other residential non-psychiatric medical facility'
				}, {
					value: 'Hotel or motel paid for without emergency shelter voucher',
					description: 'Hotel or motel paid for without emergency shelter voucher'
				}, {
					value: 'Jail, prison or juvenile detention facility',
					description: 'Jail, prison or juvenile detention facility'
				}, {
					value: 'Long-term care facility or nursing home',
					description: 'Long-term care facility or nursing home'
				}, {
					value: 'Moved from one HOPWA funded project to HOPWA PH',
					description: 'Moved from one HOPWA funded project to HOPWA PH'
				}, {
					value: 'Moved from one HOPWA funded project to HOPWA TH',
					description: 'Moved from one HOPWA funded project to HOPWA TH'
				}, {
					value: 'Owned by client, no ongoing housing subsidy',
					description: 'Owned by client, no ongoing housing subsidy'
				}, {
					value: 'Owned by client, with ongoing housing subsidy',
					description: 'Owned by client, with ongoing housing subsidy'
				}, {
					value: 'Permanent housing for formerly homeless persons',
					description: 'Permanent housing for formerly homeless persons'
				}, {
					value: 'Place not meant for habitation',
					description: 'Place not meant for habitation'
				}, {
					value: 'Psychiatric hospital or other psychiatric facility',
					description: 'Psychiatric hospital or other psychiatric facility'
				}, {
					value: 'Rental by client, no ongoing housing subsidy',
					description: 'Rental by client, no ongoing housing subsidy'
				}, {
					value: 'Rental by client, with VASH subsidy',
					description: 'Rental by client, with VASH subsidy'
				}, {
					value: 'Rental by client, with GPD TIP subsidy',
					description: 'Rental by client, with GPD TIP subsidy'
				}, {
					value: 'Rental by client, with other ongoing housing subsidy',
					description: 'Rental by client, with other ongoing housing subsidy'
				}, {
					value: 'Residential project or halfway house with no homeless criteria',
					description: 'Residential project or halfway house with no homeless criteria'
				}, {
					value: 'Safe Haven',
					description: 'Safe Haven'
				}, {
					value: 'Staying or living with family, permanent tenure',
					description: 'Staying or living with family, permanent tenure'
				}, {
					value: 'Staying or living with family, temporary tenure',
					description: 'Staying or living with family, temporary tenure'
				}, {
					value: 'Staying or living with friends, permanent tenure',
					description: 'Staying or living with friends, permanent tenure'
				}, {
					value: 'Staying or living with friends, temporary tenure',
					description: 'Staying or living with friends, temporary tenure'
				}, {
					value: 'Staying or living in a family member’s room, apartment or house',
					description: 'Staying or living in a family member’s room, apartment or house'
				}, {
					value: 'Substance abuse treatment facility or detox center',
					description: 'Substance abuse treatment facility or detox center'
				}, {
					value: 'Transitional housing for homeless persons (including homeless youth)',
					description: 'Transitional housing for homeless persons (including homeless youth)'
				}, {
					value: 'Other',
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
					value: 'Self',
					description: 'Self'
				}, {
					value: 'Head of household’s child',
					description: 'Head of household’s child'
				}, {
					value: 'Head of household’s spouse or partner',
					description: 'Head of household’s spouse or partner'
				}, {
					value: 'Head of household’s other relation member (other relation to head of household)',
					description: 'Head of household’s other relation member (other relation to head of household)'
				}, {
					value: 'Other: non-relation member',
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
					value: 'Yes',
					description: 'Yes'
				}, {
					value: 'No',
					description: 'No'
				}
			];
		},
		getExtraTimesHomeless:function () {
			return times_Homeless;
		}
	}
);
