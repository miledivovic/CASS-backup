require("../shims/cassproject.js");
require("../shims/stjs.js");
require("./skyId.js");

require('../adapter/asn/asn.js');
require('../adapter/case/caseAdapter.js');
require('../adapter/case/caseIngest.js');
require('../adapter/ceasn/ceasn.js');
require('../adapter/scd/scd.js');
// Tests remaining: Import concept schemes
require('../adapter/jsonLd/jsonLd.js');
require('../adapter/openbadges/openbadges.js');
require('../adapter/xapi/xapi.js');
require('../adapter/replicate/replicate.js');
require('../profile/coordinator.js')();