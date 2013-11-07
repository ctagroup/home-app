package edu.weber.housing1000.data;


import android.database.Cursor;
import de.akquinet.android.androlog.Log;
import edu.weber.housing1000.db.SurveyDbAdapter;

import java.util.*;

public class Survey {
    public enum Status {
        CREATED(0),
        COMPLETED(1),
        SUBMITTED(2),
        SUBMIT_RETRY(3),
        FAILED(4),
        DELETED(5);

        private final int id;

        private static Map<Integer, Status> lookupMap = new HashMap<Integer, Status>();

        static {
            for (Status s : Status.values()) {
                lookupMap.put(s.getId(), s);
            }
        }

        Status(int id) {
            this.id = id;
        }

        public int getId() {
            return this.id;
        }

        public static Status getStatus(int id) {
            return lookupMap.get(id);
        }

    }

    private int id;
    private int hmsId;
    private Status status;
    private Date created;
    private Date updated;

    private Survey() {
    }

    public Survey(int hmsId, Status status) {
        this();
        this.status = status;
        this.hmsId = hmsId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getHmsId() {
        return hmsId;
    }

    public void setHmsId(int hmsId) {
        this.hmsId = hmsId;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public Date getUpdated() {
        return updated;
    }

    public void setUpdated(Date updated) {
        this.updated = updated;
    }

    public static List<Survey> getSurveys(Cursor c) {
        List<Survey> surveys = new ArrayList<Survey>();
        if (c != null) {
            c.moveToFirst();
            for (int i = 0; i < c.getCount(); i++){
                try {
                    Map<String, Integer> locMap = new HashMap<String, Integer>();
                    int idLoc = c.getColumnIndexOrThrow(SurveyDbAdapter.SURVEYS_FIELD_ID);
                    int hmsIdLoc = c.getColumnIndexOrThrow(SurveyDbAdapter.SURVEYS_FIELD_HMS_ID);
                    int statusLoc = c.getColumnIndexOrThrow(SurveyDbAdapter.SURVEYS_FIELD_STATUS);
                    int createdLoc = c.getColumnIndexOrThrow(SurveyDbAdapter.SURVEYS_FIELD_CREATED);
                    int updatedLoc = c.getColumnIndexOrThrow(SurveyDbAdapter.SURVEYS_FIELD_UPDATED);

                    Survey s = new Survey();
                    s.setHmsId(c.getInt(hmsIdLoc));
                    s.setId(c.getInt(idLoc));
                    s.setStatus(Status.getStatus(c.getInt(statusLoc)));
                    s.setCreated(new Date(c.getInt(createdLoc)));
                    s.setUpdated(new Date(c.getInt(updatedLoc)));
                    surveys.add(s);
                    c.moveToNext();

                } catch (IllegalArgumentException e) {
                    Log.e(e, "failed to deserialize Survey");
                }
            }
        }
        return surveys;
    }

}
