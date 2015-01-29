package org.ctagroup.homeapp;

/**
 * @author David Horton
 */
public enum SurveyType {

    SURVEY_LISTING("SURVEY_LISTING"),
    BASIC_SURVEY("BASIC_SURVEY"),
    PIT_SURVEY("PIT_SURVEY"),
    ENCAMPMENT_SURVEY("ENCAMPMENT_SURVEY"),
    ENCAMPMENT_VISIT_SURVEY("ENCAMPMENT_VISIT_SURVEY"),
    DISCLAIMER_METADATA("DISCLAIMER_METADATA");

    private String name;

    private SurveyType(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return this.name;
    }

    public static SurveyType getTypeFromString(String value) {
        SurveyType surveyType = null;
        for(SurveyType type : SurveyType.values()) {
            if(type.toString().equals(value)) {
                surveyType = type;
                break;
            }
        }
        return surveyType;
    }

}
