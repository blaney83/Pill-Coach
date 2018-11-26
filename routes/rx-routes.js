const cheerio = require("cheerio");
const axios = require("axios");
const db = require("../models")

module.exports = function (app) {

    app.get("/getinfo", function (req, res) {

        console.log(req.query.key)
        //name array is important for structuring urls that we construct later on
        let nameArray = req.query.key.split(" ");
        //to reference drugs in the db, we will make sure they are in the proper format
        let input = nameArray.join(" ")
        //these two vals are used in urls for our axios calls
        let urlFirstVal = nameArray.join("-")
        let urlSecondVal = nameArray.join("+")
        //first thing that happens on all /getinfo calls is a check of the db
        db.Rx.findOne({
            where: {
                rx_name: input
            }
        }).then(function (rxData) {
            //if the rx doesnt exist in the db, we will go get the info
            if (rxData === null) {
                //this area is for code to run when we have never stored drug info in our DB yet for the drug thats being searched.

                //promise.all is the synchronous function for simultaneous running of two asynchronous axios calls.
                Promise.all(promiseCalls).then(response => {
                    //when both calls have resolved, we will execute this code
                    if (response[0] == null && response[1] == null) {
                        //if the drug was entirely 404, we will send back a null response to the front end
                        console.log("that was a failed request")
                        //send a bad response
                        res.send(null)
                    } else if (response[0] == null || response[1] == null) {
                        //send a partial data response if one of the two axios calls failed
                    } else {
                        //else everything must have gone ok, with at least some data being returned
                        console.log(response)
                        //this writes the drug to our db so its safe for us in the future.
                        db.Rx.create({
                            rx_name: input,
                            side_effects: JSON.stringify(sideEffectsData),
                            main_info: JSON.stringify(dataObj)
                        }).then(function (result) {
                            console.log("this is the db create result" + result.rx_name + result.side_effects);
                        }).catch(function (err) {
                            console.log("this is err catcher" + err);
                        });
                        //this will be the object we send on our response to the client
                        let finalData = {
                            generalInfo: response[1],
                            sideEffects: response[0]
                        };
                        //send that info
                        res.send(finalData)
                    }
                })
            } //this else is for the code to execute if the rx was found in our db, meaning somebody has looked for it before
            else {
                //structure our response to the frontend
                let finalData = {
                    generalInfo: JSON.parse(rxData.main_info.toString()),
                    sideEffects: JSON.parse(rxData.side_effects.toString())
                };
                //send that info
                res.send(finalData)
            }
        }).catch(function (error) {
            console.log("this is the err from the db search. Means SQL query failed. ERROR:" + error)

        })
        //VVVVVVVVVVVVVVVVVVVVV Below here is the code we need for our Axios promises VVVVVVVVVVVVVVVVVVVVVVVVVVVV
        //general info query url builder
        let mainSearchURL = "https://www.goodrx.com/" + urlFirstVal + "/what-is?drug-name=" + urlSecondVal;
        //side effects query url builder
        let sideEffectsSearchURL = "https://www.goodrx.com/" + urlFirstVal + "/side-effects";
        //parent scope empty variable waiting to receive our info
        let dataObj = {};
        let sideEffectsData = {}

        //request for getting side effect info
        const promiseCalls = [
            //call for side effects
            axios
                .get(sideEffectsSearchURL)

                .then(response => {
                    //loads scrapped html
                    let $ = cheerio.load(response.data)
                    //generic disclaimer
                    let sideEffectsDisclaimer = "Along with its needed effects, a medicine may cause some unwanted effects. Although not all of these side effects may occur, if they do occur they may need medical attention.Check with your doctor immediately if any of the following side effects occur:"
                    //grabs summary info
                    let whatToWatchForSummary = $("div.xldag1-1.jexVRC > div:nth-child(1)").html();
                    //grabs whole side effects section
                    let allSideEffectInfo = $("div.xldag1-1.gmhNEZ > div").html();

                    //these two variable will help determine if the page is in format #1 or format #2
                    let sfArr = allSideEffectInfo.split('</div>');
                    let liArr = allSideEffectInfo.split('</ul>');
                    //these two arrays hold intermediate data while its being operated on for the list constructor
                    let holderArr = [];
                    let arrToTheFourth = [];
                    //this variable ultimately holds the info that is sent back in the response
                    let sideEffectsLists = [];
                    //determines which format the page is in (1 or 2). sfArr pages are unique in that they dont have <li>'s, they contain a mass of <p> tags, as structured by the website. liArr pages have a clean structure upon receipt.
                    if (sfArr.length > liArr.length) {
                        //code if the page format is 1/2
                        sfArr.forEach(function (str) {
                            //break the blob into smaller parts
                            let arrArr = str.split('<p class="side_effect">')
                            //this if statement may or may not be necessary
                            // if (arrArr.length >= 2) {
                            holderArr.push(arrArr)
                            // }
                        });
                        //more data manipulation
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
                        //even more data manipulation. If classes or attributes need to be added to enable browser styling, this would be the best place to modify the format of the information.
                        function constructSideEffectsLists(arrayOfArraysOfEffects) {
                            arrayOfArraysOfEffects.forEach(function (arrayOfEffects) {
                                let holdMyString = ["<p>"];
                                let effectsListHeader = arrayOfEffects[0] + "</p><ul>"
                                // let effectsListHeader = arrayOfEffects[0] + "</p><div>"
                                holdMyString.push(effectsListHeader)
                                for (i = 1; i < arrayOfEffects.length; i++) {
                                    let listItem = "<li>" + arrayOfEffects[i] + "</li>"
                                    // let listItem = arrayOfEffects[i]
                                    holdMyString.push(listItem);
                                }
                                holdMyString.push("</ul>");
                                // holdMyString.push("</div>");
                                let finishedListHtml = holdMyString.join("")
                                //send that info back to the variable that will be sent on the response
                                sideEffectsLists.push(finishedListHtml)
                            });
                        };
                        //this logic prevents an error from breaking the response (Error: cannot split() null, etc.)
                        if (arrToTheFourth.length >= 1) {
                            constructSideEffectsLists(arrToTheFourth);
                        }
                    }//if the page is liArr, its much easier. We just keep the incomming format 
                    else {
                        //code if the page format is 2/2
                        let stringVal = liArr.join("</ul>")
                        //send that info back to the variable that will be sent on the response
                        sideEffectsLists.push(stringVal)
                    }
                    //this is 1/2 of the whole response object being put together with all the info from the side effects axios call
                    sideEffectsData = {
                        sideEffectsDisclaimer: sideEffectsDisclaimer,
                        whatToWatchForSummary: whatToWatchForSummary,
                        sideEffectsLists: sideEffectsLists,
                        messageToFutureSelf: "Hey there. Hope you're having a good day."
                    }
                    //return it to the promise
                    return (sideEffectsData)
                })
                .catch(error => {
                    console.log("this is an error with the side effects call" + error)
                    return (null)
                }),

            //request for getting general info
            axios
                .get(mainSearchURL)

                .then(response => {
                    //loads scraped html
                    let $ = cheerio.load(response.data)
                    //drugs extended is extra info we can access later if we need to
                    let drugExtended = $("#uat-drug-info").html();
                    //name of the drug
                    let carringtonsNameData = $("#uat-drug-title > a").html();
                    //image url from the page
                    let imageElement = $("#uat-drug-image-link").html()
                    //this whole section is to prevent partial data from being sent back
                    let infoRelatedPills = null;
                    //if the selector was null, dont put any partial info on the information of the response. Makes is cleaner to handle errors/missing data on the front end
                    if ($("div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(2) > p:nth-child(1) > span").text() != null) {
                        //if its not null, change the variable from null and attach data
                        infoRelatedPills = $("div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(2) > p:nth-child(1) > span").text().split(", ");
                    }
                    //warning info from the box NOTE: could probably use an Error catcher to prevent coupon data being displayed END NOTE
                    let infoBlackBox = null
                    let checkForCoupons = $("div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(5) > div").html()
                    if(checkForCoupons != null){
                        let checkArray = checkForCoupons.split("")
                        if(checkArray.includes("$" || "%")){
                            console.log("this is not the droid you're looking for")
                        }else{
                            //if its not a coupon, send the box warning data
                            infoBlackBox = checkForCoupons
                        }
                    }
                    //error handling overview logic
                    let overviewContent = null
                    if ($("div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(5) > div").text() == "") {
                        //if overview is null, send extended
                        overviewContent = $("#uat-drug-info").text();
                    } else if ($("div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(5) > div").text() == "" && $("#uat-drug-info").text() == "") {
                        //if no descriptions exist, send null
                        overviewContent = null
                    } else {
                        //if overviewContent is fine, send it
                        overviewContent = $("div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(5) > div").text();
                    }
                    //another error check, this time for dosing info
                    let dosingContent = null;
                    let doseCheck1 = $("div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(10) > div").html()
                    let doseCheck2 = $("div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(12)").html()
                    //if both are not null
                    if (doseCheck1 != null && doseCheck2 != null) {
                        //then split them and see which one grabbed the right info
                        let doseArray1 = doseCheck1.split("<li>")
                        let doseArray2 = doseCheck2.split("<li>")
                        if (doseArray1.length > doseArray2.length) {
                            //whichever one contains a list is the correct section
                            dosingContent = doseCheck1;
                        } else {
                            //if not the other then it must be doseCheck2
                            dosingContent = doseCheck2;
                        }
                    } else if (doseCheck1 != null && doseCheck2 == null) {
                        //if one is null and the other is not, then we go with the not null
                        dosingContent = doseCheck1
                    } else if (doseCheck1 == null && doseCheck2 != null) {
                        //opposite of above
                        dosingContent = doseCheck2
                    }//if they are both null dosingContent will stay null
                    //dosingInfoParsed gets passed into the data response
                    let dosingInfoParsed = dosingContent
                    //This grabs medical conditions that could be a problem when taking this medicine
                    let doNotUseWith = $("div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(28) > div > ul:nth-child(3)").html();
                    // this is the beginning of error checking for the associated medical conditions. Tons of error catching data below
                    let pmc = null;
                    let precautionMedicalConditions = null;
                    let conditionsCheck1 = $("div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(32) > div > ul:nth-child(2)").html()
                    let conditionsCheck2 = $("div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(4) > div > ul").html()
                    let conditionsCheck3 = $("div._2rANW1lgQ9bqbo49JhQeTK > div > div > div:nth-child(28) > div").html()
                    let conditionsArray1;
                    let conditionsArray2;
                    let conditionsArray3;

                    //then split them and see which one grabbed the right info
                    if (conditionsCheck1 != null) {
                        conditionsArray1 = conditionsCheck1.split("<li>")
                        if (conditionsCheck2 == null && conditionsCheck3 == null) {
                            pmc = conditionsCheck1
                            precautionMedicalConditions = pmc;
                        }
                    }
                    if (conditionsCheck2 != null) {
                        conditionsArray2 = conditionsCheck2.split("<li>")
                        if (conditionsCheck1 == null && conditionsCheck3 == null) {
                            pmc = conditionsCheck2
                            precautionMedicalConditions = pmc;
                        }
                    }
                    if (conditionsCheck3 != null) {
                        conditionsArray3 = conditionsCheck3.split("<li>")
                        if (conditionsCheck2 == null && conditionsCheck1 == null) {
                            pmc = conditionsCheck3
                            precautionMedicalConditions = pmc;
                        }
                    }
                    //if all are not null
                    if (conditionsCheck1 != null && conditionsCheck2 != null && conditionsCheck3 != null) {
                        if (conditionsArray3.length >= conditionsArray1.length && conditionsArray3.length >= conditionsArray1.length) {
                            pmc = conditionsCheck3
                            precautionMedicalConditions = pmc;
                        } else if (conditionsArray1.length > conditionsArray2.length) {
                            //whichever one contains a list is the correct section
                            pmc = conditionsCheck1;
                            precautionMedicalConditions = pmc;
                        } else {
                            //if not the other then it must be doseCheck2
                            pmc = conditionsCheck2;
                            precautionMedicalConditions = pmc;
                        }
                    } else if (conditionsCheck1 != null && conditionsCheck2 == null) {
                        //if one is null and the other is not, then we go with the not null
                        pmc = conditionsCheck1
                    } else if (conditionsCheck1 == null && conditionsCheck2 != null) {
                        //opposite of above
                        pmc = conditionsCheck2
                        precautionMedicalConditions = pmc;
                    }//if they are all null, pmc will stay null
                    console.log(pmc)
                    //function to create an array of associated medical conditions so we can create smart links on the client side. currently not in use.
                    function handleConditionsData() {
                        console.log("handleConditionsData is firing")
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
                    //builds the second half of the response object
                    dataObj = {
                        drugExtended: drugExtended,
                        carringtonsNameData: carringtonsNameData,
                        imageElement: imageElement,
                        infoRelatedPills: infoRelatedPills,
                        infoBlackBox: infoBlackBox,
                        overviewContent: overviewContent,
                        doNotUseWith: doNotUseWith,
                        precautionMedicalConditions: precautionMedicalConditions,
                        dosingInfoParsed: dosingInfoParsed,
                    }
                    //return and resolves the promise with the completed data
                    return (dataObj)
                })
                .catch(error => {
                    console.log("This is an error with the general data call" + error)
                    return (null)
                })
        ]
    })
}