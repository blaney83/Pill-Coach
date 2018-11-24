
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

                sideEffectsMissingCheckMainArray.forEach(function (array, ind) {
                    if ((typeof array[1]) != "object" && array[1].length <= 2 && array[0] != "imageElement" || array[1] == "<ul>") {
                        console.log(array[0] + "is missing data")
                        let addInfoLink = ListSmartLinks([rx]);
                        $("#" + array[0]).html("<h6>Hmmm... it looks like our data for this area is missing or incomplete. If you are in need of additional information, you'll find more at this link: </h6>" + addInfoLink)
                    } else if (array[0] == "sideEffectsLists" && array[1].length < 2) {
                        console.log(array[0] + array[1].join(""))
                        $("#" + array[0]).html(array[1].join(""))
                    } else {
                        $("#" + array[0]).html(array[1])
                    }
                })

                genInfoMissingCheckMainArray.forEach(function (array, ind) {
                    console.log(array[0] + " " + array[1].length + (typeof array[1]))
                    if ((typeof array[1]) != "object" && array[1].length <= 2 && array[0] != "imageElement" || array[1] == "<ul>") {
                        console.log(array[0] + "is missing data")
                        let addInfoLink = ListSmartLinks([rx]);
                        $("#" + array[0]).html("<h6>Hmmm... it looks like our data for this area is missing or incomplete. If you are in need of additional information, you'll find more at this link: </h6>" + addInfoLink)
                    } else {
                        $("#" + array[0]).html(array[1])
                    }
                })

                $("#sendMedicalConditionsHere").html(ListSmartLinks(resp.generalInfo.precautionMedicalConditions));
                $("#sendRelatedDrugsHere").html(ListSmartLinks(resp.generalInfo.infoRelatedPills));

                function ListSmartLinks(array) {
                    let starterArray = ["<ul>"]
                    array.forEach(function (val) {
                        let valArr = val.split("");
                        let urlSnip = []
                        let testInd = valArr.findIndex(checkPunctuation)
                        let linkTag = []
                        if (testInd > 0) {
                            linkTag.push(valArr.slice(0, testInd).join(""))
                        } else {
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
        if (val == "," || val == "(" || val == "[" || val == "." || val == "—") {
            return true;
        }
    }
    //current code for Modal ^^^^^^^^^^^^^^^^^^^^^
    //* Below is for adding a pill

    let newPillForm = $("form.pill-form")
    let rxName = $("input#rx-name")
    let dosage = $("input#dosage")
    let quantity = $("input#quantity")
    let freqAmount = $("input#freq-amt")
    let freqTime = $("input#freq-time")
    let freqInt = $("select#freq-int")

    newPillForm.on("submit", function (event) {
        event.preventDefault();
        let pillData = {
            rx_name: rxName.val().trim(),
            dosage: dosage.val().trim(),
            quantity: quantity.val().trim(),
            frequency_amount: freqAmount.val().trim(),
            frequency_time: freqTime.val().trim(),
            frequency_interval: freqInt.val()
        }
        console.log(pillData)
        console.log(pillData.rx_name)
        addPill(pillData.rx_name, pillData.dosage, pillData.quantity, pillData.frequency_amount, pillData.frequency_time, pillData.frequency_interval)
        
    })

    function addPill(rx_name, dosage, quantity, frequency_amount, frequency_time, frequency_interval) {
        $.post("/api/user_pills", {
            rx_name: rx_name,
            dosage: dosage,
            quantity: quantity,
            frequency_amount: frequency_amount,
            frequency_time: frequency_time,
            frequency_interval: frequency_interval
        }).then(function (data) {
            console.log(data.url)
            $("#pillModal").modal("toggle")
        }).catch(function(err) {
            console.log(err);
        })
    }
});