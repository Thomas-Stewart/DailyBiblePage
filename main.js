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

    // $(".gridster ul").data('gridster').resize_widget($("#verseofday"),i,1);




});
