module.exports.addIssue = async function (projectName,bugId, title, details) {
    console.log('addIssue args: ',arguments);
    // TODO: replace with real trello module communication
    return {web_url:'http://dummyurltobug.bugs/demo/demo'}
};

module.exports.addNote = async function (projectName,bugId, details) {
    console.log('addNote args: ',arguments);
    // TODO: replace with real trello module communication
    return {status_ok:1}
};

module.exports.getBugsStatus = async function (projectName) {
    let bugs = [{bugId: 8, status: 2}];
    return bugs;
};
