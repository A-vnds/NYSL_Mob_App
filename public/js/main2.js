document.getElementById("login").addEventListener("click", login);
document.getElementById("login").addEventListener("click", login);
document.getElementById("create-post").addEventListener("click", writeNewPost);
var audio = new Audio('stop1.mp3');
$(".advice").hide();
$("#posts").hide();


getPosts();

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    $(".advice").hide();
    $("#posts").show();

  } else {
    $(".advice").show();
    $("#posts").hide();
    // No user is signed in.
  }
});



// Extra:
// CHeck if the user is loged at the begining of the script
// Delete teh input once teh post mesage is send
// If the input is empty don't let send a post mesage

function login() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            $(".advice").hide();
            $("#posts").show();

        } else {
            $(".advice").show();
            $("#posts").hide();
            // No user is signed in.
        }
    });


    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
        .then(function () {
            getPosts();
        })
        .catch(function () {
            alert("Something went wrong");
        });
}


function writeNewPost() {

  var text = document.getElementById("textInput").value;
  var userName = firebase.auth().currentUser.displayName;

  // A post entry.
  var postData = {
    name: userName,
    body: text
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('myMatch').push().key;
  var updates = {};
  updates[newPostKey] = postData;

//  $("#textInput").val("");

//  audio.play();

  return firebase.database().ref().child('myMatch').update(updates);
}


function getPosts() {

  firebase.database().ref('myMatch').on('value', function (data) {

//    var logs = document.getElementById("posts");
//    logs.innerHTML = "";

    var posts = data.val();
      console.log(posts)
//    var template = "";
//
//    for (var key in posts) {
//      if (posts[key].name == firebase.auth().currentUser.displayName) {
//        template += `
//          <div class="notification is-info">
//            <p class="name">${posts[key].name} says:</p>
//            <p>${posts[key].body}</p>
//          </div>
//        `;
//      } else {
//        template += `
//          <div class="notification is-primary">
//            <p class="name">${posts[key].name} says:</p>
//            <p>${posts[key].body}</p>
//          </div>
//        `;
//      }
//    }
//
//    logs.innerHTML = template;

    $(".box").animate({ scrollTop: $(".box").prop("scrollHeight") }, 500);
  });
}



function getPosts() {

  firebase.database().ref('myMatch').on('value', function (data) {

    var logs = document.getElementById("posts");
    logs.innerHTML = "";

    var posts = data.val();

    var template = "";

    for (var key in posts) {
      if (posts[key].name == firebase.auth().currentUser.displayName) {
        template += `
          <div class="notification is-info">
            <p class="name">${posts[key].name} says:</p>
            <p>${posts[key].body}</p>
          </div>
        `;
      } else {
        template += `
          <div class="notification is-primary">
            <p class="name">${posts[key].name} says:</p>
            <p>${posts[key].body}</p>
          </div>
        `;
      }
    }

    logs.innerHTML = template;

    $(".box").animate({ scrollTop: $(".box").prop("scrollHeight") }, 500);
  });
}