/**
 * Created by udit on 26/07/16.
 */

Template.AdminLayout.helpers(
  {
    minHeight() {
      const height = (
                       Template.instance().minHeight
                     ) ?
                     `${Template.instance().minHeight.get()}px` : '100%';
      return height;
    },
  }
);
