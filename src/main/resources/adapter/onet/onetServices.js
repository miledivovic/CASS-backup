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
            return parseXml(httpGet("https://services.onetcenter.org/ws/online/occupations/" + soc + "/details/technology_skills?all=1&display=long", {
                Authorization: "Basic " + forge.util.encode64(basicAuthUsername + ":" + basicAuthPassword)
            }));
        }
    }

    var soc = "17-2051.00";
    //    return JSON.stringify({
    //        skills: onetService.skills(soc),
    //        knowledge: onetService.knowledge(soc),
    //        abilities: onetService.abilities(soc),
    //        workActivities: onetService.workActivities(soc),
    //        detailedWorkActivities: onetService.detailedWorkActivities(soc),
    //        workStyles: onetService.workStyles(soc),
    //        tasks: onetService.tasks(soc),
    //        technologySkills: onetService.technologySkills(soc)
    //    });

    var root = "https://services.onetcenter.org/ws/";
    var competencies = {};

    var skills = onetService.skills(soc).skills.element;
    debug("skills: " + skills.length);
    for (var i = 0; i < skills.length; i++) {
        var skill = skills[i];
        var c = new EcCompetency();
        c.name = skill.name;
        c.description = skill.description;
        c.id = root + "skills/" + skill.id;
        competencies[c.id]=c;
    }

    var knowledges = onetService.knowledge(soc).knowledge.element;
    debug("knowledges: " + knowledges.length);
    for (var i = 0; i < knowledges.length; i++) {
        var knowledge = knowledges[i];
        var c = new EcCompetency();
        c.name = knowledge.name;
        c.description = knowledge.description;
        c.id = root + "knowledge/" + knowledge.id;
        competencies[c.id]=c;
    }

    var abilities = onetService.abilities(soc).abilities.element;
    debug("abilities: " + abilities.length);
    for (var i = 0; i < abilities.length; i++) {
        var ability = abilities[i];
        var c = new EcCompetency();
        c.name = ability.name;
        c.description = ability.description;
        c.id = root + "abilities/" + ability.id;
        competencies[c.id]=c;
    }

    var workActivities = onetService.workActivities(soc).work_activities.element;
    debug("workActivities: " + workActivities.length);
    for (var i = 0; i < workActivities.length; i++) {
        var workActivity = workActivities[i];
        var c = new EcCompetency();
        c.name = workActivity.name;
        c.description = workActivity.description;
        c.id = root + "work_activities/" + workActivity.id;
        competencies[c.id]=c;
    }

    var detailedWorkActivities = onetService.detailedWorkActivities(soc).detailed_work_activities.activity;
    debug("detailedWorkActivities: " + detailedWorkActivities.length);
    for (var i = 0; i < detailedWorkActivities.length; i++) {
        var detailedWorkActivity = detailedWorkActivities[i];
        var c = new EcCompetency();
        c.name = detailedWorkActivity.content;
        c.id = root + "detailed_work_activities/" + detailedWorkActivity.id;
        competencies[c.id]=c;
    }

    var workStyles = onetService.workStyles(soc).work_styles.element;
    debug("workStyles: " + workStyles.length);
    for (var i = 0; i < workStyles.length; i++) {
        var workStyle = workStyles[i];
        var c = new EcCompetency();
        c.name = workStyle.name;
        c.description = workStyle.description;
        c.id = root + "work_styles/" + workStyle.id;
        competencies[c.id]=c;
    }

    var tasks = onetService.tasks(soc).tasks.task;
    debug("tasks: " + tasks.length);
    for (var i = 0; i < tasks.length; i++) {
        var task = tasks[i];
        var c = new EcCompetency();
        c.name = task.statement;
        c.id = root + "tasks/" + task.id;
        competencies[c.id]=c;
    }

    var technologySkills = onetService.technologySkills(soc).technology_skills.category;
    debug("technologySkills: " + technologySkills.length);
    for (var i = 0; i < technologySkills.length; i++) {
        var technologySkill = technologySkills[i];
        var c = new EcCompetency();
        c.name = technologySkill.title.content;
        c.id = root + "tools_technology/" + technologySkill.title.id;
        competencies[c.id]=c;
        if (!EcArray.isArray(technologySkill.example))
            technologySkill.example = [technologySkill.example];
        for (var j = 0; j < technologySkill.example.length; j++) {
            var example = technologySkill.example[j];
            var c = new EcCompetency();
            if (EcObject.isObject(example))
                c.name = example.content;
            else
                c.name = example;
            c.id = root + "tools_technology/" + c.name.replaceAll(" ", "_");
        	competencies[c.id]=c;
        }
    }
    var keys = EcObject.keys(competencies);
    debug("total: " + keys.length);
    for (var i = 0;i < keys.length;i++)
    {
    	var registrationId = stringToHex(md5(keys[i]));
    	var c = competencies[keys[i]];
		var compVersion=date(null, null, true);
    	skyrepoPut.call(this,{obj:c.toJson(),type:c.getFullType().replace("http://", "").replaceAll("/", "."),id:registrationId,version:compVersion});
    }
    return JSON.stringify(EcObject.keys(competencies), null, 2);
};

bindWebService("/onet/harvest", onetHarvest);