package edu.weber.housing1000.Questions;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;

import org.json.JSONObject;

import java.lang.reflect.Type;

/**
 * Created by Blake on 1/24/14.
 */
public class QuestionJSONDeserializer implements JsonDeserializer<QuestionJSON> {
    @Override
    public QuestionJSON deserialize(JsonElement jsonElement, Type type, JsonDeserializationContext jsonDeserializationContext) throws JsonParseException {
        JsonObject object = jsonElement.getAsJsonObject();

        return new QuestionJSON(jsonElement.toString(), object.get("QuestionType").getAsString());
    }
}
