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
          }
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


});
