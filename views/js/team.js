;(function(window) {
  var w = {
    run: function() {
      $('.list-group').click(function(e) {
        setTimeout( function() {
          w.changeView();
        }, 100);
      });
    },
    changeView: function() {
      var ids = [];
      // Do stuff at runtime here
      $("#viewer").children().each(function(n, i) {
        if (this.id.length) ids.push(this.id);
      });
      var view = window.location.hash.substring(1);
      if (!view) view = 'overview';
      $(ids).each(function(n, i) {
        if (view !== i) $('#'+i).hide();
        $('a[href="#'+i+'"').removeClass('active');
      });
      $('a[href="#'+view+'"').addClass('active');
      $('#'+view).show();
    }
  };
w.run(); // start the widget
}(this.window || this));