//**************************************************************************************************
// CASS UI Home Page Functions
//**************************************************************************************************

//**************************************************************************************************
// Constants

const CASSUI_FWK_EXP_PAGE = "cass-ui-framework-exp.html";
const CASSUI_PRF_EXP_PAGE = "cass-ui-profile-exp.html";
const CASSUI_GAP_ANL_PAGE = "cass-ui-gap-analysis.html";

//**************************************************************************************************
// Variables

//**************************************************************************************************
// Page Functions
//**************************************************************************************************

function goToFrameworkExplorer() {
    location.replace(CASSUI_FWK_EXP_PAGE);
}

function goToProfileExplorer() {
    location.replace(CASSUI_PRF_EXP_PAGE);
}

function goToGapAnalysis() {
    location.replace(CASSUI_GAP_ANL_PAGE);
}

function init() {
    loadCassUiSessionState();
    setCassUiMainMenuUserName();
}

//**************************************************************************************************
// Document on ready
//**************************************************************************************************

$(document).ready(function () {
    init();
});
