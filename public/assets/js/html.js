
//current code for Modal vvvvvvvvvvvvvvv
$(document).ready(function () {
    //toggle modal listener
    $(document).on("click", ".tile", function (event) {
        $("#exampleModalLong").modal("toggle")
    })
    //delete tile code; removes tile and db pill row
    $(document).on("click", ".deleteButton", function (event) {
        event.stopPropagation()
        event.isImmediatePropagationStopped()
        let clickTarget = event.target.id;
        let nameArray = clickTarget.split("_");
        let rx = nameArray.join(" ")

        $.ajax({
            method: "DELETE",
            url: "/api/user_pills",
            data: {
                key: rx,
            },
        }).then(function (resp) {
            console.log(resp)
            let deleteArray = resp.split(" ");
            let deleteTarget = deleteArray.join("_");
            $("#" + deleteTarget).fadeOut(300, function () { $(this).remove(); });
        })
    })
    //can add modal information to other things by putting their selectors here
    let dataSelectors = [".tile"];
    //this creates out tile click listeners 
    dataSelectors.forEach(sel => {
        getData(sel);
    });
    //this fn gets passed an array of selectors. Specifically the .tile
    function getData(arr) {
        //creates an event listener on all the selectors in the array
        $(document).on("click", arr, function (event) {
            //this is the name of the drug stored in the id of the tile
            let clickTarget = event.target.id;
            //two word ids have _ instead of " "
            let nameArray = clickTarget.split("_");
            //we are replacing the _ with " "
            let rx = nameArray.join(" ")
            //here we make our ajax call to get rx info
            $.ajax({
                method: "GET",
                url: "/getinfo",
                //send over the drug info to use on the backside code
                data: {
                    key: rx,
                },
            }).then(function (resp) {
                console.log(resp)
                console.log(Object.entries(resp.sideEffects))
                console.log(Object.entries(resp.generalInfo))
                //this creates an array of arrays with the keys for the side effects blob at [0] and the data at [1]
                let sideEffectsMissingCheckMainArray = Object.entries(resp.sideEffects)
                //this creates an array of arrays with the keys for the general info blob at [0] and the data at [1]
                let genInfoMissingCheckMainArray = Object.entries(resp.generalInfo)
                //creates an array of arrays of arrays so I can dry the code and loop
                let superMasterDataArray = [sideEffectsMissingCheckMainArray, genInfoMissingCheckMainArray]
                //loop to run missing data checks on both data arrays of arrays of keys and data lol
                superMasterDataArray.forEach(array => {
                    // for both our data arrays of arrays run a missing data check
                    array.forEach(function (array, ind) {
                        //if the second key value is null, data is missing
                        if (array[1] == null
                            //of any of these other conditions
                            || array[1] == "<ul>" || array[1] == [""] || array[1] == ""
                        ) {
                            //if the image is null, load a default image
                            if (array[0] == "imageElement") {
                                $("#" + array[0]).html("<img src='https://placehold.it/200x200/'>")
                            
                            }//for all other things that aren't image, load our missing data message
                            else {
                                //keep track of what data is missing
                                console.log(array[0] + "is missing data" + typeof array[1])
                                //this will create a link to wikipedia to display in our missing section
                                let addInfoLink = ListSmartLinks([rx]);
                                console.log(addInfoLink)
                                //takes the key and creates a selector to send our default missing data message and link
                                // console.log($("#" + array[0]).text())
                                $("#" + array[0]).html("<h6>Hmmm... it looks like our data for this area is missing or incomplete. If you are in need of additional information, you'll find more at this link: </h6>" + addInfoLink)
                            }
                        } //now if the key is for the medical conditions or the related conditions and wasnt stopped by a null value, we will create smart links and build <ul>'s.
                        else if (array[0] == "precautionMedicalConditions" && typeof array[1] == "object" && array[1].length >= 1 || array[0] == "infoRelatedPills" && typeof array[1] == "object" && array[1].length >= 1) {
                            //create target selector with key and pass it 
                            $("#" + array[0]).html(ListSmartLinks(array[1]))
                        } // if data is not missing, take that key as a selector and set the html equal to the data
                        else {
                            console.log(array[0] + "is not missing data")
                            $("#" + array[0]).html(array[1])
                        }
                    })
                })
                //creates wikipedia links for all values in an array
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
                };
                //checks for punctuation in link creator function and returns the index of the punctuation
                function checkPunctuation(val) {
                    if (val == "," || val == "(" || val == "[" || val == "." || val == "—") {
                        return true;
                    }
                }
            })
        })
    };
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
        }).catch(function (err) {
            console.log(err);
        })
    }
});