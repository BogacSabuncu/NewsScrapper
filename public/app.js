// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {

    let cardDiv = $("<div>").addClass("card my-2 newsCard");
    let cardBod = $(`<div>`).addClass("cardBody");

    cardDiv.attr("data-id",`${data[i]._id}`);

    cardBod.append(`<h5 class="card-title"> ${data[i].title}</h5>`);
    cardBod.append(` <p class="card-text">${data[i].body}</p>`);
    cardBod.append(`<a href="https://www.thestreet.com${data[i].link}">Link to Article</a>`)
    cardDiv.append(cardBod);

    $("#articles").append(cardDiv);
    //$("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});

$("#scrapeBtn").on("click", function () {
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).then(function (data) {
    document.location.reload();
  })
});

$("#clearBtn").on("click", function () {
  $.ajax({
    method: "DELETE",
    url: "/clear"
  }).then(function (data) {
    document.location.reload();
  })
});

// Whenever someone clicks a card class tag
$(document).on("click", ".newsCard", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);

      let cardDiv = $("<div>").addClass("card");
      let cardBod = $(`<div>`).addClass("cardBody");
  
      cardBod.append(`<h6 class="card-title"> ${data.title}</h6>`);
      cardBod.append("<input id='titleinput' name='title' >");
      cardBod.append("<textarea id='bodyinput' name='body'></textarea>");
      cardBod.append("<button class='btn btn-primary' data-id='" + data._id + "' id='savenote'>Save Note</button>");

      cardDiv.append(cardBod);
      $("#notes").append(cardDiv);
      
      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
