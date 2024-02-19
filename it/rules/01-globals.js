function globals(user, context, callback) {

    const crypto = require('crypto');

    context.rules_version = '0.1.3';
    context.rules_exec_start = Date.now();
    context.rules_exec_id = crypto.randomUUID();

    global.info = global.info || function (msg) {
        console.log(`${new Date().toISOString()} id: ${context.rules_exec_id} INFO  ${msg}`);
    };
    global.error = global.error || function (msg) {
        console.log(`${new Date().toISOString()} id: ${context.rules_exec_id} ERROR ${msg}`);
    };

    global.sleep = global.sleep || function (ms) {
        return new Promise(r => setTimeout(r, ms));
    };

    global.info(`starting exec ${context.rules_exec_id} with protocol ${context.protocol}`);

    return callback(null, user, context);
}