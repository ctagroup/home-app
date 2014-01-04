package edu.weber.housing1000;

import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import edu.weber.housing1000.data.Question;
import edu.weber.housing1000.data.SurveyListing;

/**
 * Created by Blake on 11/12/13.
 */
public class JSONParser {

    public static final String surveys = "[{\"$id\":\"1\",\"SurveyId\":1,\"Title\":\"Santa Clara Survey\",\"Description\":\"This is Santa Clara Survey\",\"CreatedBy\":1,\"CreatedDate\":\"2013-11-05T12:04:23\",\"UpdatedBy\":null,\"UpdatedDate\":null,\"ExpireOn\":null,\"Active\":true},{\"$id\":\"2\",\"SurveyId\":2,\"Title\":\"Santa Cruz Survey\",\"Description\":\"This is Santa Cruz Survey\",\"CreatedBy\":1,\"CreatedDate\":\"2013-11-05T12:04:23\",\"UpdatedBy\":null,\"UpdatedDate\":null,\"ExpireOn\":null,\"Active\":true}]";
    //public static final String testSurvey = "{\"$id\":\"1\",\"SurveyId\":1,\"Title\":\"Santa Clara Survey\",\"SurveyQuestions\":[{\"$id\":\"2\",\"QuestionId\":1,\"text\":\"What is your birthday?\",\"QuestionType\":\"SinglelineTextBox\",\"Options\":null,\"OrderId\":1},{\"$id\":\"3\",\"QuestionId\":2,\"text\":\"How do you identify yourself?\",\"QuestionType\":\"SingleSelect\",\"Options\":\"Male|Female|Transgender|Other\",\"OrderId\":2},{\"$id\":\"4\",\"QuestionId\":3,\"text\":\"Which racial/ethinic group do you identify yourself with the most?\",\"QuestionType\":\"SingleSelect\",\"Options\":\"White/Caucasian|Black/African American|Hispanic/Latino|American Indian/Alaskan Native|Vietnamese|Other Asian|Pacific Islander|Other/Multi-ethnic\",\"OrderId\":3}]}";
    //public static final String testSurvey = "{\"$id\":\"1\",\"SurveyId\":2,\"Title\":\"Santa Cruz Survey\",\"SurveyQuestions\":[{\"$id\":\"2\",\"QuestionId\":1,\"text\":\"What is your birthday?\",\"QuestionType\":\"SinglelineTextBox\",\"Options\":null,\"OrderId\":1,\"Panel\":\"ClientInformation\"},{\"$id\":\"3\",\"QuestionId\":2,\"text\":\"How do you identify yourself?\",\"QuestionType\":\"SingleSelect\",\"Options\":\"Male|Female|Transgender|Other\",\"OrderId\":3,\"Panel\":\"ClientDemographics\"},{\"$id\":\"4\",\"QuestionId\":3,\"text\":\"Which racial/ethinic group do you identify yourself with the most?\",\"QuestionType\":\"SingleSelect\",\"Options\":\"White/Caucasian|Black/African American|Hispanic/Latino|American Indian/Alaskan Native|Vietnamese|Other Asian|Pacific Islander|Other/Multi-ethnic\",\"OrderId\":2,\"Panel\":\"ClientInformation\"},{\"$id\":\"5\",\"QuestionId\":4,\"text\":\"Have you ever served in the U.S. Armed Forces?\",\"QuestionType\":\"MultiSelect\",\"Options\":\"Yes|No|Don't know|Decline to state\",\"OrderId\":4,\"Panel\":\"MilitaryInformation\"}]}";
    public static final String testSurvey =
            "{\"$id\":\"1\",\"SurveyId\":2,\"Title\":\"Santa Cruz Survey\",\"SurveyQuestions\":" +
                    "[{\"$id\":\"2\",\"QuestionId\":1,\"text\":\"First Name:\",\"QuestionType\":\"SinglelineTextBox\",\"Options\":null,\"OrderId\":1,\"Panel\":\"Client Information\"}," +
                    "{\"$id\":\"3\",\"QuestionId\":2,\"text\":\"Last Name:\",\"QuestionType\":\"SinglelineTextBox\",\"Options\":null,\"OrderId\":2,\"Panel\":\"Client Information\"}," +
                    "{\"$id\":\"4\",\"QuestionId\":3,\"text\":\"Social Security Number:\",\"QuestionType\":\"SinglelineTextBox\",\"Options\":null,\"OrderId\":3,\"Panel\":\"Client Information\"}," +
                    "{\"$id\":\"5\",\"QuestionId\":4,\"text\":\"Nickname/Alias:\",\"QuestionType\":\"SinglelineTextBox\",\"Options\":null,\"OrderId\":4,\"Panel\":\"Client Information\"}," +
                    "{\"$id\":\"6\",\"QuestionId\":5,\"text\":\"Date of Birth (MM/DD/YYYY):\",\"QuestionType\":\"SinglelineTextBox\",\"Options\":null,\"OrderId\":5,\"Panel\":\"Client Information\"}," +
                    "{\"$id\":\"7\",\"QuestionId\":6,\"text\":\"Date of Birth Type\",\"QuestionType\":\"SingleSelect\",\"Options\":\"Full DOB Reported|Approximate or Partial|Don't Know|Refused\",\"OrderId\":6,\"Panel\":\"Client Information\"}," +
                    "{\"$id\":\"8\",\"QuestionId\":7,\"text\":\"Phone Number\",\"QuestionType\":\"SinglelineTextBox\",\"Options\":null,\"OrderId\":7,\"Panel\":\"Client Information\"}," +
                    "{\"$id\":\"9\",\"QuestionId\":8,\"text\":\"Number of adults in household:\",\"QuestionType\":\"SinglelineTextBox\",\"Options\":null,\"OrderId\":8,\"Panel\":\"Client Information\"}," +
                    "{\"$id\":\"10\",\"QuestionId\":9,\"text\":\"Primary Language:\",\"QuestionType\":\"SingleSelect\",\"Options\":\"English|Spanish|Arabic|Chinese|Japanese|Russian|Tagalog|Vietnamese|Other\",\"OrderId\":9,\"Panel\":\"Client Information\"}," +
                    "{\"$id\":\"11\",\"QuestionId\":10,\"text\":\"Gender:\",\"QuestionType\":\"SingleSelect\",\"Options\":\"Male|Female|Transgendered Male to Female|Transgendered Female to Male|Other|Refused|Don't Know\",\"OrderId\":10,\"Panel\":\"Client Demographics\"}," +
                    "{\"$id\":\"12\",\"QuestionId\":11,\"text\":\"Race: What best describes you?\",\"QuestionType\":\"SingleSelect\",\"Options\":\"African American/Black|American Indian or Alaska Native|Asian|White|Native Hawaiian or other Pacific Islander|Don't Know|Refused\",\"OrderId\":11,\"Panel\":\"Client Demographics\"}," +
                    "{\"$id\":\"13\",\"QuestionId\":12,\"text\":\"Ethnicity: Hispanic or Latino origin?\",\"QuestionType\":\"SingleSelect\",\"Options\":\"Hispanic/Latino|Non-Hispanic/Non-Latino|Don't Know|Refused\",\"OrderId\":12,\"Panel\":\"Client Demographics\"}," +
                    "{\"$id\":\"14\",\"QuestionId\":13,\"text\":\"Highest level of education:\",\"QuestionType\":\"SingleSelect\",\"Options\":\"No schooling completed|K-8|Some high school|High School Diploma|GED|Some College|College Degree|Declined to state|Other\",\"OrderId\":13,\"Panel\":\"Client Demographics\"}," +
                    "{\"$id\":\"15\",\"QuestionId\":14,\"text\":\"U.S. Military Veteran?\",\"QuestionType\":\"SingleSelectRadio\",\"Options\":\"Yes|No|Refused\",\"OrderId\":14,\"Panel\":\"Military Information\"}," +
                    "{\"$id\":\"16\",\"QuestionId\":15,\"text\":\"Which war/war era did you serve in?\",\"QuestionType\":\"MultiSelect\",\"Options\":\"Korean War (June 1950 - January 1955)|Vietnam Era (August 1964 - April 1975)|Post Vietnam (May 1975 - July 1991)|Persian Gulf (August 1991 - September 10, 2001)|Afghanistan (2001 - Present)|Iraq (2003 - Present)|Don't Know|Refused\",\"OrderId\":15,\"Panel\":\"Military Information\"}," +
                    "{\"$id\":\"17\",\"QuestionId\":16,\"text\":\"What was the character of your discharge?\",\"QuestionType\":\"SingleSelect\",\"Options\":\"Honorable|General|Medical|Bad Conduct|Dishonorable|Other|Don't Know|Refused\",\"OrderId\":16,\"Panel\":\"Military Information\"}," +
                    "{\"$id\":\"18\",\"QuestionId\":17,\"text\":\"Have you ever been incarcerated?\",\"QuestionType\":\"SingleSelectRadio\",\"Options\":\"Yes|No\",\"OrderId\":17,\"Panel\":\"Legal/Other Information\"}," +
                    "{\"$id\":\"19\",\"QuestionId\":18,\"text\":\"What type of facility?\",\"QuestionType\":\"SingleSelect\",\"Options\":\"N/A|City|County|Federal|State\",\"OrderId\":18,\"Panel\":\"Legal/Other Information\"}," +
                    "{\"$id\":\"20\",\"QuestionId\":19,\"text\":\"Ever in foster care?\",\"QuestionType\":\"SingleSelectRadio\",\"Options\":\"Yes|No\",\"OrderId\":19,\"Panel\":\"Legal/Other Information\"}," +
                    "{\"$id\":\"21\",\"QuestionId\":20,\"text\":\"U.S. Citizen?\",\"QuestionType\":\"SingleSelectRadio\",\"Options\":\"Yes|No\",\"OrderId\":20,\"Panel\":\"Legal/Other Information\"}," +
                    "{\"$id\":\"22\",\"QuestionId\":21,\"text\":\"Immigration status:\",\"QuestionType\":\"SingleSelect\",\"Options\":\"Asylee|Naturalized|Pending|Permanent Resident|Undocumented\",\"OrderId\":21,\"Panel\":\"Legal/Other Information\"}," +
                    "{\"$id\":\"23\",\"QuestionId\":22,\"text\":\"Housing Status:\",\"QuestionType\":\"SingleSelect\",\"Options\":\"Literally Homeless (HUD)|Imminently losing their housing (HUD)|Unstably housed and at-risk of losing their house|Stably housed (HUD)|Don't know (HUD)|Refused (HUD)\",\"OrderId\":22,\"Panel\":\"Living Situation\"}," +
                    "{\"$id\":\"24\",\"QuestionId\":23,\"text\":\"Number of years you have lived on streets/shelter:\",\"QuestionType\":\"SingleSelect\",\"Options\":\"0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21+\",\"OrderId\":23,\"Panel\":\"Living Situation\"}," +
                    "{\"$id\":\"25\",\"QuestionId\":24,\"text\":\"Number of months you have lived on streets/shelter:\",\"QuestionType\":\"SingleSelect\",\"Options\":\"0|1|2|3|4|5|6|7|8|9|10|11\",\"OrderId\":24,\"Panel\":\"Living Situation\"}," +
                    "{\"$id\":\"26\",\"QuestionId\":25,\"text\":\"In 3 years, number of times homeless and housed again:\",\"QuestionType\":\"SingleSelect\",\"Options\":\"0|1-2|3-6|7+\",\"OrderId\":25,\"Panel\":\"Living Situation\"}," +
                    "{\"$id\":\"27\",\"QuestionId\":26,\"text\":\"Where do you sleep most frequently?\",\"QuestionType\":\"SingleSelect\",\"Options\":\"Shelters|Streets|Creek Encampment|Car/Van/RV|Subway/Bus|Beach/Riverbed|Other\",\"OrderId\":26,\"Panel\":\"Living Situation\"}," +
                    "{\"$id\":\"28\",\"QuestionId\":27,\"text\":\"If we can't find you there, where can we find you?\",\"QuestionType\":\"SinglelineTextBox\",\"Options\":null,\"OrderId\":28,\"Panel\":\"Living Situation\"}," +
                    "{\"$id\":\"29\",\"QuestionId\":28,\"text\":\"Last Permanent Address City:\",\"QuestionType\":\"SinglelineTextBox\",\"Options\":null,\"OrderId\":29,\"Panel\":\"Living Situation\"}," +
                    "{\"$id\":\"30\",\"QuestionId\":29,\"text\":\"Last Permanent Address State:\",\"QuestionType\":\"SingleSelect\",\"Options\":\"Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming\",\"OrderId\":30,\"Panel\":\"Living Situation\"}," +
                    "{\"$id\":\"31\",\"QuestionId\":30,\"text\":\"Last Permanent Address Zip:\",\"QuestionType\":\"SinglelineTextBox\",\"Options\":null,\"OrderId\":31,\"Panel\":\"Living Situation\"}," +
                    "{\"$id\":\"32\",\"QuestionId\":31,\"text\":\"Zip data quality:\",\"QuestionType\":\"SingleSelectRadio\",\"Options\":\"Full or Partial Zip Code Reported|Don't Know|Refused\",\"OrderId\":32,\"Panel\":\"Living Situation\"}," +
                    "{\"$id\":\"33\",\"QuestionId\":32,\"text\":\"How do you make money? (choose all that apply)\",\"QuestionType\":\"MultiSelect\",\"Options\":\"Work (Earned Income)|Alimony/Spousal Support|Child Support|General Assistance|Disability (SDI)|Veteran's Disability Payment|Private Disability Insurance|Pension From a Former Job|Veteran's Pension|Retirement Income From Social Security|SSI|SSDI/SSA|TANF|Unemployment Insurance|Worker's Compensation|No Financial Resources|Other\",\"OrderId\":33,\"Panel\":\"Money Matters\"}," +
                    "{\"$id\":\"34\",\"QuestionId\":33,\"text\":\"If Other (specify here):\",\"QuestionType\":\"SinglelineTextBox\",\"Options\":null,\"OrderId\":34,\"Panel\":\"Money Matters\"}," +
                    "{\"$id\":\"35\",\"QuestionId\":34,\"text\":\"Are you receiving any non-cash benefits? (choose as many as apply)\",\"QuestionType\":\"MultiSelect\",\"Options\":\"Food Stamps|Medicaid/Medi-Cal|Medicare|WIC (Special Supplemental Nutrition Program)|VA Medical Services|Other\",\"OrderId\":35,\"Panel\":\"Money Matters\"}," +
                    "{\"$id\":\"36\",\"QuestionId\":35,\"text\":\"If Other (specify here):\",\"QuestionType\":\"SinglelineTextBox\",\"Options\":null,\"OrderId\":36,\"Panel\":\"Money Matters\"}," +
                    "{\"$id\":\"37\",\"QuestionId\":36,\"text\":\"Where do you go for healthcare when not well?\",\"QuestionType\":\"SingleSelect\",\"Options\":\"Clinic|VA|O'Conner Hospital|Other|Valley Medical Center|Emergency Room|Mobile Van|Doctor Appointment|Other Hospital\",\"OrderId\":37,\"Panel\":\"Health Matters\"}," +
                    "{\"$id\":\"38\",\"QuestionId\":37,\"text\":\"How many times to the ER in last 3 months?\",\"QuestionType\":\"SingleSelect\",\"Options\":\"0|1-2|3-6|7+\",\"OrderId\":38,\"Panel\":\"Health Matters\"}," +
                    "{\"$id\":\"39\",\"QuestionId\":38,\"text\":\"How many times hospitalized/inpatient past year?\",\"QuestionType\":\"SingleSelect\",\"Options\":\"0|1|2|3|4|5+\",\"OrderId\":39,\"Panel\":\"Health Matters\"}," +
                    "{\"$id\":\"40\",\"QuestionId\":39,\"text\":\"Do you have now, or ever been told you have any of the following medical conditions?\",\"QuestionType\":\"MultiSelect\",\"Options\":\"Kidney Disease/End Stage Renal Disease/Dialysis|History of frostbite/Hypothermia/Immersion Foot|History of Heat Stroke/Heat Exhaustion|Liver disease/Cirrhosis/End-Stage Liver Disease|Heart disease, Arrhythmia, Irregular Heartbeat|HIV+/AIDS|Emphysema|Diabetes|Asthma|Cancer|Hepatitis C|Tuberculosis\",\"OrderId\":40,\"Panel\":\"Health Matters\"}," +
                    "{\"$id\":\"41\",\"QuestionId\":40,\"text\":\"If none of the above, why did you go to the ER?\",\"QuestionType\":\"SinglelineTextBox\",\"Options\":null,\"OrderId\":41,\"Panel\":\"Health Matters\"}," +
                    "{\"$id\":\"42\",\"QuestionId\":41,\"text\":\"Ever abused drug/alcohol, or been told you do?\",\"QuestionType\":\"SingleSelectRadio\",\"Options\":\"Yes|No|Refused\",\"OrderId\":42,\"Panel\":\"Health Matters\"}," +
                    "{\"$id\":\"43\",\"QuestionId\":42,\"text\":\"Consumed alcohol everyday for last 25+ days?\",\"QuestionType\":\"SingleSelectRadio\",\"Options\":\"Yes|No|Refused\",\"OrderId\":43,\"Panel\":\"Health Matters\"}," +
                    "{\"$id\":\"44\",\"QuestionId\":43,\"text\":\"Ever used injection drugs or alcohol abuse?\",\"QuestionType\":\"SingleSelectRadio\",\"Options\":\"Yes|No|Refused\",\"OrderId\":44,\"Panel\":\"Health Matters\"}," +
                    "{\"$id\":\"45\",\"QuestionId\":44,\"text\":\"Ever been treated for drug or alcohol abuse?\",\"QuestionType\":\"SingleSelectRadio\",\"Options\":\"Yes|No|Refused\",\"OrderId\":45,\"Panel\":\"Health Matters\"}," +
                    "{\"$id\":\"46\",\"QuestionId\":45,\"text\":\"Currently/ever received mental health treatment?\",\"QuestionType\":\"SingleSelectRadio\",\"Options\":\"Yes|No|Refused\",\"OrderId\":46,\"Panel\":\"Health Matters\"}," +
                    "{\"$id\":\"47\",\"QuestionId\":46,\"text\":\"Been taken to a hospital against will for MH?\",\"QuestionType\":\"SingleSelectRadio\",\"Options\":\"Yes|No|Refused\",\"OrderId\":47,\"Panel\":\"Health Matters\"}," +
                    "{\"$id\":\"48\",\"QuestionId\":47,\"text\":\"Been a victim of violent attack since homeless?\",\"QuestionType\":\"SingleSelectRadio\",\"Options\":\"Yes|No|Refused\",\"OrderId\":48,\"Panel\":\"Health Matters\"}," +
                    "{\"$id\":\"49\",\"QuestionId\":48,\"text\":\"Permanent physical disability limits mobility?\",\"QuestionType\":\"SingleSelectRadio\",\"Options\":\"Yes|No|Refused\",\"OrderId\":49,\"Panel\":\"Health Matters\"}," +
                    "{\"$id\":\"50\",\"QuestionId\":49,\"text\":\"Serious brain injury/head trauma, req'd hospital?\",\"QuestionType\":\"SingleSelectRadio\",\"Options\":\"Yes|No|Refused\",\"OrderId\":50,\"Panel\":\"Health Matters\"}," +
                    "{\"$id\":\"51\",\"QuestionId\":50,\"text\":\"Is there a person/outreach worker you trust?\",\"QuestionType\":\"SingleSelectRadio\",\"Options\":\"Yes|No|Refused\",\"OrderId\":51,\"Panel\":\"Community\"}," +
                    "{\"$id\":\"52\",\"QuestionId\":51,\"text\":\"What is their name and agency they work for?\",\"QuestionType\":\"SinglelineTextBox\",\"Options\":null,\"OrderId\":52,\"Panel\":\"Community\"}]}";

