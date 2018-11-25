
const cheerio = require("cheerio");
const axios = require("axios");
const db = require("../models")

module.exports = function (app) {

    app.get("/getinfo", function (req, res) {

        console.log(req.query.key)

        let clickTarget = req.query.key
        let nameArray = clickTarget.split(" ");
        let input = nameArray.join(" ")
        let urlFirstVal = nameArray.join("-")
        let urlSecondVal = nameArray.join("+")
        console.log(input)

        db.Rx.findOne({
            where: {
                rx_name: input
            }
        }).then(function (rxData) {
            if (rxData === null) {
                console.log("this is working. This is where we would put the code to get new info.")
                //this area is for code to run when we have never stored drug info in our DB yet for the drug thats being searched.
                Promise.all(promiseCalls).then(response => {
                    //this writes the drug to our db so its safe for us in the future.
                    // db.Rx.create({
                    //     rx_name: input,
                    //     side_effects: JSON.stringify(sideEffectsData),
                    //     main_info: JSON.stringify(dataObj)
                    // }).then(function (result) {
                    //     console.log("this is the db create result" + result.rx_name + result.side_effects);
                    // }).catch(function (err) {
                    //     console.log("this is err catcher" + err);
                    // });

                    let finalData = {
                        generalInfo: response[1],
                        sideEffects: response[0]
                    };
                    res.send(finalData)
                })
            } else {
                console.log("here is where we would deconstruct our returned data and package it up for the response.")
                //this is where code that will be run for things that we already have in our db.
                let finalData = {
                    generalInfo: JSON.parse(rxData.main_info.toString()),
                    sideEffects: JSON.parse(rxData.side_effects.toString())
                };
                res.send(finalData)
            }
        }).catch(function (error) {
            console.log("this is the err from the db search. Means doesnt exist." + error)

        })

        let mainSearchURL = "https://www.goodrx.com/" + urlFirstVal + "/what-is?drug-name=" + urlSecondVal;
        console.log(mainSearchURL)
        let sideEffectsSearchURL = "https://www.goodrx.com/" + urlFirstVal + "/side-effects";
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
                    // console.log(allSideEffectInfo)
                    let sfArr = allSideEffectInfo.split('</div>');
                    console.log(sfArr)
                    let holderArr = [];
                    let arrToTheFourth = [];
                    let sideEffectsLists = [];

                    //NEED TO BUILD A FUNCTION FOR SIDE EFFECTS THAT ARE STORED AS LIST ITEMS
                    sfArr.forEach(function (str) {
                        let arrArr = str.split('<p class="side_effect">')
                        console.log(arrArr)
                        // if (arrArr.length >= 2) {
                            holderArr.push(arrArr)
                        // }
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
                    console.log(arrToTheFourth)
                    if(arrToTheFourth.length >= 1){
                        constructSideEffectsLists(arrToTheFourth);
                    }

                    sideEffectsData = {
                        sideEffectsDisclaimer: sideEffectsDisclaimer,
                        whatToWatchForSummary: whatToWatchForSummary,
                        sideEffectsLists: sideEffectsLists,
                        messageToFutureSelf: "Hey there. Hope you're having a good day."
                    }
                    return (sideEffectsData)
                })
                .catch(error => {
                    console.log("this is an error with the side effects call" + error)
                }),

            //request for getting general info
            axios
                .get(mainSearchURL)

                .then(response => {
                    //loads scraped html
                    let $ = cheerio.load(response.data)
                    let drugExtended = $("#uat-drug-info").text();
                    let carringtonsNameData = $("#uat-drug-title > a").text();
                    let imageElement = $("#uat-drug-image-link").html()
                    let infoRelatedPills = null;
                    // console.log($("div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(2) > p:nth-child(1) > span").text() != null)
                    if($("div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(2) > p:nth-child(1) > span").text() != null){
                        infoRelatedPills = $("div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(2) > p:nth-child(1) > span").text().split(", ");
                    }
                    let infoBlackBox = $("div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(5)").text();
                    let overviewContent = $("div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(5) > div").text();
                    let dosingContent = null;
                    // div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(10) > div > ul
                    if($("div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(10) > div > ul").html() != null){
                        dosingContent = $("div._2rANW1lgQ9bqbo49JhQeTK > div > div ul").html().split("<ul>");
                    }
                    let doNotUseWith = $("div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(28) > div > ul:nth-child(3)").text();
                    let precautionMedicalConditionsHeader = "The presence of other medical problems may affect the use of this medicine. Make sure you tell your doctor if you have any other medical problems, especially:"
                    let pmc = null;
                    
                    // console.log($("div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(32) > div").text())
                    if($("div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(32) > div").text() != null){
                        pmc = $("div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(32) > div").text().split(":")
                    }
                    let dosingInfoParsed = null
                    // console.log(dosingContent != null)
                    if(dosingContent != null){
                        dosingInfoParsed = parseDosingContent();
                    }
                    // console.log(dosingInfoParsed)
                    let precautionMedicalConditions = null;
                    // console.log(pmc != null)
                    // console.log("2" + pmc)
                    // console.log(pmc.length)
                    if(pmc != null && pmc.length >= 3 ){
                        precautionMedicalConditions = handleConditionsData();
                    }
                    // console.log("market:" + precautionMedicalConditions)
                    function parseDosingContent() {
                        console.log("parseDosingContent is firing")
                        let finalReAssemblyArray = [];
                        dosingContent.splice(0, 1);
                        let intermediateString = dosingContent.join("<ul>")
                        let anotherArray = intermediateString.split("&#x2014;")
                        finalReAssemblyArray.push("<ul>");
                        finalReAssemblyArray.push(anotherArray.join("-"));
                        let returnProduct = finalReAssemblyArray.join("")
                        return (returnProduct);
                    }

                    function handleConditionsData() {
                        console.log("handleConditionsData is firing")
                        let builderArray = [];
                        // console.log(pmc[1])
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
                        drugExtended: drugExtended,
                        carringtonsNameData: carringtonsNameData,
                        imageElement: imageElement,
                        infoRelatedPills: infoRelatedPills,
                        infoBlackBox: infoBlackBox,
                        overviewContent: overviewContent,
                        doNotUseWith: doNotUseWith,
                        precautionMedicalConditionsHeader: precautionMedicalConditionsHeader,
                        precautionMedicalConditions: precautionMedicalConditions,
                        dosingInfoParsed: dosingInfoParsed,
                    }
                    return (dataObj)
                })
                .catch(error => {
                    console.log("This is an error with the general data call" + error)
                })
        ]
    })
}