/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
const wrapper = require('../src/rules-wrapper');

exports.onExecutePostLogin = async (event, api) => {
    function rule1(user, context, callback) {
        console.log(`user: ${JSON.stringify(user)}`);
        console.log(`context: ${JSON.stringify(context)}`);

        callback(null);
    }

    await wrapper.execute([rule1], {event, api});

};