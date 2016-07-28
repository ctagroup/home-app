/**
 * Created by udit on 12/12/15.
 */
const currentDate = new Date();
Template.footer.helpers(
  {
    currentYear: currentDate.getFullYear(),
  }
);
