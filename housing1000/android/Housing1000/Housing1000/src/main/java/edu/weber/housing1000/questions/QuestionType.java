package edu.weber.housing1000.questions;

/**
 * The valid question types that can come back from the APIs.
 * @author David Horton
 */
public enum QuestionType {

    MULTI_SELECT("MultiSelect"),
    SINGLE_LINE_TEXT("SinglelineTextBox"),
    SINGLE_SELECT("SingleSelect"),
    SINGLE_SELECT_RADIO("SingleSelectRadio"),
    SINGLE_LINE_FOR_EACH_OPTION("SinglelineTextBoxForEachOption"),
    MULTILINE_TEXT("MultilineTextBox");

    private String name;

    private QuestionType(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return this.name;
    }

    public static QuestionType getTypeFromString(String value) {
        QuestionType surveyType = null;
        for(QuestionType type : QuestionType.values()) {
            if(type.toString().equals(value)) {
                surveyType = type;
                break;
            }
        }
        return surveyType;
    }
}
