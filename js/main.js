$(document).ready(function(){
  // Click event on button #run --> search movie and tv series
  $("#run").click(
    function(){
      search();
    }
  );

  // Keypress event on input #search --> search movie and tv series
  $("#search").keypress(
    function(){
      if (event.which == 13) {
        search()
      };
    }
  );
});

// FUNCTION - search movie and series
function search(){
  var searchInput = $("#search").val();
  emptyInput();
  if (searchInput != "") {
    getData("movie", searchInput);
    getData("tv", searchInput);
  }
};

// FUNCTION - get movie or tv series
function getData(type, toSearch){
  // API call to get movie information
  $.ajax(
    {
      "url": "https://api.themoviedb.org/3/search/" + type,
      "data": {
        "api_key": "35d9f9841696483eb38d55a96af8b20c",
        "language": "it-IT",
        "page": 1,
        "query": toSearch
      },
      "method": "GET",
      "success": function(data){
        //console.log(data);
        if (data.total_results == 0) {
          // If no results show message not found
          notFound(type)
        } else {
          var response = data.results;
          renderResults(response);
        }
      },
      "error": function(error){
        alert("Errore");
      }
    }
  )
};

// FUNCTION - Handlebars template render
function renderResults(result) {
  // Set Handlebars template
  var source = $("#movie-template").html();
  var template = Handlebars.compile(source);

  for (var i = 0; i < result.length; i++) {
    var context = {
      "type" : "movie",
      "title" : result[i].title,
      "poster_path" : posterPath(result[i].poster_path,result[i].title || result[i].name),
      "original_title" : result[i].original_title,
      "original_language" : printFlag(result[i].original_language),
      "vote_average" : voteToStar(result[i].vote_average),
      "overview" : result[i].overview
    };

    if (result[i].hasOwnProperty("original_name")) {
      // Modify context for tvseries
      context.type = "series"
      context.title = result[i].name;
      context.original_title = result[i].original_name;
      // Append template to #series-list
      var html = template(context);
      $("#tv-list").append(html);
    }else {
      // Append template to #move-list
      var html = template(context);
      $("#movie-list").append(html);
    }
  }
};

// FUNCTION - render message not found
function notFound(type){
  var source = $("#notfound-template").html();
  var template = Handlebars.compile(source);
  var html = template();
  $("#" + type + "-list").append(html);
};

// FUNCTION - Empty ul #movie-list, ul # and input val
function emptyInput() {
  $("#movie-list").html("");
  $("#series-list").html("");
  $("#serach").val("");
};

// FUNCTION - from vote to 5 stars
function voteToStar(vote) {
  // Vote to 5
  var starVote = Math.ceil(vote / 2);

  // Create string for stars
  var totalStars = "";
  for (var i = 0; i < 5; i++) {
    if (i < starVote) {
      totalStars += "<i class='fas fa-star'></i>";
    } else {
      totalStars += "<i class='far fa-star'></i>";
    }
  }
  return totalStars
};

// FUNCTION - from language to flag
function printFlag(lang) {
 var languageArray = ["ar", "cs", "da", "de", "el", "en", "es", "fi", "fr", "ga", "he", "hi", "id", "it", "ja", "ko", "nl", "no", "pl", "pt", "ru", "sv", "th", "tr", "uk", "vi", "zh"];

 //Check if languageArray includes lang
 if (languageArray.includes(lang)) {
   return "<img class='flag-language' src='img/flags/"+ lang +".svg' alt=''>"
 } else {
   return lang
 }
};

//FUNCTION - return complete poster path
function posterPath(moviePath,title) {
  if (moviePath != null) {
    var completePath = "https://image.tmdb.org/t/p/w342" + moviePath;
    return "<img class='poster-movie' src="+ completePath +" alt=''>";
  } else {
    return "<div class='no-img'>"+ title +"</div>"
  }

};
