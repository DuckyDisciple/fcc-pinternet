'use strict';

module.exports = {
    // 'gitHubAuth': {
    //     'clientID': process.env.GITHUB_KEY,
    //     'clientSecret': process.env.GITHUB_SECRET,
    //     'callbackURL': process.env.APP_URL + 'auth/github/callback'
    // },
    'googleAuth': {
        'clientID': process.env.GOOGLE_KEY,
        'clientSecret': process.env.GOOGLE_SECRET,
        'callbackURL': process.env.APP_URL + 'auth/google/callback'
    }
};