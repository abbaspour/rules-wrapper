function dump(user, context, callback) {
    const info = global.info;

    info(`user   : ${JSON.stringify(user)}`);
    info(`context: ${JSON.stringify(context)}`);

    return callback(null, user, context);
}