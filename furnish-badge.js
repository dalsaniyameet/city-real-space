/* furnish-badge.js — All pages pe property cards mein furnishing badge */
(function(){
  window._furnishMap = window._furnishMap || {};

  var origFetch = window.fetch;
  window.fetch = function(url, opts){
    var p = origFetch.apply(this, arguments);
    if(typeof url === 'string' && url.indexOf('/api/properties') !== -1){
      p.then(function(res){
        res.clone().json().then(function(data){
          var list = data.properties || data.trending || [];
          list.forEach(function(prop){
            if(prop._id && prop.extraDetails && prop.extraDetails.furnished){
              window._furnishMap[prop._id] = prop.extraDetails.furnished;
            }
          });
          setTimeout(addFurnishBadges, 400);
        }).catch(function(){});
      }).catch(function(){});
    }
    return p;
  };

  function addFurnishBadges(){
    document.querySelectorAll('.prop-card').forEach(function(card){
      if(card.querySelector('.furnish-badge')) return;
      var specs = card.querySelector('.card-specs');
      if(!specs) return;

      // Property ID dhundo
      var onclick = card.getAttribute('onclick') || '';
      var html = card.innerHTML;
      var m = onclick.match(/\/property[^'"]*\/([a-f0-9]{24})/) ||
               onclick.match(/id=([a-f0-9]{24})/) ||
               html.match(/['"\/]([a-f0-9]{24})['"\/]/);
      if(!m) return;

      var val = window._furnishMap[m[1]];
      if(!val) return;

      var v = val.toLowerCase();
      var cls = v.indexOf('semi') !== -1 ? 'semi-furnished' :
                v.indexOf('un')  !== -1 ? 'unfurnished' : 'furnished';
      var labels = {
        'furnished':      'Furnished',
        'semi-furnished': 'Semi Furnished',
        'unfurnished':    'Unfurnished'
      };

      var badge = document.createElement('div');
      badge.className = 'cs furnish-badge ' + cls;
      badge.innerHTML = '<i class="fa-solid fa-couch" style="font-size:0.7rem"></i> ' + labels[cls];
      specs.appendChild(badge);
    });
  }

  new MutationObserver(function(){ addFurnishBadges(); })
    .observe(document.body, { childList: true, subtree: true });
})();
