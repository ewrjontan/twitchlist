//xxxxxxxxxxxxxxxxxx Declaration of global variables xxxxxxxxxxxxxxxxxxxxxxxxx
var buttonAll = true;
var buttonOnline = false;
var buttonOffline = false;
var searchInputValue = "";

var usernameArray = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//xxxxxxxxxxxxxxxxxxx Functions xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

function userObject(username, status, game, details, link){
  this.username = username;
  this.status = status;
  this.game = game;
  this.details = details;
  this.link = link;
}

//generates api url for each username and fills channel array
function userUrl(callback){
  
  //sorts array into alphabetical order disregarding case
  usernameArray.sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });
  
  for (i=0; i<usernameArray.length; i++){
    var url = "https://wind-bow.glitch.me/twitch-api/streams/" + usernameArray[i];
  
    sendRequest(url, usernameArray[i], i, function(objectToAdd){
      //API response when search function is utilized
      if (searchInputValue.length>0){
        if (searchInputValue.toLowerCase() == ((objectToAdd.username).toLowerCase()).substr(0, searchInputValue.length)){
          if (objectToAdd.status == true){
            $("#user-container").append("<a href=" + objectToAdd.link + " class='user-element'><div class='online-dot'></div><div class='username'>" + objectToAdd.username + "</div><div class='game-name'>" + objectToAdd.game + "</div>" + "<div class='game-details'>" + objectToAdd.details + "</div></a>");  
          }else{
            $("#user-container").append("<a href=" + objectToAdd.link + " class='user-element'><div class='offline-dot'></div><div class='username-offline'>" + objectToAdd.username + "</div><div class='status-offline'><p>Offline</p></div></a>");
          };   
        };
      //API response when All tab is selected  
      }else if (buttonAll == true){
        if (objectToAdd.status == true){
          $("#user-container").append("<a href=" + objectToAdd.link + " class='user-element'><div class='online-dot'></div><div class='username'>" + objectToAdd.username + "</div><div class='game-name'>" + objectToAdd.game + "</div>" + "<div class='game-details'>" + objectToAdd.details + "</div></a>");  
        }else{
          $("#user-container").append("<a href=" + objectToAdd.link + " class='user-element'><div class='offline-dot'></div><div class='username-offline'>" + objectToAdd.username + "</div><div class='status-offline'><p>Offline</p></div></a>");
        };  
      //API response when Online tab is selected    
      }else if (buttonOnline == true){
        if (objectToAdd.status == true){
          $("#user-container").append("<a href=" + objectToAdd.link + " class='user-element'><div class='online-dot'></div><div class='username'>" + objectToAdd.username + "</div><div class='game-name'>" + objectToAdd.game + "</div>" + "<div class='game-details'>" + objectToAdd.details + "</div></a>");      
        }; 
      //API response when Offline tab is selected    
      }else{
        if (objectToAdd.status == false){ 
          $("#user-container").append("<a href=" + objectToAdd.link + " class='user-element'><div class='offline-dot'></div><div class='username-offline'>" + objectToAdd.username + "</div><div class='status-offline'><p>Offline</p></div></a>");
        };
      };  
    });   
  };  
};

