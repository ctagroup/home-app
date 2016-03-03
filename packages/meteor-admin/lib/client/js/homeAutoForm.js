/**
 * Created by udit on 02/03/16.
 */
AutoForm.hooks(
	{
		adminSettingsForm: {
			onSuccess: function(formType, result) {
				AdminDashboard.alertSuccess('Settings saved successfully.');
			},
		}
	}
);
