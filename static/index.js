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
        return resp["output"];
      case "failed":
        console.log('Error');
        document.getElementById("error").innerHTML = "No articles found :( try another query!";
      case "canceled":
        throw new Error("Prediction " + status);
      case "starting":
        await new Promise(r => setTimeout(r, 10000));
        break;
      default:
        await new Promise(r => setTimeout(r, 100));
    }
  }
}


function show_image(img, headline, src, url) {
  document.getElementById("loading").classList.remove("shown");

  
  document.getElementById("img").src=img;
  hl = document.getElementById("headline")
  hl.innerHTML=headline + " " + src;
  document.getElementById("url").href = url;
  document.getElementById("url").innerHTML = "View original article"
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
