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
document.getElementById("menu-toggle").addEventListener("click", function (event) {
  event.preventDefault();
  let nav = document.querySelector('#main');
  let body = document.querySelector('body');
  let content = document.querySelector('.content');
  nav.classList.toggle('toggled');
  body.classList.toggle('toggled');
  content.classList.toggle('toggled');
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

        let likes = localStorage.getItem("percentageLikes" + "-" + index);
        let dislikes = localStorage.getItem("percentageDislikes" + "-" + index);
        if (likes != null && dislikes != null) {
          let x = document.getElementById(index);
          x.querySelector(".likesProgress").style.width = likes + "%";
          x.querySelector(".dislikesProgress").style.width = dislikes + "%";
          x.querySelector(".numPercentageLikes").innerHTML = likes + "%";
          x.querySelector(".numPercentageDislikes").innerHTML = dislikes + "%";
        }
      },
      /*---------------------------------------------- Update votes -----------------*/
      /*---------------------------------------------- Selection of likes or dislikes--------------*/
      pressVote: function (id, thumbs) {
        voteId = id;

        numLikes = 0;
        numDislikes = 0;

        let x = document.getElementById(id);
        if (thumbs === "like") {//verfify if the user pressed the like button
          numLikes = 1;
          numDislikes = 0;
          x.querySelector(".btn-like").classList.add("border-white");
          x.querySelector(".btn-dislike").classList.remove("border-white");
        } else if (thumbs === "dislike") {
          //verfify if the user pressed the dislike button
          numLikes = 0;
          numDislikes = 1;
          x.querySelector(".btn-like").classList.remove("border-white");
          x.querySelector(".btn-dislike").classList.add("border-white");
        }
      },
      /*---------------------------------------------- Selection of likes or dislike--------------*/
      /*---------------------------------------------- Likes & dislikes percentage calculation--------------*/
      calculatePercentage: function (id) {
        let decimal;
        let percentageInteger;
        let totalLikes = localStorage.getItem("numLikes" + "-" + id); //get the number of likes
        let totalDislikes = localStorage.getItem("numDislikes" + "-" + id); //get the number of dislikes
        let x = document.getElementById(id);
        var arrayBtn = x.querySelectorAll(".vote-icon");

        if (
          document.getElementById(id).querySelector(".btn-view").innerHTML !=
          "Vote again"
        ) {
          // verify if the user already voted
          if (voteId === id) {
            // verify if the like or dislike button pressed and the vote now button are associated to the same person
            arrayBtn[0].classList.add("hide-btn"); // hide the like and dislike buttons
            arrayBtn[1].classList.add("hide-btn"); // hide the like and dislike buttons
            x.querySelector(".btn-view").innerHTML = "Vote again"; // change the text of the vote now button
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
            x.querySelector(".likesProgress").style.width =
              percentageInteger + "%"; //update the text and with of the likes and dislikes bar
            x.querySelector(".dislikesProgress").style.width =
              100 - percentageInteger + "%";
            x.querySelector(".numPercentageLikes").innerHTML =
              percentageInteger + "%";
            x.querySelector(".numPercentageDislikes").innerHTML =
              100 - percentageInteger + "%";
            document.getElementById("modalVote").classList.add("show");
            voteAgain = true;
          }
        } else {
          arrayBtn[0].classList.remove("hide-btn");
          arrayBtn[1].classList.remove("hide-btn");
          x.querySelector(".btn-view").innerHTML = "Vote now";
          x.querySelector(".btn-like").classList.remove("border-white");
          x.querySelector(".btn-dislike").classList.remove("border-white");
          x.querySelector(".btn-view").innerHTML = "Vote now";
        }

        /*---------------------------------------------- Likes & dislikes percentage calculation--------------*/
      },
    },
    updated() {
      this.updateVotes("1");
      this.updateVotes("2");
      this.updateVotes("3");
      this.updateVotes("4");
    },
  });
});
