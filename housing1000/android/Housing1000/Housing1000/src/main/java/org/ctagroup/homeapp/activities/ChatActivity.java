package org.ctagroup.homeapp.activities;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v4.app.TaskStackBuilder;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.espreccino.peppertalk.PepperTalk;
import com.espreccino.peppertalk.PepperTalkError;
import com.espreccino.peppertalk.UserCallback;
import com.google.gson.Gson;

import org.ctagroup.homeapp.R;
import org.ctagroup.homeapp.Topic;
import org.ctagroup.homeapp.User;
import org.ctagroup.homeapp.fragments.LoginFragment;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class ChatActivity extends AppCompatActivity implements
        LoginFragment.LoginFragmentListener, com.espreccino.peppertalk.PepperTalk.ConnectionListener {

    private final String TAG = "ChatActivity.class";

    static final String[] USERS = {"Test:testuser@CTA.com"};

    static final String[] TOPICS = {"10011:Hi There!"};

    static List<User> mUsers = new ArrayList<User>();
    static List<Topic> mTopics = new ArrayList<Topic>();

    private final static String PREF_USER = "com.espreccino.peppertalk.sample_user_id";
    private final static String PREF_USER_NAME = "com.espreccino.peppertalk.sample_user_name";

    UsersFragment mUsersFragment;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);

        if (savedInstanceState == null) {
            String userId = getRegisteredUser();
            Fragment fragment;
            if (userId == null) {
                getSupportActionBar().hide();
                fragment = LoginFragment.getInstance();
                getSupportFragmentManager().beginTransaction()
                        .add(R.id.container, fragment)
                        .commit();
            }
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        loadDataFromPrefs();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_chat, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        return super.onOptionsItemSelected(item);
    }

    @Override
    protected void onPause() {
        super.onPause();
        saveDataToSharedPrefs();
    }

    @Override
    public void onLogin(String name, String userId) {
        registerUser(userId);
        saveUserName(name);
        loadUserFragment(userId);
    }

    private void loadUserFragment(String userId) {
        if (userId != null) {
            getSupportActionBar().show();
            setTitle("PepperTalk");
            initPepperTalk(userId);
            if (mUsersFragment == null) {
                mUsersFragment = UsersFragment.getInstance(getRegisteredUser());
            }
            getSupportFragmentManager()
                    .beginTransaction()
                    .replace(R.id.container, mUsersFragment)
                    .commit();
        }
    }

    /**
     * Add client_id and client_secret in strings.xml
     *
     * @param userId
     */
