---
layout: post
title: "Image Analyzer"
date: 2022-04-30 15:07:43 -0500
permalink: /programming/image-analyzer/
---

upload any photo, and I'll tell you the main colors in it

<div>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }

      .container {
        display: flex;
        justify-content: space-between;
        align-items: start;
        width: 80%;
      }

      form {
        max-width: 300px;
        margin: auto;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        background-color: #f9f9f9;
      }

      #result {
        flex: 1;
        max-width: 500px;
        margin: 10px;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        background-color: #f9f9f9;
        overflow: auto;
      }

      label {
        display: block;
        margin-top: 20px;
      }

      input[type="file"],
      input[type="number"] {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }

      button {
        display: block;
        width: 100%;
        padding: 10px;
        margin-top: 20px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      button:hover {
        background-color: #0056b3;
      }
    </style>

  </head>
  <body>
    <div class="container">
      <form id="imageForm">
        <label for="imageFile">Image file:</label>
        <input type="file" id="imageFile" accept="image/*" required />

        <label for="nClusters">Number of clusters:</label>
        <input type="number" id="nClusters" min="1" value="3" required />

        <label for="minRepresentation">Minimum representation:</label>
        <input
          type="number"
          id="minRepresentation"
          min="0"
          max="1"
          step="0.01"
          value="0.1"
          required
        />

        <button type="submit">Analyze Colors</button>
        <label for="format">Select display format:</label><br />
        <input
          type="radio"
          id="defaultFormat"
          name="format"
          value="default"
          checked
        />
        RGB String (e.g. color("#4a5f54"))<br />
        <input
          type="radio"
          id="alternativeFormat"
          name="format"
          value="alternative"
        />
        RGB Values (e.g. [74, 95, 84])
      </form>
      <pre id="result"></pre>
    </div>
    <script>
      document
        .getElementById("imageForm")
        .addEventListener("submit", function (event) {
          event.preventDefault();

          var imageFile = document.getElementById("imageFile").files[0];
          var nClusters = document.getElementById("nClusters").value;
          var minRepresentation =
            document.getElementById("minRepresentation").value;

          // Get the button
          var button = document.querySelector("button");

          let format = document.querySelector(
            'input[name="format"]:checked'
          ).value;

          function formatColor(color, format) {
            if (format === "alternative") {
              const matches = color.match(/[0-9a-f]{2}/gi);
              return matches.map((hex) => parseInt(hex, 16));
            } else {
              return color;
            }
          }

          var reader = new FileReader();
          reader.onloadend = function () {
            var base64data = reader.result;

            button.disabled = true;
            button.textContent = "Loading...";

            fetch(
              "https://witch-game-zn7nb.ondigitalocean.app/accounts/analyze_colors/",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  image: base64data,
                  n_clusters: nClusters,
                  min_representation: minRepresentation,
                }),
              }
            )
              .then((response) => response.json())
              .then((data) => {
                let results = data.results.map((result) => {
                  return {
                    representation: result.representation,
                    rgb: formatColor(result.rgb, format),
                  };
                });

                document.getElementById("result").textContent = JSON.stringify(
                  data,
                  null,
                  2
                ).replace(/\\/g, "");

                button.disabled = false;
                button.textContent = "Analyze Colors";
              });
          };
          reader.readAsDataURL(imageFile);
        });
    </script>

  </body>
</div>

# why did I make this?

I'm dabbling in generative art, and I noticed that when creating color palettes, I would often reference photos. This is just a tool to automatically get a list of colors

# Curious about my most recent drop?

[check out my twitter](https://twitter.com/NgoziArt)
