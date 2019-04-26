//grab articles json
$.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p results-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
});

//click add note
$(document).on("click", "p", function(){
    $("#notes").empty();
    var thisId = $(this).attr("data-id");

// ajax call
$.ajax({
    method: "GET",
    url: "/articles/" + thisId
})
// add note
.then(function(data) {
    console.log(data);
    $("#notes").append("<h2>" + data.title + "</h2>");
    $("#notes").append("<input id='titleinput' name='title' >");
    $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
    $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");


    //if note in article
    if (data.note) {
        //place title input
        $("#titleinput").val(data.note.title);
        //place note body
        $("#bodyinput").val(data.note.body);
    }
});
});

// click save note button
$(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");

    //POST req to change note
    $ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })

    .then(function(data) {
    console.log(data);
    $("#notes").empty();
    });

    //clear values of text input
    $("#titleinput").val("");
    $("#bodyinput").val("");
});