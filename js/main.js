// 1. Initialize Firebase
var config = {
  apiKey: "AIzaSyCZ3qrcJ8eDZtxl0qF65dv6-jyrYEThG5A",
  authDomain: "reservation-site-4d140.firebaseapp.com",
  databaseURL: "https://reservation-site-4d140.firebaseio.com",
  projectId: "reservation-site-4d140",
  storageBucket: "reservation-site-4d140.appspot.com",
  messagingSenderId: "318845049725"
};
firebase.initializeApp(config);

var database = firebase.database();

var reservationData = {};

$('.dropdown-toggle').on('click', function() {
  $(this).next('.dropdown-menu').toggleClass('active');
});

$('.dropdown-menu li a').on('click', function(e) {
  e.preventDefault();

  var value = $(this).text();
  var parent = $(this).parent('li').parent('ul');
  var text = value + '<i class="fa fa-caret-down"></i>';

  if(parent.hasClass('reservation-day')) {
      reservationData.day = value;
  } else if(parent.hasClass('reservation-time')) {
      reservationData.time = value;
  } else if(parent.hasClass('reservation-party')) {
      reservationData.party = value;
  }
  $(this).parent('li').parent('ul').prev('.dropdown-toggle').html(text);

  $(this).parent('li').parent('ul').removeClass('active');
});

$('#reservationForm').on('submit', function(e) {
  e.preventDefault();

  var name = $('.reservation-name').val();
  reservationData.name = name;

  var reservationsReference = database.ref('reservations');

  reservationsReference.push(reservationData);

  $(this).hide();
  $('.reservation-complete h3').text('Thank you for booking a reservation ' + reservationData.name + '!');
  $('.reservation-complete p').text('We look forward to your visit on ' + reservationData.day + ' at ' + reservationData.time + ' for a party of ' + reservationData.party + '.');
  $('.reservation-complete').show();
});

$('.show-modal').on('click', function(e) {
  e.preventDefault();
  var href = $(this).attr('href');

  $(href).removeClass('hidden');
  $('.modal-bg').removeClass('hidden');
});

$('.close-modal').on('click', function() {
  $('.modal, .modal-bg').addClass('hidden');
});

$('.reservations-list').on('click', '.remove-reservation', function(e) {
  var id = $(e.target).parent().parent().attr('id');

  var reservationReference = database.ref('reservations/' + id);

  reservationReference.remove();
});

function getReservations() {
  database.ref('reservations').on('value', function(results) {
    var allReservations = results.val();
    if(allReservations) {
      $('#myReservations').show();
      var reservations = [];

      for(var item in allReservations) {
        var context = {
          id: item,
          name: allReservations[item].name,
          day: allReservations[item].day,
          time: allReservations[item].time,
          party: allReservations[item].party
        };

        var source = $('#reservationsTemplate').html();
        var template = Handlebars.compile(source);
        var reservationListElement = template(context);

        reservations.push(reservationListElement);
      }

      $('.reservations-list').empty();

      for(var i in reservations) {
        $('.reservations-list').append(reservations[i]);
      }
    } else {
      $('#myReservations').hide();
    }
  });
}

getReservations();

initMap();

function initMap() {
  var location = {
    lat: 37.766593,
    lng: -122.403786
  };

  var map = new google.maps.Map(document.getElementById('map'), {
    center: location,
    zoom: 16,
    scrollwheel: false
  });

  var marker = new google.maps.Marker({
    position: location,
    map: map,
    title: 'Live Sushi - San Francisco'
  });
};
