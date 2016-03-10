function insertBulkFromCsv() {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    $("#importCsv").foundation('open');
}

function analyzeCsv() {
    var file = $("#importCsvFile")[0].files[0];
    Papa.parse(file, {
        complete: function (results) {
            var data = results.data;
            if (data.length === undefined || data.length == 0) {
                alert("Invalid CSV.");
                return;
            }
            $("#importCsvColumnName").html("<option>N/A</option>");
            $("#importCsvColumnDescription").html("<option>N/A</option>");
            $("#importCsvColumnScope").html("<option>N/A</option>");
            for (var i = 0; i < data[0].length; i++) {
                $("#importCsvColumnName").append("<option/>").children().last().text(data[0][i]).attr("index", i);
                $("#importCsvColumnDescription").append("<option/>").children().last().text(data[0][i]).attr("index", i);
                $("#importCsvColumnScope").append("<option/>").children().last().text(data[0][i]).attr("index", i);
            }
        }
    });
}

function importCsv() {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    var file = $("#importCsvFile")[0].files[0];
    EcRepository.get(frameworkId, function (framework) {
        if (framework.competency == null)
            framework.competency = [];
        Papa.parse(file, {
            complete: function (results) {
                var data = results.data;
                if (data.length === undefined || data.length == 0) {
                    alert("Invalid CSV.");
                    return;
                }
                var nameIndex = parseInt($("#importCsvColumnName option:selected").attr("index"));
                var descriptionIndex = parseInt($("#importCsvColumnDescription option:selected").attr("index"));
                var scopeIndex = parseInt($("#importCsvColumnScope option:selected").attr("index"));
                for (var i = 1; i < data.length; i++) {
                    (function (i) {
                        var f = new EcCompetency();
                        if (data[i][nameIndex] === undefined || data[i][nameIndex] == "")
                            return;
                        if (nameIndex !== undefined)
                            f.name = data[i][nameIndex];
                        if (descriptionIndex !== undefined)
                            f.description = data[i][descriptionIndex];
                        if (scopeIndex !== undefined)
                            f.scope = data[i][scopeIndex];
                        f.generateId(repo.selectedServer);
                        if (identity != null)
                            f.addOwner(identity.ppk.toPk());
                        framework.competency.push(f.shortId());
                        EcRepository.save(f, function () {}, error);
                    })(i);
                }
                EcRepository.save(framework, function () {
                    timeout(function () {
                        populateFramework(frameworkId);
                    });
                }, error);
                $("#importCsv").foundation('close');
            }
        }, error);
    });
}

var csvOutput = [];

function exportCsv() {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    $("#exportCsvStatus").text("Getting Latest Framework Data...")
    $("#exportCsv").foundation('open');
    csvOutput = [];
    EcRepository.get(frameworkId, function (fw) {
        if (fw.competency === undefined || fw.competency.length == 0)
            timeout(function () {
                $("#exportCsv").foundation('close');
            });
        for (var i = 0; i < fw.competency.length; i++) {
            var competencyUrl = fw.competency[i];
            (function (competencyUrl, fw) {
                timeout(function () {
                    EcRepository.get(competencyUrl, function (competency) {
                        csvOutput.push(JSON.parse(competency.toJson()));
                        if (csvOutput.length == fw.competency.length) {
                            var csv = Papa.unparse(csvOutput);
                            var pom = document.createElement('a');
                            pom.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
                            pom.setAttribute('download', fw.name + ".csv");

                            if (document.createEvent) {
                                var event = document.createEvent('MouseEvents');
                                event.initEvent('click', true, true);
                                pom.dispatchEvent(event);
                            } else {
                                pom.click();
                            }
                            $("#exportCsv").foundation('close');
                        } else
                            $("#exportCsvStatus").text("Getting Latest Competency Data: On " + csvOutput.length + " of " + fw.competency.length);
                    }, error);
                }, (i * 50));
            })(competencyUrl, fw);
        }
    });
}

