
const cheerio = require("cheerio");
const request = require("request");
const axios = require("axios")
// const rp = require("request-promise");
// const path = require("path")

// axios.get(URL).then(res => res);

// const ajaxCalls = [
//     axios.get(URL),
//     axios.get(URL2)
// ];

// Promise.all(ajaxCalls).then(res => {

// })

module.exports = function (app) {

    app.get("/getinfo", function (req, res) {

        console.log(req.query.key)

        let input = req.query.key
        let mainSearchURL = "https://www.goodrx.com/" + input + "/what-is?drug-name=" + input;
        let sideEffectsSearchURL = "https://www.goodrx.com/" + input + "/side-effects";
        let dataObj = {};
        let sideEffectsData = {}

        //request for getting side effect info
        const promiseCalls = [
            axios
                .get(sideEffectsSearchURL)

                .then(response => {
                    //loads scrapped html
                    let $ = cheerio.load(response.data)
                    let sideEffectsDisclaimer = "Along with its needed effects, a medicine may cause some unwanted effects. Although not all of these side effects may occur, if they do occur they may need medical attention.Check with your doctor immediately if any of the following side effects occur:"
                    let whatToWatchForSummary = $("div.xldag1-1.jexVRC > div:nth-child(1)").text();
                    let allSideEffectInfo = $("div.xldag1-1.gmhNEZ > div").html();
                    let sfArr = allSideEffectInfo.split('</div>');
                    let holderArr = [];
                    let arrToTheFourth = [];
                    let sideEffectsLists = [];

                    sfArr.forEach(function (str) {
                        let arrArr = str.split('<p class="side_effect">')
                        if (arrArr.length >= 2) {
                            holderArr.push(arrArr)
                        }
                    });

                    holderArr.forEach(function (arr) {
                        let arrArrArr = arr[0].split('<p class="head">');
                        let importantStr = arrArrArr[arrArrArr.length - 1];
                        arr.splice(0, 1, importantStr);
                        let arrCubed = [];
                        arr.forEach(function (sideEffectStr) {
                            let arrSquared = sideEffectStr.split("</p>")
                            arrCubed.push(arrSquared[0])
                        })
                        arrToTheFourth.push(arrCubed)
                    });

                    function constructSideEffectsLists(arrayOfArraysOfEffects) {
                        arrayOfArraysOfEffects.forEach(function (arrayOfEffects) {
                            let holdMyString = ["<h5>"];
                            let effectsListHeader = arrayOfEffects[0] + "</h5><ul>"
                            holdMyString.push(effectsListHeader)
                            for (i = 1; i < arrayOfEffects.length; i++) {
                                let listItem = "<li>" + arrayOfEffects[i] + "</li>"
                                holdMyString.push(listItem);
                            }
                            holdMyString.push("</ul>");
                            let finishedListHtml = holdMyString.join("")
                            sideEffectsLists.push(finishedListHtml)
                        });
                    };

                    constructSideEffectsLists(arrToTheFourth);

                    return (sideEffectsData = {
                        sideEffectsDisclaimer: sideEffectsDisclaimer,
                        whatToWatchForSummary: whatToWatchForSummary,
                        sideEffectsLists: sideEffectsLists,
                        messageToFutureSelf: "Hey there. Hope you're having a good day."
                    })
                })
                .catch(error => {
                    console.log(error)
                }),

            //request for getting general info
            axios
                .get(mainSearchURL)

                .then(response => {

                    //loads scrapped html
                    let $ = cheerio.load(response.data)
                    let carringtonsNameData = $("#uat-drug-title > a").text();
                    let imageElement = $("#uat-drug-image-link").html()
                    let infoRelatedPills = $("div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(2) > p:nth-child(1) > span").text().split(", ");
                    let infoBlackBox = $("div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(5)").text();
                    let overviewContent = $("div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(8) > div").text();
                    let dosingContent = $("div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(12)").html().split("<ul>");
                    let doNotUseWith = $("div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(28) > div > ul:nth-child(3)").text();
                    let precautionMedicalConditionsHeader = "The presence of other medical problems may affect the use of this medicine. Make sure you tell your doctor if you have any other medical problems, especially:"
                    let pmc = $("div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(32) > div").text().split(":")
                    let dosingInfoParsed = parseDosingContent();
                    let precautionMedicalConditions = handleConditionsData();

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

                    return (dataObj = {
                        carringtonsNameData: carringtonsNameData,
                        imageElement: imageElement,
                        infoRelatedPills: infoRelatedPills,
                        infoBlackBox: infoBlackBox,
                        overviewContent: overviewContent,
                        doNotUseWith: doNotUseWith,
                        precautionMedicalConditionsHeader: precautionMedicalConditionsHeader,
                        precautionMedicalConditions: precautionMedicalConditions,
                        dosingInfoParsed: dosingInfoParsed,
                    })
                })
                .catch(error => {
                    console.log(error)
                })
        ]

        Promise.all(promiseCalls).then(response => {
            console.log(response)
            let finalData = {
                generalInfo: response[1],
                sideEffects: response[0]
            };
            res.send(finalData)
        })

        // setTimeout(function () {
        //     let finalData = {
        //         generalInfo: dataObj,
        //         sideEffects: sideEffectsData
        //     };
        //     console.log(finalData);
        //     console.log(dataObj);
        //     console.log(sideEffectsData);
        //     res.send(finalData);
        // }, 10000)
    })
}