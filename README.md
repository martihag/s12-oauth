s12-oauth
=========

Implementation of OAuth.

###Hei Ole!
Kode og workflow for OAuth finnes i https://github.com/martihag/s12-oauth/blob/master/server/api/auth/auth.controller.js

Appen er deployet på http://mysterious-lowlands-2620.herokuapp.com/ slik at det er mulig å teste. Kun Twitter auth er implementert. Ingen data lagres på serveren, men for sikkerhets skyld ville jeg kanskje brukt en throwaway-account. All kommunikasjon mellom serveren -> Twitter er https, men ikke klient og server.

Thanks to: 
https://github.com/DaftMonk/generator-angular-fullstack  
https://github.com/sahat/satellizer
