

const cheerio = require("cheerio");
const request = require("request");
// const cors = require("cors");
const path = require("path");
const rp = require("request-promise")

module.exports = function (app) {




    app.get("/getinfo", function (req, res) {

        console.log(req.query.key)

        let input = req.query.key

        let searchURL = "https://www.goodrx.com/" + input + "/what-is?drug-name=" + input;

        let dataObj = {};

        rp(searchURL, function (error, response, html) {
            if (!error && response.statusCode == 200) {

                //loads scrapped html
                let $ = cheerio.load(html)
                let carringtonsNameData = $("#uat-drug-title > a").text();
                let imageElement = $("#uat-drug-image-link").html()
                let infoRelatedPills = $("#content > section > section > section > section > section.s8ji26z-0.kErmZY > section > div._180S5IyBsaerENxigrcm3J > div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(2) > p:nth-child(1) > span").text().split(", ");
                let infoBlackBox = $("#content > section > section > section > section > section.s8ji26z-0.kErmZY > section > div._180S5IyBsaerENxigrcm3J > div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(5)").text();
                let overviewContent = $("#content > section > section > section > section > section.s8ji26z-0.kErmZY > section > div._180S5IyBsaerENxigrcm3J > div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(8) > div").text();
                let dosingContent = $("#content > section > section > section > section > section.s8ji26z-0.kErmZY > section > div._180S5IyBsaerENxigrcm3J > div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(12)").html().split("<ul>");
                let doNotUseWith = $("#content > section > section > section > section > section.s8ji26z-0.kErmZY > section > div._180S5IyBsaerENxigrcm3J > div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(28) > div > ul:nth-child(3)").text();
                let precautionMedicalConditionsHeader = "The presence of other medical problems may affect the use of this medicine. Make sure you tell your doctor if you have any other medical problems, especially:"
                let pmc = $("#content > section > section > section > section > section.s8ji26z-0.kErmZY > section > div._180S5IyBsaerENxigrcm3J > div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(32) > div").text().split(":")
                let dosingInfoParsed = parseDosingContent();
                function parseDosingContent() {
                    let finalReAssemblyArray = [];
                    dosingContent.splice(0, 1);
                    let intermediateString = dosingContent.join("<ul>")
                    let anotherArray = intermediateString.split("&#x2014;")
                    finalReAssemblyArray.push("<ul>");
                    finalReAssemblyArray.push(anotherArray.join("--"));
                    let returnProduct = finalReAssemblyArray.join("")
                    return (returnProduct);
                }
                let precautionMedicalConditions = handleConditionsData();
                function handleConditionsData() {
                    let builderArray = [];
                    let pmc2 = pmc[1].split(" or")
                    for (let i = 0; i < pmc2.length; i++) {
                        let checkSpaceArr = pmc2[i].split("")
                        if (checkSpaceArr[0] === " ") {
                            let lastVal = builderArray[builderArray.length - 1]
                            let combinedValue = lastVal + " or" + pmc2[i]
                            builderArray.splice(builderArray.length - 1, 1, combinedValue)
                            checkSpaceArr = [];
                        } else {
                            builderArray.push(pmc2[i])
                            checkSpaceArr = [];
                        }
                    };
                    let lastArray = (builderArray[builderArray.length - 1].split(" ."));
                    lastArray.splice(lastArray.length - 1, 1)
                    builderArray.splice(builderArray.length - 1, 1)
                    lastArray.forEach(function (str) {
                        builderArray.push(str);
                    })
                    return builderArray;
                }

                // console.log(infoBlackBox)
                // console.log(infoRelatedPills)
                // console.log(overviewContent)
                // console.log("Definitely do not use with: " + doNotUseWith)
                // console.log(precautionMedicalConditionsHeader)
                // console.log(precautionMedicalConditions)
                // console.log(dosingInfoParsed)

                dataObj = {
                    carringtonsNameData: carringtonsNameData,
                    imageElement: imageElement,
                    infoRelatedPills: infoRelatedPills,
                    infoBlackBox: infoBlackBox,
                    overviewContent: overviewContent,
                    doNotUseWith: doNotUseWith,
                    precautionMedicalConditions: precautionMedicalConditions,
                    dosingInfoParsed: dosingInfoParsed,
                }

                
            }
        }).then(function(response){
            res.send(dataObj)
        })






    })

}