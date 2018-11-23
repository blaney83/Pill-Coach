let photoArr = ["/assets/images/01Pills.jpeg", "/assets/images/02Pills.jpeg","/assets/images/03Pills.jpeg","/assets/images/04Pills.jpeg", "/assets/images/06Pills.jpg", "/assets/images/07Pills.jpeg", "/assets/images/05pills.jpeg"]


$(document).ready(function () {
    let backgroundPic;
    let count= 0;
    console.log(photoArr)

    $(".tile").each(function (index, elem) {
        let photo = photoArr[count];
        backgroundPic = photo;

        $(elem).css("background-image", "url(" + backgroundPic + ")");
        
        if (count < photoArr.length){
            count++; 
            console.log(count)
        }
        if(count === photoArr.length) {
            count = 0;
            

        }
    })
}) 