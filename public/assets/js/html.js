
//current code for Modal vvvvvvvvvvvvvvv
$(document).ready(function () {
    console.log("hello")

    let dataSelectors = [".tile"
        //can add modal information to other things by putting their selectors here
    ];

    $(document).on("click", ".tile", function (event) {
        $("#exampleModalLong").modal("toggle")
    })

    function getData(arr) {
        $(document).on("click", arr, function (event) {
            let rx = event.target.id;
            console.log(rx)

            $.ajax({
                method: "GET",
                url: "/getinfo",
                data: {
                    key: rx,
                },
            }).then(function (resp) {
                console.log(resp)
                console.log(Object.entries(resp.sideEffects))
                console.log(Object.entries(resp.generalInfo))
                let sideEffectsMissingCheckMainArray = Object.entries(resp.sideEffects)
                let genInfoMissingCheckMainArray = Object.entries(resp.generalInfo)

                sideEffectsMissingCheckMainArray.forEach(function(array, ind){
                    if(array[1].length <= 2){
                        console.log(array[0] + "is missing data")
                        resp.sideEffects.array[0] = "CHANGING DATA LIKE A GOD"
                    }
                })

                genInfoMissingCheckMainArray.forEach(function(array, ind){
                    console.log(array[0] + " " + array[1].length + (typeof array[1]))
                    if((typeof array[1]) != "object" && array[1].length <= 2 && array[0] != "imageElement" || array[1] == "<ul>" ){
                        console.log(array[0] + "is missing data")
                        resp.generalInfo.array[0] = "CHANGING DATA LIKE A GOD"
                    }
                })

                let precautions = "<h3>Precautions</h3><h5>Never take this medication with the following: </h5>" + resp.generalInfo.doNotUseWith + "<h5>The presence of other medical problems may affect the use of this medicine. Make sure you tell your doctor if you have any other medical problems, especially: </h5>" + ListSmartLinks(resp.generalInfo.precautionMedicalConditions) + "<h5>FDA Warning Label: </h5>" + resp.infoBlackBox
                let sideEffectsBuild = "<h4>" + resp.sideEffects.sideEffectsDisclaimer + "</h4>" + resp.sideEffects.sideEffectsLists.join("")
                $("#sendPrecautionsHere").html(precautions);
                $("#sendRelatedDrugsHere").html(ListSmartLinks(resp.generalInfo.infoRelatedPills));
                $("#sendDosingHere").html(resp.generalInfo.dosingInfoParsed);
                $("#sendOverviewHere").html(resp.generalInfo.overviewContent);
                $("#sendWhatToWatchForHere").text(resp.sideEffects.whatToWatchForSummary)
                $("#sendSideEffectsHere").html(sideEffectsBuild);

                function ListSmartLinks(array) {
                    let starterArray = ["<ul>"]
                    array.forEach(function (val) {
                        let valArr = val.split("");
                        let urlSnip = []
                        let testInd = valArr.findIndex(checkPunctuation)
                        let linkTag = []
                        if (testInd > 0) {
                            linkTag.push(valArr.slice(0, testInd).join(""))
                        }else{
                            linkTag.push(valArr.join(""))
                        }
                        let arrArr = linkTag[0].split("")
                        arrArr.forEach((char) => {
                            if (char === " ") {
                                let newChar = "_"
                                urlSnip.push(newChar)
                            } else {
                                urlSnip.push(char)
                            }
                        })
                        let builtUrl = "https://en.wikipedia.org/wiki/" + urlSnip.join("")
                        let listItem = '<li><a href="' + builtUrl + '">' + val + '</a></li>'
                        starterArray.push(listItem)
                    });
                    starterArray.push("</ul>")
                    let returnString = starterArray.join("")
                    return (returnString);
                }
            })
        })
    };

    dataSelectors.forEach(sel => {
        getData(sel);
    });

    function checkPunctuation(val) {
        if(val == ","|| val== "("|| val=="["|| val== "."|| val== "—"){
            return true;
        }
    }
})
//current code for Modal ^^^^^^^^^^^^^^^^^^^^^