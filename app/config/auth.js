'use strict';

module.exports = {
    // 'gitHubAuth': {
    //     'clientID': process.env.GITHUB_KEY,
    //     'clientSecret': process.env.GITHUB_SECRET,
    //     'callbackURL': process.env.APP_URL + 'auth/github/callback'
    // },
    'twitterAuth': {
        'clientID': process.env.TWITTER_KEY,
        'clientSecret': process.env.TWITTER_SECRET,
        'callbackURL': process.env.APP_URL + 'auth/twitter/callback'
    }
};