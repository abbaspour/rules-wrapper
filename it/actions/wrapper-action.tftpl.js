/** wrapper **/
const wrapper = require('rules-wrapper');

/** wrapper source **/
//$${wrapper_source}
//const wrapper = exports;

const original_require = require;

const complex_pkg_name_regex = /^(\@?[^\@]+)\@(.+)$/;

function verequire(name) {
    console.log(`verequire($${name})`);
    const match = name.match(complex_pkg_name_regex);
    if (match) {
        //console.log(`flatting complex package name $${name} to $${match[1]}`);
        name = match[1];
    }
    return original_require(name);
}

// eslint-disable-next-line no-global-assign
require = verequire;

/** rules **/
%{ for r in rules ~}
%{ for n,s in r ~}
const ${n} = ${s}
%{ endfor ~}
%{ endfor ~}

/** benchmark rules **/

/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
    try {
        //await wrapper.execute([{rule_names}], {event, api});
        await wrapper.execute([
            //globals,
%{ for r in rules ~}
%{ for n,s in r ~}
            ${n},
%{ endfor ~}
%{ endfor ~}
            //final
        ], {event, api});
    } catch (e) {
        console.log(`error from onExecutePostLogin wrapper execution: $${JSON.stringify(e)}`);
        throw e;
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
        //await wrapper.execute([{rule_names}], {event, api, onContinue: true});
        await wrapper.execute([
            //globals,
%{ for r in rules ~}
%{ for n,s in r ~}
            ${n},
%{ endfor ~}
%{ endfor ~}
            //final
        ], {event, api, onContinue: true});
    } catch (e) {
        console.log(`error from onContinuePostLogin wrapper execution: $${JSON.stringify(e)}`);
        throw e;
    }
};
