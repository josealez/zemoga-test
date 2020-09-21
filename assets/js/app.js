//-------------------Read json data--------------------//
async function fetchJsonData(file) {
  try {
    let response = await fetch(file);
    let data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}
//----------------------------------------------------------//

//---------- initial variables---------- //
let peopleList = [];
let numLikes = 0;
let numDislikes = 0;
let voteId;
let likes;
let dislikes;
//------------------------ Push all the data items in an array----------------//
function loadPeopleData(data) {
  data.forEach((element) => {
    peopleList.push(element);
  });
}

fetchJsonData("../assets/json/DATA.json").then(loadPeopleData);
//------------------------ Push all the data items in an array----------------//

//-------------------------------Function called to close the modal----------------------------//
function closeModal() {
  document.getElementById("modalVote").classList.remove("show");
}
//-------------------------------Function called to close the modal----------------------------//

//------------------------------------------Click event for the responsive menu-----------------------//
document
  .getElementById("menu-toggle")
  .addEventListener("click", function (event) {
    event.preventDefault();
    let nav = document.querySelector("#main");
    let body = document.querySelector("body");
    let content = document.querySelector(".content");
    nav.classList.toggle("toggled");
    body.classList.toggle("toggled");
    content.classList.toggle("toggled");
  });
//------------------------------------------Click event for the responsive menu-----------------------//

document.addEventListener("DOMContentLoaded", function () {
  new Vue({
    el: "#people",
    data: {
      data_people: peopleList,
    },
    methods: {
      /*---------------------------------------------- Update votes --------------*/
      updateVotes: function (index) {
        if (localStorage.getItem("numLikes" + "-" + index) === null) {
          localStorage.setItem("numLikes" + "-" + index, 0);
        }
        if (localStorage.getItem("numDislikes" + "-" + index) === null) {
          localStorage.setItem("numDislikes" + "-" + index, 0);
        }

        likes = localStorage.getItem("percentageLikes" + "-" + index);
        dislikes = localStorage.getItem("percentageDislikes" + "-" + index);
        if (likes != null && dislikes != null) {
          let person = document.getElementById(index);
          this.updatePercentage(person, likes);
        }
      },
      /*---------------------------------------------- Update votes -----------------*/
      /*---------------------------------------------- Selection of likes or dislikes--------------*/
      pressVote: function (id, thumbs) {
        voteId = id;

        numLikes = 0;
        numDislikes = 0;

        let person = document.getElementById(id);
        if (thumbs === "like") {
          //verfify if the user pressed the like button
          numLikes = 1;
          numDislikes = 0;
          person.querySelector(".btn-like").classList.add("border-white");
          person.querySelector(".btn-dislike").classList.remove("border-white");
        } else if (thumbs === "dislike") {
          //verfify if the user pressed the dislike button
          numLikes = 0;
          numDislikes = 1;
          person.querySelector(".btn-like").classList.remove("border-white");
          person.querySelector(".btn-dislike").classList.add("border-white");
        }
        peopleList.forEach((element) => {
          if (id !== element.id) {
            document
              .getElementById(element.id)
              .querySelector(".btn-like")
              .classList.remove("border-white");
            document
              .getElementById(element.id)
              .querySelector(".btn-dislike")
              .classList.remove("border-white");
          }
        });
      },
      /*---------------------------------------------- Selection of likes or dislike--------------*/
      /*---------------------------------------------- Likes & dislikes percentage calculation--------------*/
      calculatePercentage: function (id) {
        let decimal;
        let percentageInteger;
        let totalLikes = localStorage.getItem("numLikes" + "-" + id); //get the number of likes
        let totalDislikes = localStorage.getItem("numDislikes" + "-" + id); //get the number of dislikes
        let person = document.getElementById(id);
        var arrayBtn = person.querySelectorAll(".vote-icon");

        if (
          document.getElementById(id).querySelector(".btn-view").innerHTML !==
          "Vote again"
        ) {
          // verify if the user already voted
          if (voteId === id) {
            // verify if the like or dislike button pressed and the vote now button are associated to the same person
            arrayBtn[0].classList.add("hide-btn"); // hide the like and dislike buttons
            arrayBtn[1].classList.add("hide-btn"); // hide the like and dislike buttons
            person.querySelector(".btn-view").innerHTML = "Vote again"; // change the text of the vote now button
            if (numLikes === 1) {
              localStorage.setItem(
                "numLikes" + "-" + id,
                parseInt(totalLikes) + 1
              ); // update the number of likes in the storage
              totalLikes = localStorage.getItem("numLikes" + "-" + id);
            }
            if (numDislikes === 1) {
              localStorage.setItem(
                "numDislikes" + "-" + id,
                parseInt(totalDislikes) + 1
              ); // update the number of dislikes in the storage
              totalDislikes = localStorage.getItem("numDislikes" + "-" + id);
            }
            decimal =
              parseInt(totalLikes) /
              (parseInt(totalDislikes) + parseInt(totalLikes)); // calculate the percentage of likes
            percentageInteger = Math.round(decimal * 100);

            localStorage.setItem(
              "percentageLikes" + "-" + id,
              percentageInteger
            ); //update or create the variable for the percentage of likes/dislikes in the storage
            localStorage.setItem(
              "percentageDislikes" + "-" + id,
              100 - percentageInteger
            );
            this.updatePercentage(person, percentageInteger);
            this.tagThumbs(id);
            document.getElementById("modalVote").classList.add("show");
            voteAgain = true;
          }
        } else {
          arrayBtn[0].classList.remove("hide-btn");
          arrayBtn[1].classList.remove("hide-btn");
          person.querySelector(".btn-view").innerHTML = "Vote now";
          person.querySelector(".btn-like").classList.remove("border-white");
          person.querySelector(".btn-dislike").classList.remove("border-white");
          person.querySelector(".btn-view").innerHTML = "Vote now";
        }

        /*---------------------------------------------- Likes & dislikes percentage calculation--------------*/
      },
      //----------------------------------------------- Change tag thumbs of each person---------------//
      tagThumbs: function (id) {
        let person = document.getElementById(id);
        likes = parseInt(localStorage.getItem("percentageLikes" + "-" + id));
        dislikes = parseInt(
          localStorage.getItem("percentageDislikes" + "-" + id)
        );
        if (likes < dislikes) {
          person.querySelector(".tagThumbs").src = "assets/img/iconDown.png";
          person.querySelector(".tagThumbs").classList.remove("bg-blue-full");
          person.querySelector(".tagThumbs").classList.add("bg-yellow-full");
        } else {
          person.querySelector(".tagThumbs").src = "assets/img/iconUp.png";
          person.querySelector(".tagThumbs").classList.add("bg-blue-full");
          person.querySelector(".tagThumbs").classList.remove("bg-yellow-full");
        }
      },
      //--------------------------------------Update percentage ---------------------//
      updatePercentage: function (person, percentageInteger) {
        person.querySelector(".likesProgress").style.width =
          percentageInteger + "%"; //update the text and with of the likes and dislikes bar
        person.querySelector(".dislikesProgress").style.width =
          100 - percentageInteger + "%";
        person.querySelector(".numPercentageLikes").innerHTML =
          percentageInteger + "%";
        person.querySelector(".numPercentageDislikes").innerHTML =
          100 - percentageInteger + "%";
      },
      //--------------------------------------Update percentage ---------------------//
    },
    //----------------------------------------------- Change tag thumbs of each person---------------//
    updated() {
      peopleList.forEach((element) => {
        this.updateVotes(element.id);
        this.tagThumbs(element.id);
      });
    },
  });
});
