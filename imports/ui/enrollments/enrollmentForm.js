// import Alert from '/imports/ui/alert';
import Enrollments from '/imports/api/enrollments/enrollments';
import './enrollmentForm.html';

Template.enrollmentForm.helpers({
  doc() {
    if (!this.enrollment) return {};
    return this.enrollment;
    // try {
    //   const obj = JSON.parse(this.enrollment.definition);
    //   const definition = JSON.stringify(obj, null, 2);
    //   return Object.assign(this.enrollment, { definition });
    // } catch (e) {
    //   return this.enrollment;
    // }
  },

  schema() {
    if (this.step) {
      return {
        start: Enrollments.startSchema,
        update: Enrollments.updateSchema,
        quit: Enrollments.quitSchema,
      }[this.step];
    }
    return Enrollments.schema;
  },
});


AutoForm.hooks({
  enrollmentForm: {
    onSubmit: function onSubmit(insertDoc, updateDoc, currentDoc) {
      console.log('onSubmit', insertDoc, updateDoc, currentDoc);
      // if (currentDoc._id) {
      //   Meteor.call('enrollments.update', currentDoc._id, insertDoc, (err) => {
      //     if (err) {
      //       Alert.error(err);
      //     } else {
      //       Alert.success('Enrollment updated');
      //       Router.go('adminDashboardenrollmentsView');
      //     }
      //     this.done();
      //   });
      // } else {
      //   Meteor.call('enrollments.create', insertDoc, (err) => {
      //     if (err) {
      //       Alert.error(err);
      //     } else {
      //       Alert.success('Enrollment created');
      //       Router.go('adminDashboardenrollmentsView');
      //     }
      //     this.done();
      //   });
      // }
      return false;
    },
  },
});
