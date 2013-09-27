package edu.weber.housing1000.rest;

import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;
import org.xmlpull.v1.XmlPullParserFactory;

import java.io.IOException;
import java.io.StringReader;

public class XmlParseHelper {

    public static String parseGenID(String xml)
            throws XmlPullParserException, IOException {
        String retval = null;
        XmlPullParserFactory factory = XmlPullParserFactory.newInstance();
        factory.setNamespaceAware(true);
        XmlPullParser xpp = factory.newPullParser();
        xpp.setInput(new StringReader(xml));
        int eventType = xpp.getEventType();
        while (eventType != XmlPullParser.END_DOCUMENT) {
            if (eventType == XmlPullParser.START_TAG) {
                if (xpp.getName().equals("UniqueID")) {
                    xpp.next();
                    if (xpp.getEventType() == XmlPullParser.TEXT) {
                        retval = xpp.getText();
                        break;
                    }
                }
            }
            eventType = xpp.next();
        }
        return retval;
    }
}
