package edu.weber.housing1000.data;

/**
 * @author David Horton
 */
public class ImageSavedInDB {

    private String path;
    private boolean isSignature;
    private int imageDataId;
    private String folderHash;

    public ImageSavedInDB(String path, boolean isSignature, int imageDataId, String folderHash) {
        this.path = path;
        this.isSignature = isSignature;
        this.imageDataId = imageDataId;
        this.folderHash = folderHash;
    }

    public String getPath() {
        return path;
    }

    public boolean isSignature() {
        return isSignature;
    }

    public int getImageDataId() {
        return imageDataId;
    }

    public String getFolderHash() {
        return folderHash;
    }
}
