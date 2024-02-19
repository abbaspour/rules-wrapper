// noinspection JSUnusedGlobalSymbols,ReservedWordAsName
function (user, context, callback) {
    console.log(`running rule: ${index}`);
    setTimeout(() => {
        return callback(null, user, context);
    }, 1);
}