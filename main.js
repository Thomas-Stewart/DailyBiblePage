$(function(){ //DOM Ready

  chrome.storage.local.get('layout', function (result) {
      console.log(result);
      layout = result['layout'];
      console.log('layout',layout);
      if (layout) {
        var json = jQuery.parseJSON(layout);
        console.log('json',json);
        for (i = 0; i < json.length; i++) {
            var item = json[i];
            $('#' + item.id).attr('data-row', item.row).attr('data-col', item.col);
        }
      }


    var grid = $(".gridster ul").gridster({
        widget_margins: [10, 10],
        widget_base_dimensions: [350, 400],
        serialize_params: function($w, wgd) {
            return {
                   id: $($w).attr('id'),
                   col: wgd.col,
                   row: wgd.row,
                   size_x: wgd.size_x,
                   size_y: wgd.size_y
            };
        },
        draggable: {
          start: function(){
            console.log('starting to drag');
            document.getElementById("cover").style.pointerEvents = "none";
          },
          stop: function(){
            console.log('stopping drag');
            document.getElementById("cover").style.pointerEvents = "all";
            var gridster = $(".gridster ul").gridster().data('gridster');
            gridData = gridster.serialize();
            console.log('SAVING GRID',gridData);
            chrome.storage.local.set({'layout': JSON.stringify(gridData)});          }
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

});
