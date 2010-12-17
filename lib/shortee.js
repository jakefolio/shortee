exports.Shortee = {
  db: null,
  numberToShortURL: function($n) {
      var $s = "";
      var $m = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ_abcdefghijkmnopqrstuvwxyz";
      if ($n===undefined || $n===0) { return 0; }
      while ($n>0) {
          var $d = $n % 60;
          $s = $m[$d]+$s;
          $n = ($n-$d)/60;
      }
      return $s;
  },

  numberToShortURLf: function($n, $f) {
      var $s = this.numberToShortURL($n);
      if ($f===undefined) {
          $f=1;
      }
      $f -= $s.length;
      while ($f > 0) {
          $s = "0"+$s;
          --$f;
      }
      return $s;
  },

  shortURLToNumber: function($s) {
      var $n = 0;
      var $j = $s.length;
      for (var $i=0; $i<$j; $i++) { // iterate from first to last char of $s
          var c = $s[$i].charCodeAt(0); //  put current ASCII of char into c
          if (c>=48 && c<=57) { c=c-48; }
          else if (c>=65 && c<=72) { c-=55; }
          else if (c==73 || c==108) { c=1; } // typo capital I,
          // lowercase l to 1
          else if (c>=74 && c<=78) { c-=56; }
          else if (c==79) { c=0; } // error correct typo capital O to 0
          else if (c>=80 && c<=90) { c-=57; }
          else if (c==95) { c=34; } // underscore
          else if (c>=97 && c<=107) { c-=62; }
          else if (c>=109 && c<=122) { c-=63; }
          else { c = 0; } // treat all other noise as 0
          $n = 60*$n + c;
      }
      return $n;
  },

  insertURL: function(url, short_url) {
    this.db.query(
      'INSERT INTO urls ' +
      'SET original = ?, short = ?',
      [url, short_url]
    );

    this.db.end();
  },

  insertStat: function(data) {
    this.db.query(
      'INSERT INTO stats ' +
      'SET url_id = ?, accessed_on = NOW(), user_agent = ?',
      [data.id, data.user_agent]
    );

    this.db.end();
  },

  getLongURL: function(long_url) {
    var result = this.db.query("SELECT * FROM urls WHERE original = '"+long_url+"'");
    var rows = [];
    result.addListener('row', function(r) {
      rows.push(r);
    });

    result.addListener('end', function() {
      //console.log(rows);
      return rows[0];
    });
  },

  doesURLExist: function(long_url) {
    var rows = this.getLongURL(long_url);
    return rows.length > 0 ? true : false;
  }
};