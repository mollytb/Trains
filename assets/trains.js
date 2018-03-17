$(document).ready(function () {
    console.log(12);


    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDL9dRQ7jTEz4DcphE2uo20rpCNtKLT2cU",
        authDomain: "train-depot.firebaseapp.com",
        databaseURL: "https://train-depot.firebaseio.com",
        projectId: "train-depot",
        storageBucket: "",
        messagingSenderId: "230219565183"
    };
    firebase.initializeApp(config);
    var database = firebase.database();
    var trainName = "";
    var destination = "";
    var frequency = "";
    var startTime = "";
    var minutesAway = "";
    var nextArrival = "";

    $("#add-train").on("click", function (event) {
        event.preventDefault();
        var trainName = $("#trainName").val().trim();
        var destination = $("#destination").val().trim();
        var startTime = $("#startTime").val().trim();
        var frequency = $("#frequency").val().trim();

        var newTrain = {
            trainName: trainName,
            destination: destination,
            startTime: startTime,
            frequency: frequency,
        }
        database.ref().push(newTrain);
        console.log(newTrain);
        //clear form
        $("#trainName").val("");
        $("#destination").val("");
        $("#startTime").val("");
        $("#frequency").val("");
    });
    database.ref().on("child_added", function (snapshot) {
        console.log(snapshot.val());

        var trainName = snapshot.val().trainName;
        var destination = snapshot.val().destination;
        var startTime = snapshot.val().startTime;
        var frequency = snapshot.val().frequency;

        console.log(trainName);
        console.log(destination);
        console.log(startTime);
        console.log(frequency);
        //calculate frequency with proper timestamps
        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
        //
        var startTimeConverted = moment(startTime, "HH:mm").subtract(1, "years");
        console.log(startTimeConverted);
        // Difference between now and start time
        var diffTime = moment().diff(moment(startTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % frequency;
        console.log(tRemainder);

        // Minute Until Train
        var minutesAway = frequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + minutesAway);

         // Next Train
        var nextArrival = moment().add(minutesAway, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm"));

        $("#trainInfo").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
            frequency + "</td><td>" + moment(nextArrival).format("hh:mm") + "</td><td>" + minutesAway + "</td><td>");
    },
        function (errorObject) {
            console.log("Errors handled; " + errorObject.code);
        }
    );

});
