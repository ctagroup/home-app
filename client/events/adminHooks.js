/**
 * Created by udit on 22/06/16.
 */

AutoForm.hooks(
  {
    adminSettingsForm: {
      onSuccess() {
        AdminDashboard.alertSuccess('Settings saved successfully.');
      },
    },
  }
);
