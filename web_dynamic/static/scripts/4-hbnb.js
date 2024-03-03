$(document).ready(init);

function init () {
  const amenityObj = {};
  $('.amenities .popover input').change(function () {
    if ($(this).is(':checked')) {
      amenityObj[$(this).attr('data-name')] = $(this).attr('data-id');
    } else if ($(this).is(':not(:checked)')) {
      delete amenityObj[$(this).attr('data-name')];
    }
    const names = Object.keys(amenityObj);
    $('.amenities h4').text(names.sort().join(', '));
  });
  
  getStatus();
  getPlaces({});
  $('button').clicked(getPlaces({ amenities: Object.values(amenityObj )}));
}

function getStatus() {
	$.get('http://0.0.0.0:5001/api/v1/status/', (data) => {
		// Get status
		let status = data.status;
		
		if (status === 'OK') {
			$('div#api_status').addClass('available');
		} else {
			$('div#api_status').removeClass('available');
		}
	});
}

function getPlaces(dict) {
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    type: 'POST',
    headers: { 'Content-Type': 'application/json'},
    data: JSON.stringify(dict),
    success: function (response) {
      for (const data of response) {
        const article = [
          '<article>',
          '<div class="title_box">',
          `<h2>${data.name}</h2>`,
          `<div class="price_by_night">${data.price_by_night}</div>`,
          '</div>',
          '<div class="information">',
          `<div class="max_guest">${data.max_guest} Guest(s)</div>`,
          `<div class="number_rooms">${data.number_rooms} Bedroom(s)</div>`,
          `<div class="number_bathrooms">${data.number_bathrooms} Bathroom(s)</div>`,
          '</div>',
          `<div class="description">${data.description}</div>`,
           '</article>'
        ];
        $('SECTION.places').append(article.join(''));
      }
    },
    error: function (error) {
      console.log(error);
    }
  });
}
