
//current code for Modal vvvvvvvvvvvvvvv
$(document).ready(function () {
    console.log("hello")

    $(document).on("click", ".tile", function(event){
        $("#exampleModalLong").modal("toggle")
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
            let precautions = "<h3>Precautions</h3><h5>Never take this medication with the following: </h5>" + resp.generalInfo.doNotUseWith + "<h5>The presence of other medical problems may affect the use of this medicine. Make sure you tell your doctor if you have any other medical problems, especially: </h5>" + parseArrayIntoUnorderedList(resp.generalInfo.precautionMedicalConditions) + "<h5>FDA Warning Label: </h5>" + resp.infoBlackBox
            let sideEffectsBuild = "<h4>" + resp.sideEffects.sideEffectsDisclaimer + "</h4>" + resp.sideEffects.sideEffectsLists.join("")
            $("#sendPrecautionsHere").html(precautions);
            $("#sendRelatedDrugsHere").html(parseArrayIntoUnorderedList(resp.generalInfo.infoRelatedPills));
            $("#sendDosingHere").html(resp.generalInfo.dosingInfoParsed);
            $("#sendOverviewHere").html(resp.generalInfo.overviewContent);
            $("#sendWhatToWatchForHere").text(resp.sideEffects.whatToWatchForSummary)
            $("#sendSideEffectsHere").html(sideEffectsBuild);
            
            function parseArrayIntoUnorderedList(array){
                let starterArray = ["<ul>"]
                array.forEach(function(val){
                    let listItem = "<li>" + val + "</li>"
                    starterArray.push(listItem)
                });
                starterArray.push("</ul>")
                let returnString = starterArray.join("")
                return(returnString);
            }
        })
    })
})
//current code for Modal ^^^^^^^^^^^^^^^^^^^^^