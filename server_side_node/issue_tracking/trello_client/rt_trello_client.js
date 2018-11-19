module.exports.addIssue = async function (id, title, details) {
    console.log('addIssue args: ',arguments);
    // TODO: replace with real trello module communication
    return {web_url:'http://dummyurltobug.bugs/demo/demo'}
};

module.exports.addNote = async function (id, details) {
    console.log('addNote args: ',arguments);
    // TODO: replace with real trello module communication
    return {status_ok:1}
};