function insertBulkFromMedbiqXml() {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    $("#importMedbiqXml").foundation('open');
}

function analyzeMedbiqXml() {
    var file = $("#importMedbiqXmlFile")[0].files[0];
    $("#importMedbiqXmlCompetencies").text("");
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            dom = (new DOMParser()).parseFromString(e.target.result, "text/xml");
            var obj = xml2json(dom, "");
            medbiqXmlCompetencies = {};
            medbiqXmlLookForCompetencyObject(JSON.parse(obj));
            $("#importMedbiqXmlCompetencies").text("Step 3: " + Object.keys(medbiqXmlCompetencies).length + " competencies detected. Tap Import to finish.");
        };
        reader.readAsText(file);
    }
}

function medbiqXmlLookForCompetencyObject(obj) {
    var key;
    if (isObject(obj) || isArray(obj))
        for (key in obj) {
            if (key == "CompetencyObject")
                medbiqXmlParseCompetencyObject(obj[key]);
            else
                medbiqXmlLookForCompetencyObject(obj[key]);
        }
}

var medbiqXmlCompetencies = {};
var medbiqXmlToSave = [];

function medbiqXmlParseCompetencyObject(obj) {
    if (isArray(obj)) {
        var key;
        for (key in obj) {
            medbiqXmlParseCompetencyObject(obj[key]);
        }
    } else {
        var newCompetency = {};
        if (obj["lom:lom"] !== undefined && obj["lom:lom"]["lom:general"] !== undefined) {
            newCompetency.name = obj["lom:lom"]["lom:general"]["lom:title"]["lom:string"];
            if (obj["lom:lom"]["lom:general"]["lom:description"] !== undefined)
                newCompetency.description = obj["lom:lom"]["lom:general"]["lom:description"]["lom:string"];
            if (obj["lom:lom"]["lom:general"]["lom:identifier"] !== undefined)
                newCompetency.url = obj["lom:lom"]["lom:general"]["lom:identifier"]["lom:entry"];
            if (newCompetency.description === undefined)
                newCompetency.description = "";
            medbiqXmlCompetencies[newCompetency.url] = newCompetency;
        }
    }
}

function importMedbiqXml() {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    EcRepository.get(frameworkId, function (framework) {
        if (framework.competency == null)
            framework.competency = [];
        var i = 0;
        for (var key in medbiqXmlCompetencies) {
            i += 100;
            var f = new EcCompetency();
            var obj = medbiqXmlCompetencies[key];
            if (obj.name === undefined)
                continue;
            f.name = obj.name;
            if (obj.url !== undefined)
                f.url = obj.url;
            if (obj.description !== undefined)
                f.description = obj.description;
            f.generateId(repo.selectedServer);
            if (identity != null)
                f.addOwner(identity.ppk.toPk());
            framework.competency.push(f.shortId());
            medbiqXmlToSave.push(f);
        }
        medbiqXmlStartUpload(framework);
    }, error);
}

function medbiqXmlStartUpload(framework) {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    if (medbiqXmlToSave.length == 0) {
        EcRepository.save(framework, function () {
            $("#importMedbiqXml").foundation('close');
            populateFramework(frameworkId);
        }, error);
    } else {
        for (var i = 0; i < 10; i++) {
            if (medbiqXmlToSave.length == 0) continue;
            var f = medbiqXmlToSave[0];
            medbiqXmlToSave.splice(0, 1);
            if (i == 9 || medbiqXmlToSave.length == 0)
                EcRepository.save(f, function () {
                    $("#importMedbiqXmlProgress").text("Step 4: " + medbiqXmlToSave.length + " competencies remaining to upload.");
                    medbiqXmlStartUpload(framework);
                }, error);
            else
                EcRepository.save(f, function () {
                    $("#importMedbiqXmlProgress").text("Step 4: " + medbiqXmlToSave.length + " competencies remaining to upload.");
                }, error);
        }
    }
}
