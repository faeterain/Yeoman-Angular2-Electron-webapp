 import { Component } from 'angular2/core';

 @Component({
     selector: "sb-app",
     template: "<h1>My app is running now!</h1> &quot;start&quot;: &quot;gulp clean:build &amp;&amp; gulp frontend &amp;&amp; gulp dev&quot;,    &quot;build&quot;: &quot;gulp clean:build &amp;&amp; gulp frontend &amp;&amp; gulp electron&quot;,&quot;package&quot;: &quot;gulp clean &amp;&amp; gulp frontend &amp;&amp; gulp electron &amp;&amp; gulp package&quot;"
 })

 export class Application {

 }