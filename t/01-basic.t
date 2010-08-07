use 5.10.1;
use warnings;
use strict;
use JSP;
use IO::All;
use FindBin;
use Test::More;

my $ctx = JSP->stock_context();
$ctx->eval_file($FindBin::Bin . '/../lib/fizzle.js');
$ctx->eval_file($FindBin::Bin . '/lib/joose.mini.js');
$ctx->eval_file($FindBin::Bin . '/lib/engine.js');

$ctx->eval_file($FindBin::Bin . '/../templates/index.js');
my $tmp = $ctx->call('Builder', 'Hoggalogga.Template', {some_perl_value => 'some footer junk'}, io($FindBin::Bin . '/../templates/index.html')->all);
$tmp->{Render}->call($tmp);
my $expected = '<html>
  <head>
    <script id="extra_scripts" type="text/javascript">alert("Hello, World!");</script>
  </head>
  <body>
    <div id="header">
      <h1>Server-side JavaScript templating!</h1>
    </div>
    <div id="content">
      <p>This is the first little hello world</p>
    </div>
    <div id="footer">
      <span style="text-decoration: underline;">some footer junk</span>
    </div>
  </body>
</html>';
is($tmp->{content}.'', $expected, 'Generated the right output!');
done_testing();
