var prompt, promptValue, started, draw, svgPaths;
var headline;

window.onload = async function() {
  draw = SVG().addTo('body').attr({
    viewBox: "-10 -10 234 234",
    width: "100%",
    height: "100%",
  });

  prompt = document.querySelector("#prompt");
  prompt.onblur = changePrompt;
  prompt.onkeypress = (e) => {
    if (e.code == "Enter") {
      prompt.blur();
    }
  };
}

async function step(output) {
  try {
    resp = await startPrediction(output);
    console.log('resp');
    console.log(resp);
    const predictionID = resp['prediction_id'];
    const headline = resp['headline'];
    console.log('headline');
    console.log(headline);

    output = await waitForPrediction(predictionID);
  } catch (error) {
    started = false;
    svgPaths = null;
    console.log("Caught error:", error);
    return;
  }
  step(output);
  show_image(output, headline, 600,600, '');
}

async function startPrediction(paths) {
  var resp = await fetch("/api/predict", {
    method: "POST",
    body: JSON.stringify({
      prompt: promptValue,
      starting_paths: paths,
    }),
    headers: {
      "Content-type": "application/json"
    }
  })
  if (!resp.ok) {
    throw new Error(resp.statusText);
  }
  resp = await resp.json();
  return resp;//["prediction_id"]]
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


function show_image(img, headline, width, height, alt) {

  document.getElementById("img").src=img;
  console.log(headline);
  document.getElementById("headline").innerHTML=headline;


  // var img = document.createElement("img");
  // img.src = src;
  // img.width = width;
  // img.height = height;
  // img.alt = alt;

  // // This next line will just add it to the <body> tag
  // document.body.appendChild(img);
}

async function changePrompt() {
  promptValue = prompt.value;
  if (!started && promptValue) {
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
