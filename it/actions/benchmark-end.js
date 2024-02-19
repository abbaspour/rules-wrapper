exports.onExecutePostLogin = async (event, api) => {
    let {value: actions_exec_start} = api.cache.get('actions_exec_start') || {};

    if(!actions_exec_start) {
        console.error('unknown actions_exec_start');
        return;
    }

    const delta = Date.now() - Number(actions_exec_start);
    console.log(`action exec finished in ${delta} ms`);
    api.idToken.setCustomClaim('runtime', delta);
}
