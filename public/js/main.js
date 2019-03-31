var app = new Vue({
    el: "#vue-app",
    data: {
        info: [],
        search: '',
        schedule: [],
        teams: [],
        maps: [],
        mapDisplayed: "",
        filteredSchedule: [],
        page: "home",
        scoreboardArray: [],
        login: "false",
        logs: "Loading Posts",
        posts: [],
        value: "",
        timestamp: "",
    },

    created: function () {
        this.getData();

    },



    methods: {

        getData: function () {
            fetch('https://api.myjson.com/bins/6qk7i', {
                    method: "GET",
                    headers: {}
                })
                .then(response => response.json())
                .then(json => {
                    app.info = json;
                    app.schedule = app.info.schedule;
                    app.teams = app.info.teams;
                    app.maps = app.info.maps;
                    app.scoreboardObject();


                })
                .catch(error => error)
        },

        displayMap(value) {

            if (this.mapDisplayed !== value) {
                this.mapDisplayed = value;
            } else {
                this.mapDisplayed = "";
            }
            console.log(this.mapDisplayed, value)
        },

        filterSchedule: function (value) {
            return this.schedule = this.info.schedule.filter(game => game.host == value || game.guest == value)

        },

        resetSchedule: function () {
            this.schedule = this.info.schedule;
        },

        showPage: function (value) {
            this.page = value;
        },
        

        scoreboardObject: function () {
            for (key in this.teams) {
                this.scoreboardArray.push(this.teams[key])
            }
            this.scoreboardArray.sort(function (a, b) {

                return Number(b.score) - Number(a.score);

            })
        },




        checkLogin: function () {

            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    app.login = true;
                    app.getPosts();

                } else {
                    app.login = false;
                }
            })
        },



        loginBtn: function () {

            var provider = new firebase.auth.GoogleAuthProvider();

            firebase.auth().signInWithPopup(provider)
                .then(function () {
                    app.login = true;
                    app.getPosts();
                
                })
                .catch(function () {
                    alert("Something went wrong");
                });

        },


        logoutBtn: function () {
            firebase.auth().signOut().then(function () {
                alert("Logout Successful");
            }).catch(function (error) {
                alert("Something went wrong");
            });
        },


        writeNewPost: function (value) {

            let text = value;
            let userName = firebase.auth().currentUser.displayName;
            let userPhoto = firebase.auth().currentUser.photoURL;
            app.getDate();
            let date = app.timestamp;

            // A post entry.
            let postData = {
                name: userName,
                body: text,
                photo: userPhoto,
                date: date,
                
            };



            // Get a key for a new Post.
            var newPostKey = firebase.database().ref().child('myMatch').push().key;
            var updates = {};
            updates[newPostKey] = postData;
            app.value = "";

            return firebase.database().ref().child('myMatch').update(updates);


        },


        getPosts: function () {

            firebase.database().ref('myMatch').on('value', function (data) {
                let posts = data.val();
                let array = [];
                for (key in posts) {
                    let message;
                    
                    if (posts[key].name == firebase.auth().currentUser.displayName) {
                        message = "msg_right"
                    } else {
                        message = "msg_left"
                    }
                    array.push({ ...posts[key],
                        msg: message});
                    
                }
                
            
                
                app.posts = array;
                
                setTimeout(function () {
                    document.getElementById("show_5seconds").style.display = "none";
                }, 2000);
                
                setTimeout(function () {
                    document.getElementById("hide_5seconds").style.display = "block";
                }, 2000)
                 setTimeout(app.scrollDown, 2000);
                ;
                
                
                setTimeout(app.scrollDown, 300);
            });

        },

        scrollDown() {
            let element = document.getElementById("messages");
                   
            element.scroll({top: element.scrollHeight, left: 0, behavior: 'smooth' })
        },
        
        
        
        
        getDate() {
            let today = new Date();
            let dd = today.getDate();
            let mm = today.getMonth()+1; //January is 0!
            let yyyy = today.getFullYear();
            let hh = today.getHours();
            let min = today.getMinutes();   
                       
            if(dd<10) {
                dd = '0'+dd
            } 

            if(mm<10) {
                mm = '0'+mm
            } 
            
            if (min<10) {
                min = '0'+min
            }
            
            let time = hh + ":" + min; 

            app.timestamp = today = dd + '/' + mm + '/' + yyyy + ' ' + time;            
            
            },
        



},
    
})




