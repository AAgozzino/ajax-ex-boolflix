$(document).ready(function(){
  // Click event on button #run --> search movie
  $("#run").click(
    function(){
      // Take value from input #search
      var searchInput = $("#search").val();
      //console.log(searchInput);
      emptyInput();
      if (searchInput != "") {
        searchMovie(searchInput);

      }
    }
  );

  // Keypress event on input #search --> search movie
  $("#search").keypress(
    function(){
      if (event.which == 13) {
        var searchInput = $("#search").val();
        emptyInput();
        if (searchInput != "") {
          searchMovie(searchInput);
        }
      };
    }
  );
});

function searchMovie(toSearch) {
  // API call to get movie information
  $.ajax(
    {
      "url": "https://api.themoviedb.org/3/search/movie",
      "data": {
        "api_key": "35d9f9841696483eb38d55a96af8b20c",
        "language": "it-IT",
        "page": 1,
        "query": toSearch
      },
      "method": "GET",
      "success": function(data){
        //console.log(data);
        var response = data.results;
        renderMovie(response);
      },
      "error": function(error){
        alert("Errore");
      }
    }
  )
};

// FUNCTION - Handlebars template render
function renderMovie(result) {
  // Set Handlebars template
  var source = $("#movie-template").html();
  var template = Handlebars.compile(source);

  for (var i = 0; i < result.length; i++) {
    var context = {
      "title" : result[i].title,
      "original_title" : result[i].original_title,
      "original_language" : result[i].original_language,
      "vote_average" : voteToFive(result[i].vote_average)
    };
    var html = template(context);
    $("#movie-list").append(html);
  }
};

// Empty ul #movie-list and input val
function emptyInput() {
  $("#movie-list").html("");
  $("#serach").val("");
};

// Convert vote base 10 to vote base 5
function voteToFive(vote) {
  return Math.ceil(vote / 2)
};
