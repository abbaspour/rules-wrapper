exports.onExecutePostLogin = async (event, api) => {
    console.log(`starting exec of action protocol: ${event.transaction.protocol}`);
    api.cache.set('actions_exec_start', `${Date.now()}`);
}
