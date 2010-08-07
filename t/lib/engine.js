function Builder(class, env, content)
{
   return eval("function(e, c) { return new " + class + "( { env: e, content: new XML(c) } ); }")(env,content);
}

