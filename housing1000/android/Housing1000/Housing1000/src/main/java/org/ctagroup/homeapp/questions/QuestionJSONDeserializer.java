package org.ctagroup.homeapp.questions;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;

import java.lang.reflect.Type;

/**
 * Overrides the default GSON library behavior for deserializing the Question class
 * This is needed because the Question class is abstract and it cannot be instantiated
 * So we need to intercept GSON and return the appropriate question types that
 * extend the Question class
 * Created by Blake on 1/24/14.
 */
public class QuestionJSONDeserializer implements JsonDeserializer<Question> {
    @Override
    public Question deserialize(JsonElement jsonElement, Type type, JsonDeserializationContext jsonDeserializationContext) throws JsonParseException {
        JsonObject object = jsonElement.getAsJsonObject();

        Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();

        String questionType = object.get("QuestionType").getAsString();
        String questionJson = jsonElement.toString();

        Question question;

        switch (QuestionType.getTypeFromString(questionType))
        {
            case MULTI_SELECT:
                question = gson.fromJson(questionJson, MultiSelect.class);
                break;
            case SINGLE_LINE_TEXT:
                question = gson.fromJson(questionJson, SinglelineTextBox.class);
                break;
            case SINGLE_SELECT:
                question = gson.fromJson(questionJson, SingleSelect.class);
                break;
            case SINGLE_SELECT_RADIO:
                question = gson.fromJson(questionJson, SingleSelectRadio.class);
                break;
            case SINGLE_LINE_FOR_EACH_OPTION:
                question = gson.fromJson(questionJson, SinglelineTextBoxForEachOption.class);
                break;
            case MULTILINE_TEXT:
                question = gson.fromJson(questionJson, MultilineTextBox.class);
                break;
            default:
                question = null;
        }

        return question;
    }
}
