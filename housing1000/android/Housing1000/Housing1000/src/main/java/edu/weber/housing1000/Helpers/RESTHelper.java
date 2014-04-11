package edu.weber.housing1000.Helpers;

import android.content.Context;
import android.util.Log;

import com.google.gson.Gson;
import com.squareup.okhttp.OkHttpClient;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.lang.reflect.Type;
import java.security.KeyStore;
import java.security.cert.Certificate;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.ArrayList;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManagerFactory;

import edu.weber.housing1000.R;
import retrofit.RestAdapter;
import retrofit.client.OkClient;
import retrofit.converter.ConversionException;
import retrofit.converter.Converter;
import retrofit.converter.GsonConverter;
import retrofit.mime.TypedInput;
import retrofit.mime.TypedOutput;


/**
 * This is a generic helper class to help perform
 * HTTP connection tasks.
 * @author Blake
 */
public class RESTHelper {

    /**
     * Sets up the SSL context by importing the SSL certificate, etc.
     * @param context Android context
     * @return SSL Context
     */
    private static SSLContext getSSLContext(Context context) {
        try {
            // Load CAs from an InputStream
            // (could be from a resource or ByteArrayInputStream or ...)
            CertificateFactory cf = CertificateFactory.getInstance("X.509");
            // From https://www.washington.edu/itconnect/security/ca/load-der.crt
            Certificate ca;
            try {
                InputStream caInput = context.getResources().openRawResource(R.raw.certificate);
                ca = cf.generateCertificate(caInput);
                System.out.println("ca=" + ((X509Certificate) ca).getSubjectDN());
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }

            // Create a KeyStore containing our trusted CAs
            String keyStoreType = KeyStore.getDefaultType();
            KeyStore keyStore = KeyStore.getInstance(keyStoreType);
            keyStore.load(null, null);
            keyStore.setCertificateEntry("ca", ca);

            // Create a TrustManager that trusts the CAs in our KeyStore
            String tmfAlgorithm = TrustManagerFactory.getDefaultAlgorithm();
            TrustManagerFactory tmf = TrustManagerFactory.getInstance(tmfAlgorithm);
            tmf.init(keyStore);

            // Create an SSLContext that uses our TrustManager
            SSLContext sslContext = SSLContext.getInstance("TLS");
            sslContext.init(null, tmf.getTrustManagers(), null);

            return sslContext;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    /**
     * Converts an InputStream to a String
     * @param is - InputStream
     * @return - String response
     */
    public static String convertStreamToString(InputStream is) {
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        StringBuilder sb = new StringBuilder();

        String line = null;
        try {
            while ((line = reader.readLine()) != null) {
                sb.append(line);
                sb.append("\n");
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                is.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return sb.toString();
    }

    /**
     * Sets up the RestAdapter Builder
     * @param context Android Context
     * @return RestAdapter Builder
     */
    private static RestAdapter.Builder setUpRestAdapterBuilder(Context context)
    {
        // Set up SSL
        SSLContext sslContext = RESTHelper.getSSLContext(context);
        OkHttpClient client = new OkHttpClient();

        // This setHostnameVerifier line removes hostname verification!
        // Remove when in the production environment!
        client.setHostnameVerifier(new HostnameVerifier() {
            @Override
            public boolean verify(String hostname, SSLSession session) {
                return true;
            }
        });

        client.setSslSocketFactory(sslContext.getSocketFactory());
        OkClient okClient = new OkClient(client);

        return new RestAdapter.Builder()
                .setClient(okClient)
                .setLogLevel(RestAdapter.LogLevel.FULL)
                .setEndpoint("https://staging.ctagroup.org/Survey/api");
    }

    /**
     * Sets up the RestAdapter, with a JSON response
     * @param context Android context
     * @param gson GSON that will be used to convert the data of the request to JSON
     * @return RestAdapter
     */
    public static RestAdapter setUpRestAdapter(Context context, Gson gson)
    {
        RestAdapter.Builder builder = setUpRestAdapterBuilder(context);

        if (gson != null)
            builder.setConverter(new GsonConverter(gson));

        return builder.build();
    }

    /**
     * Sets up the RestAdapter, WITHOUT deserializing the response
     * @param context Android context
     * @param gson GSON that will be used to convert the data of the request to JSON
     * @return RestAdapter
     */
    public static RestAdapter setUpRestAdapterNoDeserialize(Context context, Gson gson)
    {
        RestAdapter.Builder builder = setUpRestAdapterBuilder(context);

        // GSON object is provided for serializing the data being sent
        if (gson != null)
        {
            // Disable deserializing the server response from JSON
            // but still have the ability to serialize to JSON
            GsonConverter converter = new GsonConverter(gson){
                @Override
                public Object fromBody(TypedInput body, Type type) throws ConversionException {
                    try {
                        return RESTHelper.convertStreamToString(body.in());
                    } catch (IOException e) {
                        e.printStackTrace();
                    }

                    return "COULDN'T PARSE SERVER RESPONSE.";
                }
            };

            builder.setConverter(converter);
        }
        else // No GSON object is provided
        {
            builder.setConverter(new Converter() {
                @Override
                public String fromBody(TypedInput body, Type type) throws ConversionException {
                    return body.toString();
                }

                @Override
                public TypedOutput toBody(final Object object) {
                    return new TypedOutput() {
                        @Override
                        public String fileName() {
                            return null;
                        }

                        @Override
                        public String mimeType() {
                            return "text/plain";
                        }

                        @Override
                        public long length() {
                            return object.toString().length();
                        }

                        @Override
                        public void writeTo(OutputStream out) throws IOException {
                            out.write(object.toString().getBytes());
                        }
                    };
                }
            });
        }

        return builder.build();
    }

    public static ArrayList<TypedOutput> generateTypedOutputFromImages(ArrayList<String> paths, String clientSurveyId )
    {
        ArrayList<TypedOutput> result = new ArrayList<>();

        for (String path : paths) {
            Log.d("Photo path:", path);
            File photoFile = new File(path);

            final String photoFileName = clientSurveyId + "_" + photoFile.getName().replace(".secure", ".png");

            final byte[] photoBytes = EncryptionHelper.decryptImage(photoFile);

            TypedOutput typedOutput = new TypedOutput() {
                @Override
                public String fileName() {
                    return photoFileName;
                }

                @Override
                public String mimeType() {
                    return "image/*";
                }

                @Override
                public long length() {
                    return photoBytes.length;
                }

                @Override
                public void writeTo(OutputStream out) throws IOException {
                    out.write(photoBytes);
                }
            };

            result.add(typedOutput);
        }

        return result;
    }

}
