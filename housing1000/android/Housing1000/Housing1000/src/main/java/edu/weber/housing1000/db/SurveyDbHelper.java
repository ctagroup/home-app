package edu.weber.housing1000.db;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

public class SurveyDbHelper extends SQLiteOpenHelper {


    private static final String RESPONSES_CREATE_SQL =
            "create table " +SurveyDbAdapter.RESPONSES_TABLE+
                    "(" +
                    SurveyDbAdapter.RESPONSES_FIELD_ID +" integer primary key autoincrement, " +
                    SurveyDbAdapter.RESPONSES_FIELD_SURVEY_ID +" integer not null, " +
                    SurveyDbAdapter.RESPONSES_FIELD_QUESTION +" text not null, " +
                    SurveyDbAdapter.RESPONSES_FIELD_RESPONSE +" text " +
                    ");";

    private static final String SURVEYS_CREATE_SQL =
            "create table " +SurveyDbAdapter.SURVEYS_TABLE+
                    "(" +
                    SurveyDbAdapter.SURVEYS_FIELD_ID +" integer primary key autoincrement, " +
                    SurveyDbAdapter.SURVEYS_FIELD_HMS_ID +" integer not null, " +
                    SurveyDbAdapter.SURVEYS_FIELD_STATUS +" integer not null, " +
                    SurveyDbAdapter.SURVEYS_FIELD_CREATED +" integer not null," +
                    SurveyDbAdapter.SURVEYS_FIELD_UPDATED +" integer not null" +
                    ");";

    public SurveyDbHelper(Context context)
    {
        super(context, SurveyDbAdapter.DB_NAME, null, SurveyDbAdapter.DB_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db)
    {
        db.execSQL(RESPONSES_CREATE_SQL);
        db.execSQL(SURVEYS_CREATE_SQL);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion)
    {
      //TODO add code here to migrate from one db version to another
    }
}
