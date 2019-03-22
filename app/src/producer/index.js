$('#register-btn').click(function () {
  currentAccount = $('#producer-id').val();
  latitude = $('#vineyard-latitude').val();
  longitude = $('#vineyard-longitude').val();
  name = $('#vineyard-name').val();
  address = $('#vineyard-address').val();

  $.post('/registerFarm', {producerId: currentAccount, vineyardName: name, vineyardLatitude: latitude, vineyardLongitude: longitude, vineyardAddress: address, function (response) {
    $('#details-producer-id').text(currentAccount);
    $('#details-vineyard-id').text(response[0]);
    $('#details-vineyard-name').text(response[1]);
    $('#details-vineyard-latitude').text(response[2]);
    $('#details-vineyard-longitude').text(response[3]);
    $('#details-vineyard-address').text(response[4]);
  } 
})

})