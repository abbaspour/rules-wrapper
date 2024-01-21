/** wrapper **/
${wrapper_source}

/** rules **/
${rules_source}

/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {

    /*
    const wrapper = require('rules-wrapper');

    try {
        wrapper.execute([${rule_names}], {event, api});
    } catch (e) {
        console.log(`error from wrapper execution: $${JSON.stringify(e)}`);
    }
    */


    try {
        exports.execute([${rule_names}], {
            event,
            api
        });
    } catch (e) {
        console.log(`error from onExecutePostLogin wrapper execution: $${JSON.stringify(e)}`);
    }


};


/**
 * Handler that will be invoked when this action is resuming after an external redirect. If your
 * onExecutePostLogin function does not perform a redirect, this function can be safely ignored.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onContinuePostLogin = async (event, api) => {
    try {
        exports.execute([${rule_names}], {
            event,
            api,
            onContinue: true
        });
    } catch (e) {
        console.log(`error from onContinuePostLogin wrapper execution: $${JSON.stringify(e)}`);
    }
};