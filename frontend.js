Frontend = {};


var test;

// Hier kommt der Frontend Designer
Frontend.Designer = function()
{
var self = this;

this.actual_query = null;
this.actual_db = null;


this.submit_query = function()
	{
	var database = $('input:radio["DatabaseChoice"]:checked').val();
	var url = "";
    var query = $("#sql_query").val();
    self.actual_query = query;
    self.actual_db = database;
	query = encodeURIComponent(query);
    
	switch(database)
	 {
	 case "tweets":
	 url = "http://toskana.ludicmedia.de:10000/tweet_query?" + query;
	 break;
	 
	 case "articles":
	 url = "http://toskana.ludicmedia.de:10000/query?" + query;
	 break;	
	 }
		
    if (query != "")
    	{
    			
		$.ajax({
	   		type : "GET",
	    	url : url
	
	   		}).done(function(msg) {
	  		
	  		
	  		$("#query_form").fadeOut();
	  		self.paint_query_results(msg);
	  		});		
    		
    		
    	}
	}


this.paint_query_results = function(data)
{
$("#rDownload").show();
test = data;	

if (data[0])
 {
 obj = data[0];	
 var columns = [];	
 	
 for(var name in obj) 
 	{
 	// alert(name[value])	
 		
 	var c  = {
 		     id: name,
 		     name: name,
 		     field: name, 
 		     minWidth: 120,
 		     sortable: true
 		     }	
 		     
 	columns.push(c);	     
 	}
 }

  var options = {
    enableCellNavigation: true,
    enableColumnReorder: false,
    forceFitColumns: true,
    syncColumnCellResize: false,
    enableTextSelectionOnCells: true,
  };	
  
    var gridSorter = function(columnField, isAsc, grid, data) {
       var sign = isAsc ? 1 : -1;
       var field = columnField
       data.sort(function (dataRow1, dataRow2) {
              var value1 = dataRow1[field], value2 = dataRow2[field];
              var result = (value1 == value2) ?  0 :
                         ((value1 > value2 ? 1 : -1)) * sign;
              return result;
       });
       grid.invalidate();
       grid.render();
   } 
	
var grid = new Slick.Grid("#QueryBody", data, columns, options);

var isAsc = true;
var columnField = columns[0].field;

gridSorter(columnField, isAsc, grid, data);

grid.setSortColumn(columnField, isAsc); 

grid.onSort.subscribe(function (e, args) {

	gridSorter(args.sortCol.field, args.sortAsc, grid, data);

  });
  
grid.registerPlugin(new Slick.AutoTooltips());


/*
for (var i = 0; i< data.length; i++)
	{
	obj = data[i];	
	
	for(var name in obj) 
		{
    	console.log(name);
    	var value = obj[name];
    	console.log(value);
		}	
		
	}
*/

}



this.r_download = function()
{
var query = $("#sql_query").val();
	
	self.actual_query = query;
	
	var url="";

	switch(self.actual_db)
	 {
	 case "tweets":
	 url = "http://toskana.ludicmedia.de:10000/tweet_download?" + self.actual_query;
	 break;
	 
	 case "articles":
	 url = "http://toskana.ludicmedia.de:10000/query_download?" + self.actual_query;
	 break;	
	 }
			
	query = encodeURIComponent(query);
	
    if (query != "")
    	{
    				
		$.ajax({
	   		type : "GET",
	    	url : url
	
	   		}).done(function(msg) {
	  			  		
	  		$("#query_form").fadeOut();
	  		self.create_download_link();
	  		});		
    		
    		
    		
    	}
}

this.create_download_link = function()
	{
    var s = '<a id="DownloadLink" href="http://toskana.ludicmedia.de/Downloads/Download.zip" download="Download.zip" class="DownloadButton">Download File</a>';
    $("#HeaderBar").append(s);	
    $("#DownloadLink").click(function() {
    $(this).remove();	
    });
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
		 
		 s += '<form id="DatabaseChoice">'
         s += '<p>Select the Database:</p>'
         s += '<p>'
         s += '<input class="radioButton" type="radio" name="Datenbank" value="tweets" checked> Tweets<br>'
         s += '<input class="radioButton" type="radio" name="Datenbank" value="articles"> Articles<br>'
         s += '</p>'
         s += '</form>'

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
		
	}

// action for Twitter button
this.twitter_query = function()
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

	s += '<div class = "RightHeaderButton" id = "rDownload"><img src = "images/download.svg"/></div>';	

	
	s += '<div id = "Titling">';
	s += 'DATASHELL';
	s += '</div>';
	
	s += '</div>';

	s += '<div id = "QueryBody"></div>';


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
		  
	 $("#rDownload").click( function(){
		
		self.r_download();
	  });
		   
	 
	 
	  

	}



self.init();	
}





function gridtest()
{
var rows = [
    {
        field_1: "value1",
        field_2: "value2"
    }, {
        field_1: "value3",
        field_2: "value4"
    }
];


  var columns = [
    {id: "title", name: "Title", field: "field_1"},
    {id: "duration", name: "Duration", field: "field_2"}
  ];

  var options = {
    enableCellNavigation: true,
    enableColumnReorder: false
  };	
	
	
var slickgrid = new Slick.Grid("#QueryBody", rows, columns, options);	
}


var designer; 

$(document).ready(function () {
	
	designer = new Frontend.Designer();
	
	// gridtest();
});
