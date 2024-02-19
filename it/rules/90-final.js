function final(user, context, callback) {
    const info = global.info;

    if (context.rules_exec_start) {
        const delta = Date.now() - context.rules_exec_start;
        info(`rules exec v ${context.rules_version} id: ${context.rules_exec_id} finished in ${delta} ms`);
        context.idToken.runtime = delta;
    }

    return callback(null, user, context);
}