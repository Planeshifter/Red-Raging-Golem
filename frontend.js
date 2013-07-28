Frontend = {};



Frontend.Designer = function()
{
var self = this;


this.submit_query = function()
	{
	var query = $("#sql_query").val();
	query = encodeURIComponent(query);
	
	alert(query);
	
    if (query != "")
    	{
    			
        var url = "http://toskana.ludicmedia.de:10000/query?" + query;
	
		$.ajax({
	   		type : "GET",
	    	url : url
	
	   		}).done(function(msg) {
	  		
	  		
	  		$("#query_form").fadeOut();
	  		self.paint_query_results(msg);
	  		});		
    		
    		
    		
    	}
	}


this.paint_query_results = function()
{
	
}


this.query = function()
	{
	var x = document.getElementById("query_form");
	if (!x)
		{
		var s = '<div id = "query_form">';
		
		s += '<div id = "header">DATABASE QUERY</div>';
		
		 s += '<div class = "legend">your query</div>';
		 
		 s += '<input id = "sql_query" type="text"/>';

		s += '<div class = "submit_button" id = "query_submit_button">SUBMIT</div>'

		
		s += '</div>'; 	
		
		$("body").append(s);
		
		
		$("#query_form #header").click( function(){
			$("#query_form").fadeOut();
		  });

		$("#query_submit_button").click( function(){
			self.submit_query();
		  });


		}
	$("#query_form").fadeIn();
	
		
	}
	
	

this.rss = function()
	{
	alert("RSS");
	}

this.twitter = function()
	{
	var url = "http://toskana.ludicmedia.de:10000/tweets"
	
	$.ajax({
   		type : "GET",
    	url : url

   		}).done(function(msg) {
  		console.log("waiting for an answer");
  		});

	
	}


this.init = function()
	{
	var s = '<div id = "HeaderBar">';
	
	s += '<div class = "HeaderButton" id = "rss"><img src = "rss.svg"/></div>';
	s += '<div class = "HeaderButton" id = "twitter"><img src = "twitter.png"/></div>';	
	s += '<div class = "HeaderButton" id = "query"><img src = "query.svg"/></div>';	

	
	s += '<div id = "Titling">';
	s += 'DATASHELL';
	s += '</div>';
	
	s += '</div>';

	$("body").append(s);
	
	$("#rss").click( function(){
		
		self.rss();
	  });
	  
	$("#twitter").click( function(){
		
		self.twitter();
	  });
	
	
 	$("#query").click( function(){
		
		self.query();
	  });
		  
	  

	}



self.init();	
}




var designer; 

$(document).ready(function () {
	
	designer = new Frontend.Designer();
});
