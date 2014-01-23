package edu.weber.housing1000;


import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.*;

import edu.weber.housing1000.DB.SurveyDbAdapter;
import edu.weber.housing1000.Data.SurveyResponse;

public class ClientInfoActivity extends Activity
{

    /* Called when the activity is first created. */
    long surveyId = -1;

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_clnt_info);

        surveyId = getIntent().getLongExtra(SurveyDbAdapter.SURVEYS_FIELD_ID, -1);


        Button btnClientInformation = (Button) findViewById(R.id.btnClientInformation);
        Button btnClientDemographics = (Button) findViewById(R.id.btnClientDemographics);
        Button btnMilitaryInformation = (Button) findViewById(R.id.btnMilitaryInformation);
        Button btnLegalOtherInformation = (Button) findViewById(R.id.btnLegalOtherInformation);
        Button btnLivingSituation = (Button) findViewById(R.id.btnLivingSituation);
        Button btnMoneyMatters = (Button) findViewById(R.id.btnMoneyMatters);
        Button btnHealthMatters = (Button) findViewById(R.id.btnHealthMatters);
        Button btnCommunity = (Button) findViewById(R.id.btnCommunity);
        Button btnSubmit = (Button) findViewById(R.id.Submit);
        Button btnCancel = (Button) findViewById(R.id.Cancel);

        View panelClientInformation = findViewById(R.id.panelClientInformation);
        panelClientInformation.setVisibility(View.GONE);

        View panelClientDemographics = findViewById(R.id.panelClientDemographics);
        panelClientDemographics.setVisibility(View.GONE);

        View panelMilitaryInformation = findViewById(R.id.panelMilitaryInformation);
        panelMilitaryInformation.setVisibility(View.GONE);

        View panelLegalOtherInformation = findViewById(R.id.panelLegalOtherInformation);
        panelLegalOtherInformation.setVisibility(View.GONE);

        View panelLivingSituation = findViewById(R.id.panelLivingSituation);
        panelLivingSituation.setVisibility(View.GONE);

        View panelMoneyMatters = findViewById(R.id.panelMoneyMatters);
        panelMoneyMatters.setVisibility(View.GONE);

        View panelHealthMatters = findViewById(R.id.panelHealthMatters);
        panelHealthMatters.setVisibility(View.GONE);

        View panelCommunity = findViewById(R.id.panelCommunity);
        panelCommunity.setVisibility(View.GONE);

        btnCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        btnClientInformation.setOnClickListener(new OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                // DO STUFF
                View panelClientInformation = findViewById(R.id.panelClientInformation);
                if (panelClientInformation.getVisibility() == View.VISIBLE)
                {
                    panelClientInformation.setVisibility(View.GONE);
                }
                else
                {
                    panelClientInformation.setVisibility(View.VISIBLE);
                    View clientInfoTop = findViewById(R.id.question_first_name);
                    clientInfoTop.setFocusableInTouchMode(true);
                    clientInfoTop.requestFocus();
                }

                View panelClientDemographics = findViewById(R.id.panelClientDemographics);
                panelClientDemographics.setVisibility(View.GONE);

                View panelMilitaryInformation = findViewById(R.id.panelMilitaryInformation);
                panelMilitaryInformation.setVisibility(View.GONE);

                View panelLegalOtherInformation = findViewById(R.id.panelLegalOtherInformation);
                panelLegalOtherInformation.setVisibility(View.GONE);

                View panelLivingSituation = findViewById(R.id.panelLivingSituation);
                panelLivingSituation.setVisibility(View.GONE);

                View panelMoneyMatters = findViewById(R.id.panelMoneyMatters);
                panelMoneyMatters.setVisibility(View.GONE);

                View panelHealthMatters = findViewById(R.id.panelHealthMatters);
                panelHealthMatters.setVisibility(View.GONE);

                View panelCommunity = findViewById(R.id.panelCommunity);
                panelCommunity.setVisibility(View.GONE);
            }
        });

        btnClientDemographics.setOnClickListener(new OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                // DO STUFF
                View panelClientInformation = findViewById(R.id.panelClientInformation);
                panelClientInformation.setVisibility(View.GONE);

                View panelClientDemographics = findViewById(R.id.panelClientDemographics);
                if (panelClientDemographics.getVisibility() == View.VISIBLE)
                {
                    panelClientDemographics.setVisibility(View.GONE);
                }
                else
                {
                    panelClientDemographics.setVisibility(View.VISIBLE);
                    View clientDemoTop = findViewById(R.id.question_svpprofgender);
                    clientDemoTop.setFocusableInTouchMode(true);
                    clientDemoTop.requestFocus();
                }

                View panelMilitaryInformation = findViewById(R.id.panelMilitaryInformation);
                panelMilitaryInformation.setVisibility(View.GONE);

                View panelLegalOtherInformation = findViewById(R.id.panelLegalOtherInformation);
                panelLegalOtherInformation.setVisibility(View.GONE);

                View panelLivingSituation = findViewById(R.id.panelLivingSituation);
                panelLivingSituation.setVisibility(View.GONE);

                View panelMoneyMatters = findViewById(R.id.panelMoneyMatters);
                panelMoneyMatters.setVisibility(View.GONE);

                View panelHealthMatters = findViewById(R.id.panelHealthMatters);
                panelHealthMatters.setVisibility(View.GONE);

                View panelCommunity = findViewById(R.id.panelCommunity);
                panelCommunity.setVisibility(View.GONE);
            }
        });

        btnMilitaryInformation.setOnClickListener(new OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                // DO STUFF
                View panelClientInformation = findViewById(R.id.panelClientInformation);
                panelClientInformation.setVisibility(View.GONE);

                View panelClientDemographics = findViewById(R.id.panelClientDemographics);
                panelClientDemographics.setVisibility(View.GONE);

                View panelMilitaryInformation = findViewById(R.id.panelMilitaryInformation);
                if (panelMilitaryInformation.getVisibility() == View.VISIBLE)
                {
                    panelMilitaryInformation.setVisibility(View.GONE);
                }
                else
                {
                    panelMilitaryInformation.setVisibility(View.VISIBLE);
                    View militaryTop = findViewById(R.id.question_veteran);
                    militaryTop.setFocusableInTouchMode(true);
                    militaryTop.requestFocus();
                }

                View panelLegalOtherInformation = findViewById(R.id.panelLegalOtherInformation);
                panelLegalOtherInformation.setVisibility(View.GONE);

                View panelLivingSituation = findViewById(R.id.panelLivingSituation);
                panelLivingSituation.setVisibility(View.GONE);

                View panelMoneyMatters = findViewById(R.id.panelMoneyMatters);
                panelMoneyMatters.setVisibility(View.GONE);

                View panelHealthMatters = findViewById(R.id.panelHealthMatters);
                panelHealthMatters.setVisibility(View.GONE);

                View panelCommunity = findViewById(R.id.panelCommunity);
                panelCommunity.setVisibility(View.GONE);
            }
        });

        btnLegalOtherInformation.setOnClickListener(new OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                // DO STUFF
                View panelClientInformation = findViewById(R.id.panelClientInformation);
                panelClientInformation.setVisibility(View.GONE);

                View panelClientDemographics = findViewById(R.id.panelClientDemographics);
                panelClientDemographics.setVisibility(View.GONE);

                View panelMilitaryInformation = findViewById(R.id.panelMilitaryInformation);
                panelMilitaryInformation.setVisibility(View.GONE);

                View panelLegalOtherInformation = findViewById(R.id.panelLegalOtherInformation);
                if (panelLegalOtherInformation.getVisibility() == View.VISIBLE)
                {
                    panelLegalOtherInformation.setVisibility(View.GONE);
                }
                else
                {
                    panelLegalOtherInformation.setVisibility(View.VISIBLE);
                    View legalTop = findViewById(R.id.question_incarceratedformerinc);
                    legalTop.setFocusableInTouchMode(true);
                    legalTop.requestFocus();
                }

                View panelLivingSituation = findViewById(R.id.panelLivingSituation);
                panelLivingSituation.setVisibility(View.GONE);

                View panelMoneyMatters = findViewById(R.id.panelMoneyMatters);
                panelMoneyMatters.setVisibility(View.GONE);

                View panelHealthMatters = findViewById(R.id.panelHealthMatters);
                panelHealthMatters.setVisibility(View.GONE);

                View panelCommunity = findViewById(R.id.panelCommunity);
                panelCommunity.setVisibility(View.GONE);
            }
        });

        btnLivingSituation.setOnClickListener(new OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                // DO STUFF
                View panelClientInformation = findViewById(R.id.panelClientInformation);
                panelClientInformation.setVisibility(View.GONE);

                View panelClientDemographics = findViewById(R.id.panelClientDemographics);
                panelClientDemographics.setVisibility(View.GONE);

                View panelMilitaryInformation = findViewById(R.id.panelMilitaryInformation);
                panelMilitaryInformation.setVisibility(View.GONE);

                View panelLegalOtherInformation = findViewById(R.id.panelLegalOtherInformation);
                panelLegalOtherInformation.setVisibility(View.GONE);

                View panelLivingSituation = findViewById(R.id.panelLivingSituation);
                if (panelLivingSituation.getVisibility() == View.VISIBLE)
                {
                    panelLivingSituation.setVisibility(View.GONE);
                }
                else
                {
                    panelLivingSituation.setVisibility(View.VISIBLE);
                    View livingTop = findViewById(R.id.question_svp_hud_housingstatus);
                    livingTop.setFocusableInTouchMode(true);
                    livingTop.requestFocus();
                }

                View panelMoneyMatters = findViewById(R.id.panelMoneyMatters);
                panelMoneyMatters.setVisibility(View.GONE);

                View panelHealthMatters = findViewById(R.id.panelHealthMatters);
                panelHealthMatters.setVisibility(View.GONE);

                View panelCommunity = findViewById(R.id.panelCommunity);
                panelCommunity.setVisibility(View.GONE);
            }
        });

        btnMoneyMatters.setOnClickListener(new OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                // DO STUFF
                View panelClientInformation = findViewById(R.id.panelClientInformation);
                panelClientInformation.setVisibility(View.GONE);

                View panelClientDemographics = findViewById(R.id.panelClientDemographics);
                panelClientDemographics.setVisibility(View.GONE);

                View panelMilitaryInformation = findViewById(R.id.panelMilitaryInformation);
                panelMilitaryInformation.setVisibility(View.GONE);

                View panelLegalOtherInformation = findViewById(R.id.panelLegalOtherInformation);
                panelLegalOtherInformation.setVisibility(View.GONE);

                View panelLivingSituation = findViewById(R.id.panelLivingSituation);
                panelLivingSituation.setVisibility(View.GONE);

                View panelMoneyMatters = findViewById(R.id.panelMoneyMatters);
                if (panelMoneyMatters.getVisibility() == View.VISIBLE)
                {
                    panelMoneyMatters.setVisibility(View.GONE);
                }
                else
                {
                    panelMoneyMatters.setVisibility(View.VISIBLE);
                    View moneyTop = findViewById(R.id.question_sourceofincome);
                    moneyTop.setFocusableInTouchMode(true);
                    moneyTop.requestFocus();
                }

                View panelHealthMatters = findViewById(R.id.panelHealthMatters);
                panelHealthMatters.setVisibility(View.GONE);

                View panelCommunity = findViewById(R.id.panelCommunity);
                panelCommunity.setVisibility(View.GONE);
            }
        });

        btnHealthMatters.setOnClickListener(new OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                // DO STUFF
                View panelClientInformation = findViewById(R.id.panelClientInformation);
                panelClientInformation.setVisibility(View.GONE);

                View panelClientDemographics = findViewById(R.id.panelClientDemographics);
                panelClientDemographics.setVisibility(View.GONE);

                View panelMilitaryInformation = findViewById(R.id.panelMilitaryInformation);
                panelMilitaryInformation.setVisibility(View.GONE);

                View panelLegalOtherInformation = findViewById(R.id.panelLegalOtherInformation);
                panelLegalOtherInformation.setVisibility(View.GONE);

                View panelLivingSituation = findViewById(R.id.panelLivingSituation);
                panelLivingSituation.setVisibility(View.GONE);

                View panelMoneyMatters = findViewById(R.id.panelMoneyMatters);
                panelMoneyMatters.setVisibility(View.GONE);

                View panelHealthMatters = findViewById(R.id.panelHealthMatters);
                if (panelHealthMatters.getVisibility() == View.VISIBLE)
                {
                    panelHealthMatters.setVisibility(View.GONE);
                }
                else
                {
                    panelHealthMatters.setVisibility(View.VISIBLE);
                    View healthTop = findViewById(R.id.question_17wheredoyougoforhea);
                    healthTop.setFocusableInTouchMode(true);
                    healthTop.requestFocus();
                }

                View panelCommunity = findViewById(R.id.panelCommunity);
                panelCommunity.setVisibility(View.GONE);
            }
        });

        btnCommunity.setOnClickListener(new OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                // DO STUFF
                View panelClientInformation = findViewById(R.id.panelClientInformation);
                panelClientInformation.setVisibility(View.GONE);

                View panelClientDemographics = findViewById(R.id.panelClientDemographics);
                panelClientDemographics.setVisibility(View.GONE);

                View panelMilitaryInformation = findViewById(R.id.panelMilitaryInformation);
                panelMilitaryInformation.setVisibility(View.GONE);

                View panelLegalOtherInformation = findViewById(R.id.panelLegalOtherInformation);
                panelLegalOtherInformation.setVisibility(View.GONE);

                View panelLivingSituation = findViewById(R.id.panelLivingSituation);
                panelLivingSituation.setVisibility(View.GONE);

                View panelMoneyMatters = findViewById(R.id.panelMoneyMatters);
                panelMoneyMatters.setVisibility(View.GONE);

                View panelHealthMatters = findViewById(R.id.panelHealthMatters);
                panelHealthMatters.setVisibility(View.GONE);

                View panelCommunity = findViewById(R.id.panelCommunity);
                if (panelCommunity.getVisibility() == View.VISIBLE)
                {
                    panelCommunity.setVisibility(View.GONE);
                }
                else
                {
                    panelCommunity.setVisibility(View.VISIBLE);
                    View communityTop = findViewById(R.id.question_33isthereapersonoutr);
                    communityTop.setFocusableInTouchMode(true);
                    communityTop.requestFocus();
                }
            }
        });

        btnSubmit.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                SurveyDbAdapter db = new SurveyDbAdapter(getApplicationContext());
                db.open();
                saveSurveyResponseAnswer("first_name", findViewById(R.id.first_name), db);
                saveSurveyResponseAnswer( "last_name", (findViewById(R.id.last_name)), db);
                saveSurveyResponseAnswer( "soc_sec_no", (findViewById(R.id.soc_sec_no)), db);
                saveSurveyResponseAnswer( "alias", findViewById(R.id.alias), db);
                saveSurveyResponseAnswer( "svpprofdob", findViewById(R.id.svpprofdob), db);
                saveSurveyResponseAnswer( "svpprofdobtype", findViewById(R.id.svpprofdobtype), db);
                saveSurveyResponseAnswer( "phonemessage", findViewById(R.id.phonemessage), db);
                saveSurveyResponseAnswer( "adultsinhousehold", findViewById(R.id.adultsinhousehold), db);
                saveSurveyResponseAnswer( "childreninhousehold", findViewById(R.id.childreninhousehold), db);
                saveSurveyResponseAnswer( "primarylanguage_1", findViewById(R.id.primarylanguage_1), db);
                saveSurveyResponseAnswer( "svpprofgender", findViewById(R.id.svpprofgender), db);
                saveSurveyResponseAnswer( "svpprofrace", findViewById(R.id.svpprofrace), db);
                saveSurveyResponseAnswer( "svpprofeth", findViewById(R.id.svpprofeth), db);
                saveSurveyResponseAnswer( "highestlevelofeducati", findViewById(R.id.highestlevelofeducati), db);
                saveSurveyResponseAnswer( "veteran", findViewById(R.id.veteran), db);
                saveSurveyResponseAnswer( "hud_militaryserviceeraKorean", findViewById(R.id.hud_militaryserviceeraKorean), db);
                saveSurveyResponseAnswer( "hud_militaryserviceeraVietnam", findViewById(R.id.hud_militaryserviceeraVietnam), db);
                saveSurveyResponseAnswer( "hud_militaryserviceeraPostVietnam", findViewById(R.id.hud_militaryserviceeraPostVietnam), db);
                saveSurveyResponseAnswer( "hud_militaryserviceeraPersianGulf", findViewById(R.id.hud_militaryserviceeraPersianGulf), db);
                saveSurveyResponseAnswer( "hud_militaryserviceeraAfghanistan", findViewById(R.id.hud_militaryserviceeraAfghanistan), db);
                saveSurveyResponseAnswer( "hud_militaryserviceeraIraq", findViewById(R.id.hud_militaryserviceeraIraq), db);
                saveSurveyResponseAnswer( "hud_militaryserviceeraDontKnow", findViewById(R.id.hud_militaryserviceeraDontKnow), db);
                //saveSurveyResponseAnswer( "hud_militaryserviceeraRefused", findViewById(R.id.hud_militaryserviceeraRefused), db);
                saveSurveyResponseAnswer( "hud_dischargetype", findViewById(R.id.hud_dischargetype), db);
                saveSurveyResponseAnswer( "incarceratedformerinc", findViewById(R.id.incarceratedformerinc), db);
                saveSurveyResponseAnswer( "incarceratedinstituti", findViewById(R.id.incarceratedinstituti), db);
                saveSurveyResponseAnswer( "everinfostercare", findViewById(R.id.everinfostercare), db);
                saveSurveyResponseAnswer( "uscitizen", findViewById(R.id.uscitizen), db);
                saveSurveyResponseAnswer( "immigrationstatus", findViewById(R.id.immigrationstatus), db);
                saveSurveyResponseAnswer( "ansrTwentytwo", findViewById(R.id.ansrTwentytwo), db);
                saveSurveyResponseAnswer( "ansrTwentythreeYears", findViewById(R.id.ansrTwentythreeYears), db);
                saveSurveyResponseAnswer( "ansrTwentythreeMonths", findViewById(R.id.ansrTwentythreeMonths), db);
                saveSurveyResponseAnswer( "in3yrsoftimeshomeless", findViewById(R.id.in3yrsoftimeshomeless), db);
                saveSurveyResponseAnswer( "_15wheredoyousleepmos", findViewById(R.id._15wheredoyousleepmos), db);
                saveSurveyResponseAnswer( "ifwecantfindyoutherew", findViewById(R.id.ifwecantfindyoutherew), db);
                saveSurveyResponseAnswer( "lpcity", findViewById(R.id.lpcity), db);
                saveSurveyResponseAnswer( "lpstate", findViewById(R.id.lpstate), db);
                saveSurveyResponseAnswer( "hud_zipcodelastpermaddr", findViewById(R.id.hud_zipcodelastpermaddr), db);
                saveSurveyResponseAnswer( "hud_zipdataquality", findViewById(R.id.hud_zipdataquality), db);
                saveSurveyResponseAnswer( "sourceofincomeWork", findViewById(R.id.sourceofincomeWork), db);
                saveSurveyResponseAnswer( "sourceofincomeAlimony", findViewById(R.id.sourceofincomeAlimony), db);
                saveSurveyResponseAnswer( "sourceofincomeChildSupport", findViewById(R.id.sourceofincomeChildSupport), db);
                saveSurveyResponseAnswer( "sourceofincomeGeneral", findViewById(R.id.sourceofincomeGeneral), db);
                saveSurveyResponseAnswer( "sourceofincomeDisability", findViewById(R.id.sourceofincomeDisability), db);
                saveSurveyResponseAnswer( "sourceofincomeVDP", findViewById(R.id.sourceofincomeVDP), db);
                saveSurveyResponseAnswer( "sourceofincomePDI", findViewById(R.id.sourceofincomePDI), db);
                saveSurveyResponseAnswer( "sourceofincomePensionFormer", findViewById(R.id.sourceofincomePensionFormer), db);
                saveSurveyResponseAnswer( "sourceofincomePensionVeteran", findViewById(R.id.sourceofincomePensionVeteran), db);
                saveSurveyResponseAnswer( "sourceofincomeRetirement", findViewById(R.id.sourceofincomeRetirement), db);
                saveSurveyResponseAnswer( "sourceofincomeSSI", findViewById(R.id.sourceofincomeSSI), db);
                saveSurveyResponseAnswer( "sourceofincomeSSDI", findViewById(R.id.sourceofincomeSSDI), db);
                saveSurveyResponseAnswer( "sourceofincomeTANF", findViewById(R.id.sourceofincomeTANF), db);
                saveSurveyResponseAnswer( "sourceofincomeUnemployment", findViewById(R.id.sourceofincomeUnemployment), db);
                saveSurveyResponseAnswer( "sourceofincomeWorkComp", findViewById(R.id.sourceofincomeWorkComp), db);
                saveSurveyResponseAnswer( "sourceofincomeNoResource", findViewById(R.id.sourceofincomeNoResource), db);
                saveSurveyResponseAnswer( "sourceofincomeOther", findViewById(R.id.sourceofincomeOther), db);
                saveSurveyResponseAnswer( "sourceofincomeOtherDetail", findViewById(R.id.sourceofincomeOtherDetail), db);
                saveSurveyResponseAnswer( "svp_noncashbenefitssourceFoodStamps", findViewById(R.id.svp_noncashbenefitssourceFoodStamps), db);
                saveSurveyResponseAnswer( "svp_noncashbenefitssourceMedicaid", findViewById(R.id.svp_noncashbenefitssourceMedicaid), db);
                saveSurveyResponseAnswer( "svp_noncashbenefitssourceMedicare", findViewById(R.id.svp_noncashbenefitssourceMedicare), db);
                saveSurveyResponseAnswer( "svp_noncashbenefitssourceWIC", findViewById(R.id.svp_noncashbenefitssourceWIC), db);
                saveSurveyResponseAnswer( "svp_noncashbenefitssourceVA", findViewById(R.id.svp_noncashbenefitssourceVA), db);
                saveSurveyResponseAnswer( "svp_noncashbenefitssourceOtherHealth", findViewById(R.id.svp_noncashbenefitssourceOtherHealth), db);
                saveSurveyResponseAnswer( "svp_noncashbenefitssourceOtherDetail", findViewById(R.id.svp_noncashbenefitssourceOtherDetail), db);
                saveSurveyResponseAnswer( "_17wheredoyougoforhea", findViewById(R.id._17wheredoyougoforhea), db);
                saveSurveyResponseAnswer( "_17wheredoyougoforhea", findViewById(R.id._17wheredoyougoforhea), db);
                saveSurveyResponseAnswer( "_19howmanyxshospitali_1", findViewById(R.id._19howmanyxshospitali_1), db);
                saveSurveyResponseAnswer( "kidneydiseaseendstage", findViewById(R.id.kidneydiseaseendstage), db);
                saveSurveyResponseAnswer( "bhistoryoffrostbitehy", findViewById(R.id.bhistoryoffrostbitehy), db);
                saveSurveyResponseAnswer( "chistoryofheaatstroke", findViewById(R.id.chistoryofheaatstroke), db);
                saveSurveyResponseAnswer( "dliverdiseasecirrhosi", findViewById(R.id.dliverdiseasecirrhosi), db);
                saveSurveyResponseAnswer( "eheartdiseasearrhythm", findViewById(R.id.eheartdiseasearrhythm), db);
                saveSurveyResponseAnswer( "fhivaids", findViewById(R.id.fhivaids), db);
                saveSurveyResponseAnswer( "gemphysema", findViewById(R.id.gemphysema), db);
                saveSurveyResponseAnswer( "hdiabetes", findViewById(R.id.hdiabetes), db);
                saveSurveyResponseAnswer( "iasthma", findViewById(R.id.iasthma), db);
                saveSurveyResponseAnswer( "jcancer", findViewById(R.id.jcancer), db);
                saveSurveyResponseAnswer( "khepatitisc", findViewById(R.id.khepatitisc), db);
                saveSurveyResponseAnswer( "ltuberculosis", findViewById(R.id.ltuberculosis), db);
                saveSurveyResponseAnswer( "neverabuseddrugalcoho", findViewById(R.id.neverabuseddrugalcoho), db);
                saveSurveyResponseAnswer( "oconsumedalcoholevery", findViewById(R.id.oconsumedalcoholevery), db);
                saveSurveyResponseAnswer( "peverusedinjectiondru", findViewById(R.id.peverusedinjectiondru), db);
                saveSurveyResponseAnswer( "everbeentreatedfordru", findViewById(R.id.everbeentreatedfordru), db);
                saveSurveyResponseAnswer( "scurrentlyeverreceive", findViewById(R.id.scurrentlyeverreceive), db);
                saveSurveyResponseAnswer( "tbeentakentohospitala", findViewById(R.id.tbeentakentohospitala), db);
                saveSurveyResponseAnswer( "vbeenavictimofviolent", findViewById(R.id.vbeenavictimofviolent), db);
                saveSurveyResponseAnswer( "wpermanentphysicaldis", findViewById(R.id.wpermanentphysicaldis), db);
                saveSurveyResponseAnswer( "wpermanentphysicaldis", findViewById(R.id.wpermanentphysicaldis), db);
                saveSurveyResponseAnswer( "xseriousbraininjuryhe", findViewById(R.id.xseriousbraininjuryhe), db);
                saveSurveyResponseAnswer( "_33isthereapersonoutr", findViewById(R.id._33isthereapersonoutr), db);
                saveSurveyResponseAnswer( "ansrFiftynine", findViewById(R.id.ansrFiftynine), db);
                db.close();
                Intent intent = new Intent(ClientInfoActivity.this, MainMenuActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
                startActivity(intent);
            }
        });
    }

    private void saveSurveyResponseAnswer(String question, View view, SurveyDbAdapter db){
        String response = getEditableViewText(view);
        SurveyResponse savedResponse = db.getResponseByIdAndQuestion(surveyId, question);
        if (savedResponse != null){
            savedResponse.setResponse(response);
            db.updateResponse(savedResponse);
        }else if (response != null && !response.isEmpty()){
            db.insertResponse(new SurveyResponse(surveyId, question, response));
        }
    }

    private String getEditableViewText(View view){
        String retVal = null;
        if(view instanceof RadioGroup) retVal = getRadioGroupValue((RadioGroup) view);
        else if(view instanceof EditText) retVal = getEditTextValue((EditText) view);
        else if(view instanceof CheckBox) retVal = getCheckBoxText((CheckBox) view);
        return retVal;
    }

    public String getRadioGroupValue(RadioGroup radioGroup){
        int selected = radioGroup.getCheckedRadioButtonId();
        if (selected == -1) return null;
        return ((RadioButton)findViewById(selected)).getText().toString();
    }

    public String getEditTextValue(EditText editText){
        String retVal = null;
        CharSequence charSequence = editText.getText();
        if (charSequence != null) retVal = charSequence.toString();
        return retVal;
    }

    public String getCheckBoxText(CheckBox checkBox){
        if (checkBox.isChecked()) return checkBox.getText().toString();
        else return null;
    }

}