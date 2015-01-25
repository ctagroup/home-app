package edu.weber.housing1000.data;

/**
 * @author David Horton
 */
public class DisclaimerSavedInDB {

    private DisclaimerResponse disclaimer;
    private int databaseId;

    public DisclaimerResponse getDisclaimer() {
        return disclaimer;
    }

    public int getDatabaseId() {
        return databaseId;
    }

    public DisclaimerSavedInDB(DisclaimerResponse disclaimerResponse, int databaseId) {
        this.disclaimer = disclaimerResponse;
        this.databaseId = databaseId;
    }
}
