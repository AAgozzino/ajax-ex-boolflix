$(document).ready(function(){
  // Click event on button #run
  $("#run").click(
    function(){
      // Take value from input #search
      var searchInput = $("#search").val();
      //console.log(searchInput);

      renderMovie(searchInput);
    }
  );

  $("#search").keypress(
    function(){
      if (event.which == 13) {
        var searchInput = $("#search").val();

        renderMovie(searchInput);
      };
    }
  );
});

function renderMovie(toSearch) {
  $("#movie-list").html("");
  // Set Handlebars template
  var source = $("#movie-template").html();
  var template = Handlebars.compile(source);

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
        for (var i = 0; i < response.length; i++) {
          var html= template(response[i]);
          $("#movie-list").append(html);
        }
      },
      "error": function(error){
        alert("Errore");
      }
    }
  )
};
