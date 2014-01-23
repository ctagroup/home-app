package edu.weber.housing1000.REST;

import android.content.Context;
import android.util.Xml;
import org.xmlpull.v1.XmlSerializer;

import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import edu.weber.housing1000.DB.SurveyDbAdapter;
import edu.weber.housing1000.Data.Survey;
import edu.weber.housing1000.Data.SurveyResponse;

/**
 * Created with IntelliJ IDEA.
 * User: nathanm
 * Date: 3/17/13
 * Time: 1:25 PM
 * To change this template use File | Settings | File Templates.
 */
public class XmlSurvey {
    private List<SurveyResponse> responses;
    private final static String[] MILITARY_QUESTIONS = {
            "hud_militaryserviceeraKorean",
            "hud_militaryserviceeraVietnam",
            "hud_militaryserviceeraPostVietnam",
            "hud_militaryserviceeraPersianGulf",
            "hud_militaryserviceeraAfghanistan",
            "hud_militaryserviceeraIraq",
            "hud_militaryserviceeraDontKnow"
    };
    private final static String[] INCOME_QUESTIONS = {
            "sourceofincomeWork",
            "sourceofincomeAlimony",
            "sourceofincomeChildSupport",
            "sourceofincomeGeneral",
            "sourceofincomeDisability",
            "sourceofincomeVDP",
            "sourceofincomePDI",
            "sourceofincomePensionFormer",
            "sourceofincomePensionVeteran",
            "sourceofincomeRetirement",
            "sourceofincomeSSI",
            "sourceofincomeSSDI",
            "sourceofincomeTANF",
            "sourceofincomeUnemployment",
            "sourceofincomeWorkComp",
            "sourceofincomeNoResource",
            "sourceofincomeOther",
            "sourceofincomeOtherDetail"
    };
    private final static String[] SVP_QUESTIONS = {
            "svp_noncashbenefitssourceFoodStamps",
            "svp_noncashbenefitssourceMedicaid",
            "svp_noncashbenefitssourceMedicare",
            "svp_noncashbenefitssourceWIC",
            "svp_noncashbenefitssourceVA",
            "svp_noncashbenefitssourceOtherHealth",
            "svp_noncashbenefitssourceOtherDetail"
    };
    private final static String[] SPECIAL_QUESTIONS = {
            "first_name",
            "last_name",
            "soc_sec_no",
            "svp_monthlyincomeother",
            "svp_noncashbenefitsother"
    };
    private String firstName = "";
    private String lastName = "";
    private String socSecNum = "";
    private String incomeOther = "";
    private String svpOther = "";
    private Context context;
    String filename;

    public XmlSurvey(long surveyId, Context context) {
        this.context = context;
        SurveyDbAdapter db = new SurveyDbAdapter(context);
        db.open();
        responses = db.getResponses(surveyId);
        SurveyResponse firstNameResp = db.getResponseByIdAndQuestion(surveyId, "first_name");
        SurveyResponse lastNameResp = db.getResponseByIdAndQuestion(surveyId, "last_name");
        SurveyResponse socSecResp = db.getResponseByIdAndQuestion(surveyId, "soc_sec_no");
        SurveyResponse incomeOtherResp = db.getResponseByIdAndQuestion(surveyId, "svp_monthlyincomeother");
        SurveyResponse svpOtherResp = db.getResponseByIdAndQuestion(surveyId, "svp_noncashbenefitsother");
        Survey survey = db.getSurvey(surveyId);
        db.close();
        filename = "survey_"+survey.getHmsId()+".xml";
        if(firstNameResp != null){
            firstName = firstNameResp.getResponse();
        }
        if(lastNameResp != null){
            lastName = lastNameResp.getResponse();
        }
        if(socSecResp != null){
            socSecNum = socSecResp.getResponse();
        }
        if(incomeOtherResp != null){
            incomeOther = incomeOtherResp.getResponse();
        }
        if(svpOtherResp !=null){
            svpOther = svpOtherResp.getResponse();
        }
    }

