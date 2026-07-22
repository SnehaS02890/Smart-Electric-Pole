// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
    getDatabase,
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

// Your Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCcO0F8QvN9dO8lvaZ6ApzTs7w8wbvMaMk",
    authDomain: "smart-electric-pole.firebaseapp.com",
    databaseURL: "https://smart-electric-pole-default-rtdb.firebaseio.com",
    projectId: "smart-electric-pole",
    storageBucket: "smart-electric-pole.firebasestorage.app",
    messagingSenderId: "359850871615",
    appId: "1:359850871615:web:cbb62e5d4e0e9eb3c4218a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// HTML Elements
const vehicleElement = document.getElementById("vehicleCount");
const gasElement = document.getElementById("gasLevel");
const statusElement = document.getElementById("status");
const timeElement = document.getElementById("time");

// Arrays for Graph
let gasData = [];
let vehicleData = [];
let labels = [];

// Gas Chart
const gasChart = new Chart(document.getElementById("gasChart"), {
    type: "line",
    data: {
        labels: labels,
        datasets: [{
            label: "Gas Level",
            data: gasData,
            borderColor: "red",
            fill: false,
            tension: 0.3
        }]
    }
});

// Vehicle Chart
const vehicleChart = new Chart(document.getElementById("vehicleChart"), {
    type: "bar",
    data: {
        labels: labels,
        datasets: [{
            label: "Vehicle Count",
            data: vehicleData,
            backgroundColor: "blue"
        }]
    }
});

// Read Firebase
const smartPoleRef = ref(database, "SmartPole");

onValue(smartPoleRef, (snapshot) => {

    const data = snapshot.val();

    if (!data) return;

    const keys = Object.keys(data);
    const latestKey = keys[keys.length - 1];

    const latest = data[latestKey];

    vehicleElement.innerHTML = latest.vehicleCount;
    gasElement.innerHTML = latest.gasLevel;
    statusElement.innerHTML = latest.status;

    const now = new Date();

    timeElement.innerHTML = now.toLocaleTimeString();

    labels.push(now.toLocaleTimeString());

    gasData.push(latest.gasLevel);
    vehicleData.push(latest.vehicleCount);

    if (labels.length > 10) {

        labels.shift();
        gasData.shift();
        vehicleData.shift();

    }

    gasChart.update();
    vehicleChart.update();

});