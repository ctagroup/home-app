/**
 * Created by udit on 07/07/16.
 */

// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'org.ctagroup.home',
  name: 'HOME',
  description: 'Plays Well With Others',
  author: 'Community Technology Alliace',
  email: 'javier@ctagroup.org',
  website: 'http://home.ctagroup.org',
});

// Set up resources such as icons and launch screens.
App.icons({
  iphone_2x: 'public/imgs/logo/home-circle-2400.png', // (120x120)
  iphone_3x: 'public/imgs/logo/home-circle-2400.png', // (180x180)
  ipad: 'public/imgs/logo/home-circle-2400.png', // (76x76)
  ipad_2x: 'public/imgs/logo/home-circle-2400.png', // (152x152)
  ipad_pro: 'public/imgs/logo/home-circle-2400.png', // (167x167)
  ios_settings: 'public/imgs/logo/home-circle-2400.png', // (29x29)
  ios_settings_2x: 'public/imgs/logo/home-circle-2400.png', // (58x58)
  ios_settings_3x: 'public/imgs/logo/home-circle-2400.png', // (87x87)
  ios_spotlight: 'public/imgs/logo/home-circle-2400.png', // (40x40)
  ios_spotlight_2x: 'public/imgs/logo/home-circle-2400.png', // (80x80)
  android_mdpi: 'public/imgs/logo/home-circle-2400.png', // (48x48)
  android_hdpi: 'public/imgs/logo/home-circle-2400.png', // (72x72)
  android_xhdpi: 'public/imgs/logo/home-circle-2400.png', // (96x96)
  android_xxhdpi: 'public/imgs/logo/home-circle-2400.png', // (144x144)
  android_xxxhdpi: 'public/imgs/logo/home-circle-2400.png', // (192x192)
});

App.accessRule('https://gravatar.com/*', { type: 'network' });
App.accessRule('https://www.gravatar.com/*', { type: 'network' });
App.accessRule('https://loremflickr.com/*', { type: 'network' });
App.accessRule('https://www.loremflickr.com/*', { type: 'network' });
App.accessRule('http://gravatar.com/*', { type: 'network' });
App.accessRule('http://www.gravatar.com/*', { type: 'network' });
App.accessRule('http://loremflickr.com/*', { type: 'network' });
App.accessRule('http://www.loremflickr.com/*', { type: 'network' });
