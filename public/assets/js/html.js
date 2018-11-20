

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
            let precautions = "<h3>Precautions</h3><h5>Never take this medication with the following: </h5>" + resp.doNotUseWith + "<h5>The presence of other medical problems may affect the use of this medicine. Make sure you tell your doctor if you have any other medical problems, especially: </h5>" + parseArrayIntoUnorderedList(resp.precautionMedicalConditions) + "<h5>FDA Warning Label: </h5>" + resp.infoBlackBox
            
            $("#sendPrecautionsHere").html(precautions);
            $("#sendRelatedDrugsHere").html(parseArrayIntoUnorderedList(resp.infoRelatedPills));
            $("#sendDosingHere").html(resp.dosingInfoParsed);
            $("#sendOverviewHere").html(resp.overviewContent)
            
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