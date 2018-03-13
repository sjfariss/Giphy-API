$(document).ready();
var characters = [
  "mickey mouse",
  "minnie mouse",
  "donald duck",
  "daisy duck",
  "ariel",
  "bambi",
  "princess jasmine",
  "tinker bell",
  "nemo",
  "simba",
  "baloo"
];
function renderButtons() {
  // Deleting the gifs prior to adding new gifs
  $("#buttons-view").empty();
  // Looping through the array of characters
  for (var i = 0; i < characters.length; i++) {
    // Then dynamicaly generating buttons for each character in the array
    // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
    var a = $("<button>");
    // Adding a class of character to our button
    a.addClass("character");
    // Adding a data-attribute
    a.attr("data-name", characters[i]);
    // Providing the initial button text
    a.text(characters[i]);

    // Add delete button *Makes you have to double click first image or add to begin
    var remove = $("<span>");
    remove.text("X");

    remove.click(function(event) {
      event.preventDefault();
      $(this)
        .parent()
        .remove();
    });

    a.append(remove);

    // Adding the button to the buttons-view div
    $("#buttons-view").append(a);
  }
}

//get input from user. Store input in a variable. create and on click function for the submit buttong to render new items into our array which need to be buttons.
$("#add-gif").on("click", function(event) {
  event.preventDefault();
  userInput = $("#gif-input")
    .val()
    .trim();
  console.log(userInput);
  characters.push(userInput);
  console.log(characters);
  renderButtons();
  $("#gif-input").val("");
});

$(document).on("click", ".character", function() {
  //pointing to getting gif for character
  var x = $(this).data("name");
  console.log(x);
  // This is our info to point to our API databae
  var queryURL =
    "https://api.giphy.com/v1/gifs/search?q=" +
    x +
    "&api_key=iQTC4YFDR2rdyNJFZsPGHUB2hkIZPrxN&limit=10";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {
    console.log(response);
    //creates a new div using jquery
    var gifContainer = $("<div>");
    var gifsGoHere = $("<div>");

    gifContainer.attr("id", "gif-container");
    gifsGoHere.attr("id", "gifs-go-here");

    $("#gif-container").append(gifsGoHere);
    $("body").append(gifContainer);

    var gifs = $("<div>");
    //run a for loop so you can run through all of the gif objects in the array.
    for (var i = 0; i < response.data.length; i++) {
      //creates a new div using jquery

      var characterDiv = $("<div>");
      characterDiv.addClass("characterDiv");
      //creates a new paragraph for the "rating" text. The text is in the response data.
      var p = $("<p>").text("Rating: " + response.data[i].rating);
      //creates the image tag for all of the gifs
      //  http/https conversion with fixed height for images
      //FIRST IMAGE HAS TO BE DOUBLE CLICKED-NEED TO DEBUG
      var characterImage = $("<img>");
      characterImage.attr(
        "src",
        response.data[i].images.fixed_height_still.url.replace(
          /^http:\/\//i,
          "https://"
        )
      );
      characterImage.attr(
        "data-still",
        response.data[i].images.fixed_height_still.url.replace(
          /^http:\/\//i,
          "https://"
        )
      );
      characterImage.attr(
        "data-animate",
        response.data[i].images.fixed_height.url.replace(
          /^http:\/\//i,
          "https://"
        )
      );
      // sets different attributes for the different state of the gif
      characterImage.attr("data-state", "still");
      characterImage.addClass("gif");
      characterDiv.append(p);
      characterDiv.append(characterImage);
      gifs.prepend(characterDiv);

      ///where gifs go in html

      //keep images to 10 and not keep loading on top of eachother
    }
    if ($("#gifs-go-here").empty()) {
      $("#gifs-go-here").append(gifs);
    }
  });
}); //end of the (for) loop
//here is our on click function to start and stop the gifs once loaded onto the page
$(document).on("click", "img", function() {
  // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
  var state = $(this).attr("data-state");
  // If the clicked image's state is still, update its src attribute to what its data-animate value is.
  // Then, set the image's data-state to animate
  // Else set src to the data-still value
  if (state === "still") {
    $(this).attr("src", $(this).attr("data-animate"));
    $(this).attr("data-state", "animate");
  } else {
    $(this).attr("src", $(this).attr("data-still"));
    $(this).attr("data-state", "still");
  }
});
//var topics = ["Disney Characters", "Movie Stars", "Rock Stars", "Animals"];
renderButtons();
