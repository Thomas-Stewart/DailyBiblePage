$(function(){ //DOM Ready

    var grid = $(".gridster ul").gridster({
        widget_margins: [10, 10],
        widget_base_dimensions: [350, 400],
        draggable: {
          start: function(){
            console.log('starting to drag');
            document.getElementById("cover").style.pointerEvents = "none";
          },
          stop: function(){
            console.log('stopping drag');
            document.getElementById("cover").style.pointerEvents = "all";
            gridData = grid.serialize();
            console.log('SAVING GRID',gridData);
            chrome.storage.local.set({'layout': gridData});          }
        }
    });


    //grid.resize_widget($("#verseofday"),2,1);
    function pad(number) {
      var result = String(number);
      if ( result.length === 1 ) {
        result = '0' + result;
      }
      return result;
    }

    var today = new Date();
    var todayDate = today.getFullYear() + '-' + pad( today.getMonth() + 1 ) + '-' + pad( today.getDate() );

    document.getElementById('verseofday').src = 'https://biblia.com/verseoftheday/image/' + todayDate + '?width=700';

    chrome.storage.local.get('layout', function (result) {
        alert(result['layout']);
        console.log(result);
    });


});
