# Simple GDPR Lockdown
You don't need to block EU visitors over GDPR. Just lockdown your site.

This is a simple GDPR implementation to lockdown your site, so that while core services that you control can be used, you can quickly elimeinate ebverything else. No stripping vendors from template, no hunting down embedded items in your CMS.

This can be extended to work with a consent solution but that is not covered here.

It relies on location information passed client-side via cookie that tells it whether GDPR applies or not.

Too good to be true? Yes, you're right. There is a catch.

## The Catch a.k.a. The Pre-Requisite ##
This code works by expecting a cookie that indicates whether the visitor is in the EU or not. There are a few ways this can be done, for many you can do this easily enough at the CDN level with Fastly or Akamai. You could also do a server side call before rendering the page but that gets tricky. That part is up to you to figure out.

## Quick Start ##

```shell
cd ~/simple-gdpr-lockdown
php -S localhost:4510
```
Open browser and go to:

http://localhost:4510/index.html

## Custimziation ##

The Content-Security-Policies are well documented here:

* https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy

These should be updated as per your site. Ina ddition, you may want to re-work teh cookie logic to read whatever format you use to repesent your geolocation info.