//    private void initPepperTalk(String userId) {
//        ((PepperTalkHelper) getApplicationContext())
//                .initPepperTalk(userId);
//    }
    public void initPepperTalk(String userId) {
        String clientId = getString(R.string.client_id);
        String clientSecret = getString(R.string.client_secret);

        //Initialise PepperTalk
        com.espreccino.peppertalk.PepperTalk.getInstance(this)
                .init(clientId,
                        clientSecret,
                        userId)
                .connectionListener(this)
                .connect();

        // Set UI preferences
        com.espreccino.peppertalk.PepperTalk.getInstance(this)
                .getUIPreferences()
                .enableImages(true)
                .enableLocations(true)
                .theme(R.style.Theme_Custom)
                .set();

        //Intent with activity you want to return from chat
        Intent intent = new Intent(getApplicationContext(), ChatActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);

        //Default notification ringtone
        Uri soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        PepperTalk.NotificationBuilder builder = new PepperTalk.NotificationBuilder();
        builder.notificationStatIcon(R.drawable.ic_stat_notification);
        builder.soundUri(soundUri);
        builder.taskStackBuilder(TaskStackBuilder.create(getApplicationContext())
                .addNextIntentWithParentStack(intent));

        //Enable In app notifications
        PepperTalk.getInstance(this).enabledInAppNotifications(builder);

        // Message Listener - New Message - Unread count
        PepperTalk.getInstance(getApplicationContext())
                .registerMessageListener(new PepperTalk.MessageListener() {
                    @Override
                    public void onNewMessage(String userId, String topicId, int unreadCount) {
                        //Update unread count in UI
                    }
                });

        // Use Google Play and Client services to get Registration ID.
        PepperTalk.getInstance(this).registerGcm("regID");

    }

    private void showToast(String text) {
        Toast.makeText(this, text, Toast.LENGTH_LONG).show();
    }

    @Override
    public void onConnecting(int i) {

    }

    @Override
    public void onConnected() {

    }

    @Override
    public void onConnectionFailed(PepperTalkError pepperTalkError) {

    }

    /**
     * User fragment
     */
    public static class UsersFragment extends Fragment {

        RecyclerView mRecyclerView;
        ChatListAdapter mAdapter;
        String mRegisteredUser;
        Button mButtonUpdateUser, mButtonChatWith;

        public static UsersFragment getInstance(String registeredUserId) {
            UsersFragment fragment = new UsersFragment();
            fragment.mRegisteredUser = registeredUserId;
            return fragment;
        }

        public UsersFragment() {
        }

        @Override
        public View onCreateView(LayoutInflater inflater, ViewGroup container,
                                 Bundle savedInstanceState) {
            View view = inflater.inflate(R.layout.fragment_users, container, false);
            loadRecyclerView(view);
            return view;
        }

        private void loadRecyclerView(View view) {
            mRecyclerView = (RecyclerView) view.findViewById(R.id.recycler);
            mAdapter = new ChatListAdapter(mRegisteredUser);
            LinearLayoutManager manager = new LinearLayoutManager(view.getContext(),
                    LinearLayoutManager.VERTICAL, false);
            mRecyclerView.setHasFixedSize(true);
            mRecyclerView.setLayoutManager(manager);
            mRecyclerView.setAdapter(mAdapter);
        }

        public void updateList() {
            if (mRecyclerView != null && mRecyclerView.getAdapter() != null) {
                mRecyclerView.getAdapter().notifyDataSetChanged();
            }
        }

        @Override
        public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
            super.onViewCreated(view, savedInstanceState);
            mButtonUpdateUser = (Button) view.findViewById(R.id.button_update_user);
            mButtonChatWith = (Button) view.findViewById(R.id.button_chat_with_user);
            PepperTalk.getInstance(getActivity())
                    .updateUser(mRegisteredUser, null, new UserCallback() {
                        @Override
                        public void onSuccess(com.espreccino.peppertalk.User user) {
                        }

                        @Override
                        public void onFail(PepperTalkError error) {

                        }
                    });


            mButtonUpdateUser.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    PepperTalk.getInstance(getActivity())
                            .updateUser(mRegisteredUser, null, new UserCallback() {
                                @Override
                                public void onSuccess(com.espreccino.peppertalk.User user) {
                                }

                                @Override
                                public void onFail(PepperTalkError error) {

                                }
                            });


                }
            });


            mButtonChatWith.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    AlertDialog.Builder alert = new AlertDialog.Builder(v.getContext());

                    alert.setTitle("Enter an email");
                    alert.setMessage("Chat with new user");

                    final EditText input = new EditText(v.getContext());
                    alert.setView(input);

                    alert.setPositiveButton("Ok", new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int whichButton) {
                            String value = input.getText().toString();
                            boolean has = false;
                            for (User user : mUsers) {
                                Log.i("userinfo", user.name);
                                Log.i("userinfo", user.email);

                                //if (value.equals(user.email)) {

                                if (value.equals(user.email)) {
                                    has = true;
                                    break;
                                }
                            }
                            if (!has) {
                                User user = new User(value, value);
                                mUsers.add(user);
                            }
                            PepperTalk.getInstance(getActivity())
                                    .chatWithParticipant(value)
                                    .topicId(mTopics.get(0).topicId)
                                    .topicTitle(mTopics.get(0).topicTitle)
                                    .start();
                        }
                    });

                    alert.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int whichButton) {
                            dialog.dismiss();
                        }
                    });

                    alert.show();

                }
            });
        }

        private class ChatListAdapter extends RecyclerView.Adapter<ChatListAdapter.UserHolder>
                implements PepperTalk.MessageListener {

            String registeredUser;

            ChatListAdapter(String registeredUser) {
                this.registeredUser = registeredUser;
                PepperTalk.getInstance(getActivity())
                        .registerMessageListener(this);
            }

            @Override
            public UserHolder onCreateViewHolder(ViewGroup parent, int viewType) {
                View view = LayoutInflater.from(getActivity())
                        .inflate(R.layout.item_user, parent, false);
                return new UserHolder(view);
            }

            @Override
            public void onBindViewHolder(UserHolder holder, int position) {
                holder.loadUser(mUsers.get(position));
            }

            @Override
            public int getItemCount() {
                return mUsers.size();
            }

            @Override
            public void onNewMessage(String userId, String topicId, int unreadCount) {
                boolean userExists = false;
                for (User user : mUsers) {
                    if (user.email.equals(userId)) {
                        userExists = true;
                    }
                }
                if (!userExists) {
                    User user = new User(userId, userId);
                    mUsers.add(user);
                }
                notifyDataSetChanged();
            }

            class UserHolder extends RecyclerView.ViewHolder {

                final View view;
                final TextView textUserName;
                final TextView textUserEmail;
                final TextView textMessageCount;
                User user;
                String id;

                public UserHolder(View itemView) {
                    super(itemView);
                    itemView.setOnClickListener(new UserClickListener());
                    view = itemView.findViewById(R.id.view_user);
                    textUserName = (TextView) itemView.findViewById(R.id.textView_user_name);
                    textUserEmail = (TextView) itemView.findViewById(R.id.textView_user_email);
                    textMessageCount = (TextView) itemView.findViewById(R.id.textView_message_count);
                }

                public void loadUser(Object obj) {
                    if (obj instanceof User) {
                        this.user = (User) obj;
                        this.id = user.email;
                        textUserEmail.setText(user.email);
                        textUserName.setText(user.name);
                        if (user.email.equals(registeredUser)) {
                            textUserEmail.setTextColor(Color.GREEN);
                            view.setBackgroundColor(Color.RED);
                        } else {
                            textUserEmail.setTextColor(Color.BLACK);
                            view.setBackgroundColor(Color.BLUE);
                        }
                        int count = PepperTalk.getInstance(getActivity())
                                .getParticipantUnreadCount(user.email, mTopics.get(0).topicId);
                        textMessageCount.setText(count + "");
                    }
                }

                private class UserClickListener implements View.OnClickListener {
                    @Override
                    public void onClick(View v) {
                        if (id != null) {
                            PepperTalk.getInstance(getActivity())
                                    .chatWithParticipant(id)
                                    .topicId(mTopics.get(0).topicId)
                                    .topicTitle(mTopics.get(0).topicTitle)
                                    .start();
                        }
                    }
                }
            }
        }
    }

    private boolean isUserRegistered() {
        String userId = getSharedPrefs()
                .getString(PREF_USER, null);
        return userId != null;
    }

    private String getRegisteredUser() {
        return getSharedPrefs()
                .getString(PREF_USER, null);
    }

    private void registerUser(String userId) {
        getSharedPrefs()
                .edit()
                .putString(PREF_USER, userId)
                .apply();
    }

    private void saveUserName(String userName) {
        getSharedPrefs()
                .edit()
                .putString(PREF_USER_NAME, userName)
                .apply();
    }

    private String getUserName() {
        return getSharedPrefs().getString(PREF_USER_NAME, null);
    }

    private SharedPreferences getSharedPrefs() {
        return getSharedPreferences("com.esp", MODE_PRIVATE);
    }

    private String PREF_USERS = "prefs_users";
    private String PREF_TOPICS = "prefs_topics";

    private void saveDataToSharedPrefs() {
        Gson gson = new Gson();
        SharedPreferences.Editor editor = getSharedPrefs().edit();

        Set<String> set = new HashSet<String>();
        for (User user : mUsers) {
            set.add(gson.toJson(user));
        }
        editor.putStringSet(PREF_USERS, set)
                .apply();

        set.clear();
        for (Topic topic : mTopics) {
            set.add(gson.toJson(topic));
        }
        editor.putStringSet(PREF_TOPICS, set)
                .apply();

    }

    private void loadDataFromPrefs() {
        Gson gson = new Gson();
        mUsers = new ArrayList<User>();
        mTopics = new ArrayList<Topic>();

        SharedPreferences.Editor editor = getSharedPrefs().edit();
        Set<String> set;

        set = getSharedPrefs().getStringSet(PREF_USERS, Collections.EMPTY_SET);
        if (set.isEmpty()) {
            if (mUsers.size() != USERS.length) {
                for (String usr : USERS) {
                    String[] split = usr.split(":");
                    mUsers.add(new User(split[0], split[1]));
                }
            }
        } else {
            for (String s : set) {
                User user = gson.fromJson(s, User.class);
                mUsers.add(user);
            }
        }

        set = getSharedPrefs().getStringSet(PREF_TOPICS, Collections.EMPTY_SET);

        if (set.isEmpty()) {
            if (mTopics.size() != TOPICS.length) {
                for (String topic : TOPICS) {
                    String[] split = topic.split(":");
                    mTopics.add(new Topic(split[0], split[1]));
                }
            }
        } else {
            for (String s : set) {
                Topic topic = gson.fromJson(s, Topic.class);
                mTopics.add(topic);
            }
        }

        String userId = getRegisteredUser();
        if (userId != null) {
            loadUserFragment(getRegisteredUser());
        }
    }
}
