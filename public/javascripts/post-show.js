mapboxgl.accessToken = 'pk.eyJ1Ijoic2hhc29uZ3VydW5nIiwiYSI6ImNqd204cXNxdTFiNTU0Y242ZWF5ZjVvdWgifQ.14dByG9Yz2qO3tQcV7iUbw';
// instanstiating new map 
var map = new mapboxgl.Map({
    // matches with div id 'map'
    container: 'map',
    // style
    style: 'mapbox://styles/mapbox/light-v9',
    center: post.coordinates,
    zoom: 7
});

// create a HTML element for each feature for our post location/marker
var el = document.createElement('div');
el.className = 'marker';

// make a marker for each feature and add to the map
new mapboxgl.Marker(el)
.setLngLat(post.coordinates)
.setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
.setHTML('<h3>' + post.title + '</h3><p>' + post.location + '</p>'))
.addTo(map);
    
// toggled edit review form
$('.toggle-edit-form').on('click',function() {
    //toggle the edit btn txt on click
    // this represent thed edit button (what was clicked)
    // if (this.text ==== 'Edit') then change text to 'Cancel' or keep it as Edit
    $(this).text()==='Edit' ? $(this).text('Cancel') : $(this).text('Edit');
    // toggle visibility of the edit reviw form
    // select the form closest to the edit button clicked 
    // only the localised form
    $(this).siblings('.edit-review-form').toggle();

});

//  Add click listener for clering of rating from edit/new form
$('.clear-rating').click(function(){
    $(this).siblings('.input-no-rate').click();
});

