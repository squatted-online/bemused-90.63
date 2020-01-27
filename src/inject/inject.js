// VARIABLES

var links =  [
	"http://www.resort.com/~banshee/Misc/8ball/",
	"https://www.scaruffi.com/",
	"http://travelassist.com/mag/mag_home.html",
	"http://www.taco.com/",
	"http://edition.cnn.com/US/OJ/",
	"https://spork.org/",
	"http://www.milamba.com/australia/",
	"http://www.geocities.ws/dreddnott/default.html"
];

var texts =  [
	"0 - ma che figata",
	"1 - sto progetto spacca",
	"2 - boh non lo so",
	"3 - very very fun",
	"4 - yeah"
];



// FUNCTIONS

function getLocation(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};



// INSTRUCTIONS

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
		
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// Creating list of links hostnames for IF condition
		var linksHostnames = [];
		for (var i = 0; i < links.length; i++){
			linksHostnames.push(getLocation(links[i]).hostname);
		}

		// Selecting all links and changing them to random link from list
		var allLinks = document.querySelectorAll("a"); //
		for (var i = 0; i < allLinks.length; i++){
			var randomIndex = Math.floor( Math.random() * (links.length));
			allLinks[i].setAttribute('href', links[randomIndex]);
			allLinks[i].setAttribute('target', '_self');
		}

		// Getting current website
		var currentLocation = window.location;

		// If we're in a webpage from the list, add div
		if (linksHostnames.includes(currentLocation.hostname)){

			// Inverts color according to injected css
			document.querySelector("html").classList.add("inversed");

			// Getting index
			idx_promise = new Promise(function(resolve, reject) {
				chrome.storage.local.get('idx', function(result) {
					resolve(result);
				});
			});

			// Once you get the index, draw the div
			idx_promise.then(function(idx_promise) {

				console.log(idx_promise.idx);

				// Creating div
				var div_wdt = 100;
				var div_hgt = 100;

				var div_x = Math.round((window.innerWidth  - div_wdt) * Math.random());
				var div_y = Math.round((window.innerHeight - div_hgt) * Math.random());

				var div = document.createElement("div");
				div.classList.add("rectangle")
				div.style.left = div_x + "px";
				div.style.top  = div_y + "px";
				div.style.width  = div_wdt + "px";
				div.style.height = div_hgt + "px";
				div.innerHTML = texts[idx_promise.idx];
				document.querySelector("body").appendChild(div);
			});

			// Updating index
			chrome.storage.local.get("idx", function(result) {
				var new_idx = (result.idx+1) % texts.length;
				chrome.storage.local.set({"idx": new_idx}, function(){
					// null
				})
			});
		}
	}
	}, 10);
});