    public void createXMLSurvey() {
        XmlSerializer serializer = Xml.newSerializer();
        String timeStamp = getTimeStamp();
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy 12:00:00'AM'");
        String timeValue = sdf.format(new Date());
        try {
            FileOutputStream mFileOutStream = context.openFileOutput(filename, Context.MODE_PRIVATE);
            serializer.setOutput(mFileOutStream, "UTF-8");
            serializer.startDocument(null, true);
            serializer.startTag(null, "records");
            serializer.attribute(null, "schema_revision", "300_108");
            serializer.attribute("xmlns", "xsi", "http://www.w3.org/2001/XMLSchema-instance");
            serializer.attribute("xsi", "noNamespaceSchemaLocation", "sp.xsd");
            serializer.startTag(null, "clients");
            serializer.startTag(null, "client");
            serializer.startTag(null, "first_name");
            serializer.text(firstName);
            serializer.endTag(null, "first_name");
            serializer.startTag(null, "last_name");
            serializer.text(lastName);
            serializer.endTag(null, "last_name");
            serializer.startTag(null, "soc_sec_num");
            serializer.text(socSecNum);
            serializer.endTag(null, "soc_sec_num");

            serializer.startTag(null, "dynamic_content");
            List<String> militaryResp = new ArrayList<String>();
            List<String> incomeResp = new ArrayList<String>();
            List<String> svpResp = new ArrayList<String>();

            for (SurveyResponse response : responses) {
                String question = response.getQuestion();
                if (Arrays.asList(MILITARY_QUESTIONS).contains(question)) {
                    militaryResp.add(response.getResponse());
                } else if (Arrays.asList(INCOME_QUESTIONS).contains(question)){
                    incomeResp.add(response.getResponse());
                }else if (Arrays.asList(SVP_QUESTIONS).contains(question)){
                    svpResp.add(response.getResponse());
                }else if(!Arrays.asList(SPECIAL_QUESTIONS).contains(question)){
                    serializer.startTag(null, response.getQuestion());
                    serializer.attribute(null, "date_added", timeStamp);
                    serializer.attribute(null, "date_effective", timeStamp);
                    serializer.text(response.getResponse());
                    serializer.endTag(null, response.getQuestion());
                }
            }
            if(!militaryResp.isEmpty()){
                for(String resp : militaryResp){
                    serializer.startTag(null, "hud_militaryserverainfo");
                    serializer.startTag(null, "hud_militaryserviceera");
                    serializer.attribute(null, "date_added", timeStamp);
                    serializer.attribute(null, "date_effective", timeStamp);
                    serializer.text(resp);
                    serializer.endTag(null, "hud_militaryserviceera");
                    serializer.startTag(null, "hud_militaryserverais");
                    serializer.attribute(null, "date_added", timeStamp);
                    serializer.attribute(null, "date_effective", timeStamp);
                    serializer.text(timeValue);
                    serializer.endTag(null, "hud_militaryserverais");
                    serializer.endTag(null, "hud_militaryserverainfo");
                }
            }
            if(!incomeResp.isEmpty()){
                for(String resp: incomeResp){
                    serializer.startTag(null, "monthlyincome");
                    serializer.startTag(null, "sourceofincome");
                    serializer.attribute(null, "date_added", timeStamp);
                    serializer.attribute(null, "date_effective", timeStamp);
                    serializer.text(resp);
                    serializer.endTag(null, "sourceofincome");
                    serializer.startTag(null, "amountmonthlyincome");
                    serializer.attribute(null, "date_added", timeStamp);
                    serializer.attribute(null, "date_effective", timeStamp);
                    serializer.text("0");
                    serializer.endTag(null, "amountmonthlyincome");
                    serializer.startTag(null, "svp_monthlyincomeother");
                    serializer.attribute(null, "date_added", timeStamp);
                    serializer.attribute(null, "date_effective", timeStamp);
                    serializer.text(incomeOther);
                    serializer.endTag(null, "svp_monthlyincomeother");
                    serializer.endTag(null, "monthlyincome");

                }
            }
            if(!svpResp.isEmpty()){
                for(String resp: svpResp){
                    serializer.startTag(null, "svp_noncashbenefits");
                    serializer.startTag(null, "svp_noncashbenefitssource");
                    serializer.attribute(null, "date_added", timeStamp);
                    serializer.attribute(null, "date_effective", timeStamp);
                    serializer.text(resp);
                    serializer.endTag(null, "svp_noncashbenefitssource");
                    serializer.startTag(null, "svp_noncashbenefitsstart");
                    serializer.attribute(null, "date_added", timeStamp);
                    serializer.attribute(null, "date_effective", timeStamp);
                    serializer.text(timeValue);
                    serializer.endTag(null, "svp_noncashbenefitsstart");
                    serializer.startTag(null, "svp_noncashbenefitsother");
                    serializer.attribute(null, "date_added", timeStamp);
                    serializer.attribute(null, "date_effective", timeStamp);
                    serializer.text(svpOther);
                    serializer.endTag(null, "svp_noncashbenefitsother");
                    serializer.endTag(null, "svp_noncashbenefits");
                }
            }
            serializer.endTag(null, "dynamic_content");
            serializer.endTag(null, "client");
            serializer.endTag(null, "clients");
            serializer.endTag(null, "records");
            serializer.endDocument();
            serializer.flush();
            mFileOutStream.flush();
            mFileOutStream.close();
        } catch (IOException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
    }

    public String getTimeStamp() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSSSSS");
        return sdf.format(new Date());
    }

}
