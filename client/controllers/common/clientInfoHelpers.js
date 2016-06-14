/**
 * Created by Kavi on 4/9/16.
 */
var gender_categories,veteran_status,ethnicity_categories,race_categories,residence_prior,destination_category,relationship_categories,times_Homeless,disabling_cond;
Template.registerHelper('formatDate', function(date) {
	return moment(date).format('MM/DD/YYYY');
	//return new Date(timestamp).toString('MM/dd/yyyy')
});
Template.createClient.helpers(
    {
	    getSearchTerm: function () {
		    if ( Router.current().params.query && Router.current().params.query.firstName ) {
				return Router.current().params.query.firstName;
		    }
		    return "";
	    },
        clientInfoList: function() {
            var clientInfoCollection = adminCollectionObject("clientInfo");
            return clientInfoCollection.findOne({_id:Router.current().params._id}).fetch();
        },
        viewClientPath: function(id) {
            var viewpath = Router.path( "adminDashboard" + Session.get('admin_collection_name') + "View", {_id: id} );
            return viewpath;
        },
		getUniversalElements:function () {
			getUniversalElements();
		},
		getGender:function () {
			return gender_categories;
		},
		getVeteranStatus:function () {
			return veteran_status;
		},
		getRace:function () {
			return race_categories;
		},
		getEthnicity:function () {
			return ethnicity_categories;
		},
		getResidencePrior:function () {
			return residence_prior;
		},
		getDestination:function () {
			return destination_category;
		},
		getRelationshipToHoh:function () {
			return relationship_categories;
		},
		getTimesHomeless:function () {
			return times_Homeless;
		},
		getDisablingCondition:function () {
			return disabling_cond;
		}
	}

);
var getUniversalElements=function(){
	var questionsCollection = adminCollectionObject("questions");
	var universalElements= questionsCollection.find({'category':'Universal Data Elements'}).fetch();
	for(var i in universalElements){
		var q_name =universalElements[i].name;
		if(q_name=="gender")
		{
			var genderCategories=universalElements[i].options;
			console.log("gender"+genderCategories);
			gender_categories=genderCategories.split('|');
		}else if(q_name=="veteran_status")
		{
			var veteranStatus=universalElements[i].options;
			veteran_status=veteranStatus.split('|');
		}else if(q_name=="ethnicity")
		{
			var ethnicity=universalElements[i].options;
			console.log("ethnicity"+ethnicity);
			ethnicity_categories=ethnicity.split('|');
		}
		else if(q_name=="race")
		{
			var race=universalElements[i].options;
			race_categories=race.split('|');
		}
		else if(q_name=="residence_prior_to_entry")
		{
			var residenceprior=universalElements[i].options;
			residence_prior=residenceprior.split('|');
		}else if(q_name=="destination")
		{
			var destination=universalElements[i].options;
			destination_category=destination.split('|');
		}else if(q_name=="relationshiptohoh")
		{
			var relationship=universalElements[i].options;
			relationship_categories=relationship.split('|');
		}
		else if(q_name=="timesHomelesspastthreeyears")
		{
			var timesHomeless=universalElements[i].options;
			times_Homeless=timesHomeless.split('|');
		}
		else if(q_name=="disabling_cond")
		{
			var disablingcondition=universalElements[i].options;
			disabling_cond=disablingcondition.split('|');
		}
	}

};





