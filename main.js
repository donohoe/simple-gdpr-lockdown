(function(document, window) {
/*
	GDPR Lockdown

	This is a simple GDPR implementation to lockdown any page
	to its core services so it remains accessible to EU users.

	It could be extended to work with a consent solution, 
	but in this form, does not include it

	It relies on location information passed client-side via cookie
	that tells it whether GDPR applies or not.
*/
	console.log( "Simple GDPR" );
	window.GDPR = {

		POLICIES: {

		/*	Content-Security-Policies for assets essential to core basic site */

			"basic": {
				"directives" : {
					"default-src": "'self' www.latimes.com",
					"img-src":     "'self' www.trbimg.com www.latimes.com",
					"script-src":  "'self' 'unsafe-inline' www.latimes.com",
					"style-src":   "'self' 'unsafe-inline' *.latimes.com",
					"object-src":  "'none'",
					"font-src":    "'self' www.latimes.com",
					"frame-src":   "'self' www.latimes.com",
					"media-src":   "'self' www.latimes.com",
					"connect-src": "'self'"
				}
			},

		/*	Whitelisted Services: */

			"ensighten": {
				"label": "Ensighten",
				"directives" : {
					"script-src":  "*.ensighten.com",
					"img-src":     "*.ensighten.com",
				},
				"whitelisted":  true
			},

			"google-fonts": {
				"label": "Google Fonts",
				"summary": "",
				"directives" : {
					"font-src": "fonts.googleapis.com fonts.gstatic.com"
				},
				"whitelisted":  true
			}
		},

		init: function() {

			var isOkBrowser = this.isOkBrowser();
			if (!isOkBrowser) {
				console.log('Simple GDPR: Browser not supported', isOkBrowser);
				window.location.replace('broswer.html');
				return;
			}

			var is_eu = this.checkLocation();
			if (is_eu) {
				console.log('Simple GDPR: Visitor is EU. Lock it down.');
				this.addCSPPolicies();
			} else {
				console.log('Simple GDPR EOL', is_eu);
			}
		},

		addCSPPolicies: function(services) {

			var starterCSP = this.POLICIES.basic;
			var contentSecurityPolicy = {
				'default-src': GDPR.POLICIES[ 'basic' ].directives[ 'default-src' ] || '',
				'img-src':     GDPR.POLICIES[ 'basic' ].directives[ 'img-src' ]     || '',
				'script-src':  GDPR.POLICIES[ 'basic' ].directives[ 'script-src' ]  || '',
				'style-src':   GDPR.POLICIES[ 'basic' ].directives[ 'style-src' ]   || '',
				'object-src':  GDPR.POLICIES[ 'basic' ].directives[ 'object-src' ]  || '',
				'font-src':    GDPR.POLICIES[ 'basic' ].directives[ 'font-src' ]    || '',
				'frame-src':   GDPR.POLICIES[ 'basic' ].directives[ 'frame-src' ]   || '',
				'media-src':   GDPR.POLICIES[ 'basic' ].directives[ 'media-src' ]   || '',
				'connect-src': GDPR.POLICIES[ 'basic' ].directives[ 'connect-src' ] || '',
			};

		/*
			Add whitelisted services to the basic CSP.
		*/
			for (var key in this.POLICIES) {
				if (this.POLICIES.hasOwnProperty( key )) {
					if ( this.POLICIES[key].whitelisted ) {
						var directives = this.POLICIES[key].directives;
						contentSecurityPolicy = this.appendDirectives( contentSecurityPolicy, directives );
					}
				}
			}

			var metaContent = [];
			for (var key in contentSecurityPolicy) {
				if (contentSecurityPolicy.hasOwnProperty( key )) {
					metaContent.push( key + ' ' + contentSecurityPolicy[ key ] + '; ');
				}
			}

			document.write( '<meta http-equiv="Content-Security-Policy" content="' + metaContent.join( '' ) + '">' );

			if (typeof console.table === 'function') {
				console.table(contentSecurityPolicy);
			} else {
				console.log(contentSecurityPolicy);
			}
		},

		appendDirectives: function(csps, directives) {
			for (var key in directives) {
				if (directives.hasOwnProperty( key )) {
					if (typeof csps[ key ] !== 'undefined') {
						csps[ key ] += ' ' + directives[ key ];
					}
				}
			}
			return csps;
		},

/*
		Cookie: location
		This assumes that you have, at a CDN level, set a simple cookie that inidates
		if the visitor is in the EU or not. In this case, its a simple "1" or "0" but
		you should adopt to your solution.
*/
		checkLocation: function() {
			var is_eu = false;
			var data = this.getCookie( 'location' );
			if (data === "1") {
				is_eu = true;
			}

		/*	Debug Mode */
			if (this.getURLParam('is_eu') === '1') {
				is_eu = true;
				console.warn('Simple GDPR: Debug mode is turned on:', is_eu );
			}

			return is_eu;
		},

/*
		Return false if any version of Internet Expolorer or Opera Mini.
		As per lack of support for Content-Security-Policy META tags
*/
		isOkBrowser: function() {
			var ua = navigator.userAgent;
			return ( /MSIE/i.test( ua ) || /Opera Mini/i.test( ua ) ) ? false : true;
		},

		getURLParam: function( p ) {
			var s = new RegExp( '[?&]' + p + '=([^&#]*)', 'i' ).exec( window.location.href );
			return s ? s[1] : null;
		},

		getCookie: function(cname) {
			var n = cname + "=";
			var ca = document.cookie.split(';');
			for(var i=0; i<ca.length; i++) {
				var c = ca[i].trim();
				if (c.indexOf(n)==0) return c.substring( n.length, c.length );
			}
			return "";
		}
	};
	window.GDPR.init();
})(document, window);