    public static ArrayList<SurveyListing> parseSurveyList(String surveys)
    {
        ArrayList<SurveyListing> surveyListings = new ArrayList<SurveyListing>();

        try {
            JSONArray surveysJSON = new JSONArray(surveys);

            for (int i = 0; i < surveysJSON.length(); i++)
            {
                JSONObject single = surveysJSON.getJSONObject(i);

                SurveyListing surveyListing = new SurveyListing(single.getInt("SurveyId"), 1, single.getString("Title"));
                surveyListings.add(surveyListing);
                Log.d("SURVEY FOUND", surveyListing.getTitle());
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return surveyListings;
    }

    public static JSONArray parseSurvey(String survey) {
        JSONArray questions = null;

        try {
            JSONObject surveyJSON = new JSONObject(survey);

            questions = surveyJSON.getJSONArray("SurveyQuestions");

            for (int i = 0; i < questions.length(); i++) {
                Log.d("JSON", questions.getJSONObject(i).get("text").toString());


            }

        } catch (JSONException e) {
            e.printStackTrace();
        }

        return questions;

    }

    public static ArrayList<Question> parseSurveyQuestions(String survey) {
        ArrayList<Question> questionsList = new ArrayList<Question>();

        try {
            JSONObject surveyJSON = new JSONObject(survey);

            JSONArray questions = surveyJSON.getJSONArray("SurveyQuestions");

            for (int i = 0; i < questions.length(); i++) {
                Question question = new Question();

                question.setQuestionId(questions.getJSONObject(i).getInt("QuestionId"));
                question.setText(questions.getJSONObject(i).getString("text"));
                question.setQuestionType(questions.getJSONObject(i).getString("QuestionType"));
                question.setOptions(questions.getJSONObject(i).getString("Options"));
                question.setOrderId(questions.getJSONObject(i).getInt("OrderId"));

                questionsList.add(question);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return questionsList;
    }

}
