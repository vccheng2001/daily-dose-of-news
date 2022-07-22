var category, categoryValue, country, countryValue, started, draw;
var headline, src, url, description;


function doBoth() {
  changeCategory();
  changeCountry();
  document.getElementById("loading").classList.add("shown");

}


window.onload = async function() {
  draw = SVG().addTo('body').attr({
    viewBox: "-50 0 100 100",
    width: "100%",
    height: "100%",
  });

  var countries = ['all', 'us (United States)',  'ar (Argentina)',
  'at (Austria)','au (Australia)','be (Belgium)','bg (Brazil)',
  'br (Bulgaria)', 'ca (Canada)', 'cn (China)',
  'co (Colombia)', 'cu (Cuba)', 'cz (Czech Republic)','de (Germany)',
  'eg (Egypt)', 'fr (France)','gb (United Kingdom)','gr (Greece)', 
  'hk (Hong Kong)','hu (Hungary)', 'id (Indonesia)','ie (Ireland)',
  'il (Israel)','in (India)','it (Italy)','jp (Japan)',
  'kr (Korea)','lt (Lithuania)','lv (Latvia)', 'ma (Morocco)',
  'mx (Mexico)','my (Malaysia)','ng (Nigeria)',
  'nl (Netherlands)', 'no (Norway)','nz (New Zealand)', 'ph (Philippines)', 'pl (Poland)',
  'pt (Portugal)', 'ro (Romania)', 'rs (Serbia)', 'ru (Russia)', 
  'sa (Saudi Arabia)', 'se (Sweden)', 'sg (Singapore)', 'si (Slovenia)',
  'sk (Slovakia)', 'th (Thailand)','tr (Turkey)', 'tw (Taiwan)', 'ua (UAE)', 
  've (Venezuela)', 'za (South Africa)' ];
  
  var options = "";
  // options += "<option selected="selected">all</option>"
  for(var i = 0; i < countries.length; i++){
    options += "<option>"+ countries[i] +"</option>";
  }
  document.getElementById("country").innerHTML = options;
  document.getElementById("newsbox").style.visibility="hidden";


    
  category = document.querySelector("#category");
  country = document.querySelector("#country");

  category.onblur = doBoth;
  country.onblur = doBoth;
  category.onkeypress = (e) => {
    if (e.code == "Enter") {
      category.blur();
    }
  };
  country.onkeypress = (e) => {
    if (e.code == "Enter") {
      country.blur();
    }
  };
}

async function step(output) {
  try {
    resp = await startPrediction(output);
    const predictionID = resp['prediction_id'];
    headline = resp['headline'];
    src = resp['src'];
    url = resp['url'];
    description=resp['description']
    output = await waitForPrediction(predictionID);
  } catch (error) {
    started = false;
    console.log("Caught error:", error);
    return;
  }
  
  step(output);
  show_image(output, headline, src, url);
  
}

async function startPrediction(paths) {
  console.log('calling startPrediction')
  var resp = await fetch("/api/predict", {
    method: "POST",
    body: JSON.stringify({
      category: categoryValue,
      country: countryValue,
    }),
    headers: {
      "Content-type": "application/json"
    }
  })
  if (!resp.ok) {
    throw new Error(resp.statusText);
  }
  resp = await resp.json();
  return resp;
}

async function waitForPrediction(predictionID) {
  while (true) {
    var resp = await fetch(`/api/predictions/${predictionID}`);
    var resp = await resp.json();
    const status = resp["status"]
    switch (status) {
      case "succeeded":
        document.getElementById("error").innerHTML = "";
        document.getElementById("error").style.visibility="hidden";
        document.getElementById("bodybox").style.visibility="visible"; // show news
        document.getElementById("newsbox").style.visibility="visible";

        return resp["output"];
      case "failed":
        console.log('Error');
        document.getElementById("error").innerHTML = "No articles found at the moment :( try another query!";
        document.getElementById("error").style.visibility="visible";
        document.getElementById("bodybox").style.visibility="hidden"; // hide news
        document.getElementById("newsbox").style.visibility="hidden"; // hide news

        case "canceled":
        throw new Error("Prediction " + status);
      case "starting":
        await new Promise(r => setTimeout(r, 1000));
        break;
      default:
        await new Promise(r => setTimeout(r, 100));
    }
  }
}


function show_image(img, headline, src, url) {
  // loading icon
  document.getElementById("loading").classList.remove("shown");
  // image
  document.getElementById("img").src=img;
  // headline
  hl = document.getElementById("headline")
  if (src != "") {
    hl.innerHTML = headline + " - " + src;
  } else {
    hl.innerHTML=headline;
  }
  // set button URL
  console.log(url);
  document.getElementById("url").innerHTML = "View original article";
  document.getElementById("url").href = url; 
  // description
  document.getElementById("description").innerHTML = description;


}

async function changeCategory() {
  categoryValue = category.value;
  countryValue = country.value;
  if (!started && categoryValue && countryValue) {
    started = true;
    step();
    document.getElementById("loading").classList.add("shown");
  }
}

async function changeCountry() {
  countryValue = country.value;
  categoryValue = category.value;
  if (!started && countryValue && categoryValue) {
    started = true;
    step();
    document.getElementById("loading").classList.add("shown");
  }
}
