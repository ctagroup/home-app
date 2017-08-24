import { TableDom } from '/imports/ui/dataTable/helpers';
import { populateOptions, resetQuestionModal, setFields } from '/imports/ui/questions/helpers';
import moment from 'moment';
import Questions from '/imports/api/questions/questions';
import './questionsListView.html';


const tableOptions = {
  columns: [
    {
      title: 'Question Name',
      data: 'name',
      render(value) {
        const div = document.createElement('div');
        div.innerHTML = value;
        let text = div.textContent || div.innerText || value;

        if (text.length > 40) {
          text = text.substr(0, 40);
          text += ' ... ';
        }
        return text;
      },
    },
    {
      title: 'Question Label',
      data: 'question',
      render(value) {
        const div = document.createElement('div');
        div.innerHTML = value;
        let text = div.textContent || div.innerText || value;

        if (text.length > 40) {
          text = text.substr(0, 40);
          text += ' ... ';
        }

        return text;
      },
    },
    {
      title: 'Category',
      data: 'category',
    },
    {
      title: 'Date created',
      data: 'createdAt',
      render(value) {
        return moment(value).format('MM/DD/YYYY');
      },
    },
    {
      title: 'Date updated',
      data: 'updatedAt',
      render(value) {
        return moment(value).format('MM/DD/YYYY');
      },
    },
    {
      title: 'Edit',
      data: '_id',
      orderable: false,
      render(value, type, doc) {
        /* eslint-disable */
        return `<a href="#newQuestionModal" role="button" data-toggle="modal" data-survey-id="${doc._id}" class="btn btn-primary edit"><i class="fa fa-edit"></i></a>`;
        /* eslint-enable */
      },
    },
  ],
  dom: TableDom,
};


Template.questionsListView.helpers({
  hasData() {
    return Questions.find().count() > 0;
  },
  tableData() {
    return () => Questions.find().fetch();
  },
  tableOptions() {
    return tableOptions;
  },

  questionList() {
    const questionCollection = HomeUtils.adminCollectionObject('questions');
    return questionCollection.find({}).fetch();
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
      const questionsCollection = HomeUtils.adminCollectionObject('questions');
      const question = questionsCollection.findOne({ _id: $(evt.currentTarget).data('survey-id') });

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

