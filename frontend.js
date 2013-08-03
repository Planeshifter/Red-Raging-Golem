Frontend = {};


var test;

// Hier kommt der Frontend Designer
Frontend.Designer = function()
{
var self = this;

this.actual_query = null;
this.actual_db = null;
this.spinner = null;
this.package_list = [];

this.show_search_process = function()
	{
	var x = document.getElementById("search_process_form");
	if (!x)
		{
		var s = '<div id = "search_process_form">';
		s += '<div id = "header">SEARCH PROCESS</div>';	
		
		 s += '<div class = "legend">Title</div>';
		 s += '<input id = "process_title" type="text"/>';
		 
		 s += '<div class = "legend">Keywords</div>';
		 s += '<input id = "process_query" type="text"/>';
		 	 
		 s += '<div class = "legend">Select Language</div>';
		 s += '<div id="language_option">';
		 s += '<select id="language_select">';
		 s += '<option selected>en</option>';
		 s += '<option>de</option>';
		 s += '<option>es</option>';
		 s += '<option>fr</option>';
		 s += '</select>';
		 s += '</div>';
		 
		 s += '<div class = "multi_container">'
		 s += '<div class = "small_legend">Longitude</div>';
		 s += '<div class = "small_legend">Latitude</div>';
		 s += '<div class = "small_legend">Radius</div>';
		 
		 s += '<input class="small_input" id = "process_lng" type="number"/>';
		 s += '<input class="small_input" id = "process_lat" type="number"/>';
		 s += '<input class="small_input" id = "process_radius" type="number"/>';
		 s += '</div>';
		 
		 s += '<div class = "submit_button" id = "process_submit_button">SUBMIT</div>'
	
		 s += '</div>'; 	
		
		 $("body").append(s);
		 
		 $("#search_process_form #header").click(function() 
		 {
		 $("#search_process_form").fadeOut();	
		 });
		 
		 $("#process_submit_button").click(function()
		 {
         var process = {};
         process.title = $("#process_title").val();
         process.query = $("#process_query").val();
         process.lat =  $("#process_lat").val();
         process.lng =  $("#process_lng").val();
         process.radius =  $("#process_radius").val();
         process.language = $("#language_select").val();
         process.typus = "twitter_job";
         
  
         var check = self.search_process_plausibilty(process);
         if (check == true)
	         {
	         self.submit_search_process(process);
	         }
	         
		 });
		 
		 $("#process_lng").change(function()
		 {
		 if (self.check_number($(this).val())==true)  
			 {
			 
			 }
		 else
			 {
			 $(this).val("");
			 } 
		 });
		}	
	else $("#search_process_form").show();	
	}

this.submit_search_process = function(process)
{
	
var data = JSON.stringify(process);	
var url = "http://toskana.ludicmedia.de:10000/new_search_process";
 
   $.post(url,
            {
            'data' : data},
            function(data){

            alert(data);
        // angekommen

            }).error(function(data, textStatus)
            {
            // alert(data.responseText);
            });	
		
}


this.check_number = function(val)
{
	var pattern = /^[0-9]{1,20}$/;
	if (pattern.test(val)) {
	    alert(val +" has numeric value");
	    return true;
	} else {
	    alert("Input is not valid.Please input a numeric value!");
	    return false;
	}
	
}

this.search_process_plausibilty = function(process)
{
var right = true;	
if(process.title == "") right = false;	
if(process.query == "") right = false;
return right;
}

this.show_glass = function()
	{
	var x = document.getElementById("glass");
	if (!x) 
		{
		var s = '<div id="glass">';
		s += '<div id="glass_spinner"><\div>';
		s +=  '<\div>';
		$("body").append(s);
		}	
	else $("#glass").show();
	
	self.spinner = new Spinner({
	lines: 12, // The number of lines to draw
	length: 7, // The length of each line
	width: 5, // The line thickness
	radius: 30, // The radius of the inner circle
	color: 'lightgrey', // #rbg or #rrggbb
	speed: 1, // Rounds per second
	trail: 100, // Afterglow percentage
	shadow: true // Whether to render a shadow
}).spin(document.getElementById("glass_spinner"));
	}
	
this.query_page_counter = 0;

this.check_counter = function()
	{
	if (self.query_page_counter == 0) 
		{
		$("#leftarrow").hide();
		$("#rightarrow").show();	
		}
	else 
		{
		$("#leftarrow").show();	
		}
	}
	
this.check_last_page = function(list)
	{
	console.log("Länge der Liste" + list.length);
	if(list.length < self.package_list[self.query_page_counter-1].length)	
	$("#rightarrow").hide();	
	}
	
this.get_left_package = function()
	{
	$("#rightarrow").show();	
	self.query_page_counter -- ;
	var list = self.package_list[self.query_page_counter];
	 
	self.paint_query_results(list);
	self.check_counter();	
	self.set_page(self.query_page_counter);
	}
	
this.get_right_package = function()
	{
	if (!this.package_list[self.query_page_counter +1])
		{
		self.query_page_counter ++ ;
		var url = "http://toskana.ludicmedia.de:10000/get_package?" + self.query_page_counter;
	    this.show_glass();
		$.ajax({
	   		type : "GET",
	    	url : url
	
	   		}).done(function(msg) {
	  		
	  		console.timeEnd("query_time");
	  		$("#query_form").fadeOut();
	  		self.paint_query_results(msg);
	  	    self.package_list.push(msg);
	  		$("#glass").hide();
	  		self.spinner.stop();
	  		self.check_counter();
	  	    self.set_page(self.query_page_counter);
	  	    self.check_last_page(msg);
	  		});			
		}
	else 
		{
		self.query_page_counter ++ ;
	    var list = self.package_list[self.query_page_counter];	 
	    self.paint_query_results(list);	
	    self.check_counter();	
	    self.set_page(self.query_page_counter);	
	    self.check_last_page(list);
		}  		
	}
	
this.set_page = function(no)
	{
	var s = "Page " + (no +1);
	$("#counterpage").html(s);	
	}	

this.submit_query = function()
	{
	self.query_page_counter = 0;
	var database = $('input:radio["DatabaseChoice"]:checked').val();
	var url = "";
    var query = $("#sql_query").val();
    self.actual_query = query;
    self.actual_db = database;
	query = encodeURIComponent(query);
	this.show_glass();
    console.time("query_time");
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
	  		
	  		console.timeEnd("query_time");
	  		$("#query_form").fadeOut();
	  		self.paint_query_results(msg);
	  		self.package_list.push(msg);
	  		$("#glass").hide();
	  		self.spinner.stop();
	  		self.check_counter();
	  		self.set_page(self.query_page_counter);	
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
 		     minWidth: 80,
 		     width: 120,
 		     sortable: true,
 		     toolTip: name
 		     }	
 		     
 	columns.push(c);	     
 	}
 }

  var options = {
    enableCellNavigation: true,
    enableColumnReorder: false,
    forceFitColumns: false,
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
	self.show_search_process();	
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
    s += '<div id = "FooterBar">';
    s += '<div id = "leftarrow"><</div>';
    s += '<div id = "counterpage">...</div>';
    s += '<div id = "rightarrow">></div>';
    s += '</div>';

	$("body").append(s);

    var height = window.innerHeight - $("#QueryBody").height() - 60;
    $("#FooterBar").css("height", height);

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
		   
	 $("#leftarrow").click( function()
	 {
	 self.get_left_package();
	 });
	 
	 		   
	 $("#rightarrow").click( function()
	 {
	 self.get_right_package();
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
