package edu.weber.housing1000;


import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.*;

public class ClientInfoActivity extends Activity
{

    /* Called when the activity is first created. */
    long surveyId = -1;

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_clnt_info);

        surveyId = -1;


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
                finish();
            }
        });
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