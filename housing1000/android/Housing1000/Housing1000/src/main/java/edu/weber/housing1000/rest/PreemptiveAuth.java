package edu.weber.housing1000.rest;

import org.apache.http.HttpException;
import org.apache.http.HttpHost;
import org.apache.http.HttpRequest;
import org.apache.http.HttpRequestInterceptor;
import org.apache.http.auth.AuthScheme;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.AuthState;
import org.apache.http.auth.Credentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.protocol.ClientContext;
import org.apache.http.protocol.ExecutionContext;
import org.apache.http.protocol.HttpContext;

import java.io.IOException;

class PreemptiveAuth implements HttpRequestInterceptor {

    public void process(HttpRequest httpRequest, HttpContext httpContext) throws HttpException, IOException {
        AuthState authState = (AuthState) httpContext.getAttribute(ClientContext.TARGET_AUTH_STATE);
        if(authState.getAuthScheme() == null) {
            AuthScheme authScheme = (AuthScheme) httpContext.getAttribute("preemptive-auth");
            CredentialsProvider credentialsProvider = (CredentialsProvider) httpContext.getAttribute(ClientContext.CREDS_PROVIDER);
            HttpHost targetHost = (HttpHost) httpContext.getAttribute(ExecutionContext.HTTP_TARGET_HOST);
            if(authScheme != null) {
                Credentials credentials = credentialsProvider.getCredentials(new AuthScope(targetHost.getHostName(), targetHost.getPort()));
                if (credentials == null) {
                    throw new HttpException("No credentials for preemptive authentication");
                }
                authState.setAuthScheme(authScheme);
                authState.setCredentials(credentials);
            }
        }
    }
}