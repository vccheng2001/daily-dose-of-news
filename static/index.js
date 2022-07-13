var category, categoryValue, country, countryValue, started, draw;
var headline, src, url;


function doBoth() {
  changeCategory();
  changeCountry();
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
  console.log('resp');
  console.log(resp);
  return resp;
}

async function waitForPrediction(predictionID) {
  while (true) {
    var resp = await fetch(`/api/predictions/${predictionID}`);
    var resp = await resp.json();
    const status = resp["status"]
    switch (status) {
      case "succeeded":
        return resp["output"];
      case "failed":
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
  
  document.getElementById("img").src=img;
  hl = document.getElementById("headline")
  hl.innerHTML=headline + " " + src;
  hl.href = url;

  // hl.width="400px";
  // hl.height="400px";

  // var img = document.createElement("img");
  // img.src = src;
  // img.width = width;
  // img.height = height;
  // img.alt = alt;

  // // This next line will just add it to the <body> tag
  // document.body.appendChild(img);
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

// function strokeColorToSVGStroke(strokeColor) {
//   return "rgb(" + strokeColor.slice(0, 3).map(c => Math.floor(c * 255)).join(",") + ")";
// }

// function pathToSVGPathString(path) {
//   const points = path.points;
//   var s = "M " + points[0][0] + " " + points[0][1];
//   for (var i = 0; i < path.num_control_points.length; i++) {
//     s += " C"
//       + " " + points[i * 3 + 1][0]
//       + " " + points[i * 3 + 1][1]
//       + " " + points[i * 3 + 2][0]
//       + " " + points[i * 3 + 2][1]
//       + " " + points[i * 3 + 3][0]
//       + " " + points[i * 3 + 3][1];
//   }
//   return s;
// }