function sendRequest(url, user, i, callback){
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function(){
    if (xmlHttp.readyState==4 && xmlHttp.status==200){
      var xmlResponse = JSON.parse(xmlHttp.responseText);
      
      //userObjectData parameters dependent on if stream status is online or offline
      if (xmlResponse.stream != null){
        var channelLink = "https://www.twitch.tv/" + user;
        var gameName = xmlResponse.stream.game;
        var gameDetails = xmlResponse.stream.channel.status;
        
        var userObjectData = new userObject(user, true, gameName, gameDetails, channelLink);
        callback(userObjectData); 
      }else{
        var channelLink = "https://www.twitch.tv/" + user;
        var userObjectData = new userObject(user, false, null, null, channelLink);
        callback(userObjectData);
      };      
    };
  };  
  xmlHttp.open("GET", url, true);
  xmlHttp.send();
};

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxJqueryxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
$(document).ready(function(){
  //initial function call
  userUrl(function(channelArray){
    console.log("this is working");
  });
  
  //xxxxxxxxxxxx button hover function xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  var $originalButtonColor = "";
  $(".button").hover(
    function(){
      $originalButtonColor = $(this).css("backgroundColor");
      $(this).css({"backgroundColor": "#cc7a00", "cursor": "pointer"});
    }, function(){
      $(this).css({"backgroundColor": $originalButtonColor, "cursor": "default"});
    }
  );
 
 //xxxxxxxxxxx button click events xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  $("#all-button").click(function(){
    buttonAll = true;
    buttonOnline=false;
    buttonOffline=false;
    
    $(".button").removeClass("selected");
    $("#online-button").css("backgroundColor", "orange");
    $("#offline-button").css("backgroundColor", "orange");
    $(this).addClass("selected");
    $originalButtonColor = "white";
    $("#user-container").empty();
    userUrl(function(channelArray){
    });
  });
  
  $("#online-button").click(function(){
    buttonAll=false;
    buttonOnline=true;
    buttonOffline=false;
    
    $(".button").removeClass("selected");
    $("#all-button").css("backgroundColor", "orange");
    $("#offline-button").css("backgroundColor", "orange");
    $(this).addClass("selected");
    $originalButtonColor = "white";
    $("#user-container").empty();
    userUrl(function(channelArray){
    });
  });
  
  $("#offline-button").click(function(){
    buttonAll=false;
    buttonOnline=false;
    buttonOffline=true;
    
    $(".button").removeClass("selected");
    $("#all-button").css("backgroundColor", "orange");
    $("#online-button").css("backgroundColor", "orange");
    $(this).addClass("selected");
    $originalButtonColor = "white";
    $("#user-container").empty();
    userUrl(function(channelArray){
    });
  });
  
  //xxxxxxxxxxxxxx search function xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  $("#search-input").keypress(function(){
    searchInputValue = $("#search-input").val();
    if (searchInputValue.length >0){
      $("#user-container").empty();
      userUrl(function(channelArray){
      });
    }
  });
  
  //xxxxxxxxxxxxx prevent defeault form submission xxxxxxxxxxxxxxxxxxxxxxxxxxxx
  $("#search-input").keypress(function(e){
    if (e.keyCode == 13){
      e.preventDefault();
    };
  });
  
  //xxxxxxxxxxxxxx clear search input xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  $(".fa-times").hover(
  function(){
    $(this).css({"color": "red", "cursor": "pointer"});
  }, function(){
    $(this).css({"color": "black", "cursor": "default"});
  });
  
  $(".fa-times").click(function(){
    $("#search-input").val("");
    searchInputValue = "";
    $("#user-container").empty();
    userUrl(function(channelArray){
      console.log("this is working");
    });
  });
  
  //xxxxxxxxxx functions for add and remove buttons xxxxxxxxxxxxxxxxxxxxxxxxxxx
  $(".bottom-button").hover(
    function(){
      $(this).css({"color": "#cccccc", "cursor": "pointer"});
    }, function(){
      $(this).css({"color": "white", "cursor": "default"});
    });
  
  $("#add-button").click(function(){
    addUser();
    $("#user-container").empty();
    userUrl(function(channelArray){
      console.log("this is working");
    });
  });
  
  $("#remove-button").click(function(){
    removeUser();
    $("#user-container").empty();
    userUrl(function(channelArray){
      console.log("this is working");
    });
  });  
});

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//xxxxxxxxxxxxxxxxxxxxxxxxx End jquery xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx


//xxxxxxxxxxxxxxxxxxxxx add and remove button functions xxxxxxxxxxxxxxxxxxxxxxx
function addUser(){
  var userToAdd = prompt("Enter a username to add");
  if (userToAdd != null && userToAdd.length >0){
    usernameArray.push(userToAdd);  
    alert(userToAdd + " has been added to your friends list!");
  };  
};

function removeUser(){
  var userToRemove = prompt("Enter a username to remove (Note: Case Sensitive)"); 
  var userToRemoveIndex = usernameArray.indexOf(userToRemove);
  
  if (userToRemove != null && userToRemoveIndex != -1){
    usernameArray.splice(userToRemoveIndex, 1);
    alert(userToRemove + " has been removed from your friends list!"); 
  }else if (userToRemove != null && userToRemoveIndex == -1 && userToRemove.length > 0){
    alert(userToRemove + " is not currently in your friends list!"); 
  };
  
};

/*function removeUser(){
  var userToRemove = prompt("Enter a username to remove (Note: Case Sensitive)");  
  if (userToRemove != null && userToRemove.length >0){
    for (i=0; i<usernameArray.length; i++){
      if (usernameArray[i] == userToRemove){
        usernameArray.splice(i, 1);
        alert(userToRemove + " has been removed from your friends list!"); 
        break;
      }else if (i == usernameArray.length-1){
        alert(userToRemove + " is not currently in your friends list!");
      };
    };  
  };
};*/
