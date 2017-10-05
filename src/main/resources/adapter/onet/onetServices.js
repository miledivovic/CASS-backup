load("classpath:base64x-1.1.js");

onetHarvest = function () {

    var basicAuthUsername = onetServicesUsername();
    var basicAuthPassword = onetServicesPassword();

    onetService = {
        skills: function (soc) {
            return parseXml(httpGet("https://services.onetcenter.org/ws/online/occupations/" + soc + "/details/skills?display=long", {
                Authorization: "Basic " + forge.util.encode64(basicAuthUsername + ":" + basicAuthPassword)
            }));
        },
        knowledge: function (soc) {
            return parseXml(httpGet("https://services.onetcenter.org/ws/online/occupations/" + soc + "/details/knowledge?display=long", {
                Authorization: "Basic " + forge.util.encode64(basicAuthUsername + ":" + basicAuthPassword)
            }));
        },
        abilities: function (soc) {
            return parseXml(httpGet("https://services.onetcenter.org/ws/online/occupations/" + soc + "/details/abilities?display=long", {
                Authorization: "Basic " + forge.util.encode64(basicAuthUsername + ":" + basicAuthPassword)
            }));
        },
        workActivities: function (soc) {
            return parseXml(httpGet("https://services.onetcenter.org/ws/online/occupations/" + soc + "/details/work_activities?display=long", {
                Authorization: "Basic " + forge.util.encode64(basicAuthUsername + ":" + basicAuthPassword)
            }));
        },
        detailedWorkActivities: function (soc) {
            return parseXml(httpGet("https://services.onetcenter.org/ws/online/occupations/" + soc + "/details/detailed_work_activities?display=long", {
                Authorization: "Basic " + forge.util.encode64(basicAuthUsername + ":" + basicAuthPassword)
            }));
        },
        workStyles: function (soc) {
            return parseXml(httpGet("https://services.onetcenter.org/ws/online/occupations/" + soc + "/details/work_styles?display=long", {
                Authorization: "Basic " + forge.util.encode64(basicAuthUsername + ":" + basicAuthPassword)
            }));
        },
        tasks: function (soc) {
            return parseXml(httpGet("https://services.onetcenter.org/ws/online/occupations/" + soc + "/details/tasks?display=long", {
                Authorization: "Basic " + forge.util.encode64(basicAuthUsername + ":" + basicAuthPassword)
            }));
        },
        technologySkills: function (soc) {
            return parseXml(httpGet("https://services.onetcenter.org/ws/online/occupations/" + soc + "/details/technology_skills?display=long", {
                Authorization: "Basic " + forge.util.encode64(basicAuthUsername + ":" + basicAuthPassword)
            }));
        }
    }

    var soc = "17-2051.00";
    return JSON.stringify({
        skills: onetService.skills(soc),
        knowledge: onetService.knowledge(soc),
        abilities: onetService.abilities(soc),
        workActivities: onetService.workActivities(soc),
        detailedWorkActivities: onetService.detailedWorkActivities(soc),
        workStyles: onetService.workStyles(soc),
        tasks: onetService.tasks(soc),
        technologySkills: onetService.technologySkills(soc)
    });

};



bindWebService("/onet/harvest", onetHarvest);
