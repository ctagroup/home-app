/**
 * Created by Kavi on 4/9/16.
 */
Template.clientProfile.helpers(
    {
        clientInfoList: function() {
            var clientInfoCollection = adminCollectionObject("clientInfo");
            return clientInfoCollection.findOne({_id:Router.current().params._id}).fetch();
        },
        viewClientPath: function(id) {
            var viewpath = Router.path( "adminDashboard" + Session.get('admin_collection_name') + "View", {_id: id} );
            return viewpath;
        }
    }
    
);


