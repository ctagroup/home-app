import Alert from '/imports/ui/alert';
import { trimText } from '/imports/api/utils';
import Questions from '/imports/api/questions/questions';
import { populateOptions, resetQuestionModal, setFields } from '/imports/ui/questions/helpers';
import { TableDom, editButton, deleteQuestionButton } from '/imports/ui/dataTable/helpers';
import './questionsListView.html';


const tableOptions = {
  columns: [
    {
      title: 'Text',
      data: 'displayText',
      render(value) {
        return trimText(value, 200);
      },
    },
    {
      title: 'Category',
      data: 'category',
    },
    {
      title: 'Type',
      data: 'questionType',
    },
    {
      title: 'Question Group',
      data: 'questionGroup.questionGroupName',
    },
    editButton('questionsEdit'),
    deleteQuestionButton((question) => {
      console.log(question);
      Questions._collection.remove(question._id); // eslint-disable-line
    }),
  ],
  dom: TableDom,
};


Template.questionsListView.helpers({
  tableData() {
    return [];
  },
  tableOptions() {
    return tableOptions;
  },
  loadData() {
    const searchFn = (pageNumber, pageSize, sortBy, filterBy, callback) => {
      const query = Router.current().params.query || {};
      const options = {
        clientId: query.clientId,
        clientSchema: query.schema,
        pageNumber,
        pageSize,
        sortBy,
        filterBy,
      };

      return Meteor.call('questions.getPage', options, (err, res) => {
        if (err) {
          Alert.error(err);
          if (callback) callback({ data: [], pages: 0 });
        }
        if (res) {
          const data = res.content;
          const pages = res.page.totalPages;
          console.log(data);
          if (callback) callback({ data, pages });
        }
      });
    };
    return () => _.debounce(searchFn, 1000);
  },
});

Template.questionsListView.events(
  {
    'click .addQuestion': (/* evt, tmpl*/) => {
      $('#aoptions').empty();
      resetQuestionModal();
      $('.showWhenEdit').hide();
      $('.showWhenNew').show();
      $('#isUploaded').val('');
      setFields(false);
    },
    'click .edit': (evt) => {
      evt.preventDefault();
      $('#aoptions').empty();
      // let txt1;
      // let optionsTag;
      const question = Questions.findOne({ _id: $(evt.currentTarget).data('survey-id') });

      $('#q_category').val(question.category).change();
      $('#q_name').val(question.name);
      $('#question').summernote('code', question.question);
      $('#q_dataType').val(question.dataType).change();
      $('#q_type').val(question.qtype).change();
      $('#q_audience').val(question.audience).change();
      if (question.options != null) {
        // optionsTag = '';
        populateOptions(question);
      }

      $('#newQuestionModal input[type=checkbox]#isCopy').attr('checked', question.isCopy);
      $('#newQuestionModal input[type=checkbox]#isCopy').prop('checked', question.isCopy);

      $('#newQuestionModal input[type=checkbox]#locked').attr('checked', question.locked);
      $('#newQuestionModal input[type=checkbox]#locked').prop('checked', question.locked);

      $('#newQuestionModal input[type=checkbox]#allowSkip').attr('checked', question.allowSkip);
      $('#newQuestionModal input[type=checkbox]#allowSkip').prop('checked', question.allowSkip);

      $('#isUpdate').val('1');
      $('#isUploaded').val(question.surveyServiceQuesId).change();
      $('#questionID').val($(evt.currentTarget).data('survey-id'));

      $('.showWhenEdit').show();
      $('.showWhenNew').hide();
      if (question.locked) {
        setFields(true);
      } else {
        setFields(false);
      }
    },
  }
);

