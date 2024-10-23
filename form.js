const diets = {
    // Same diet object as before
  };
  
  // Populate the state dropdown on page load
  document.addEventListener("DOMContentLoaded", () => {
    const stateSelect = document.getElementById("state");
    for (let state in diets) {
      let option = document.createElement("option");
      option.value = state;
      option.text = state.charAt(0).toUpperCase() + state.slice(1);
      stateSelect.appendChild(option);
    }
  });
  
  // Calculate BMI, BMR, TDEE and display results
  document.getElementById("userForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form from refreshing
  
    const age = parseInt(document.getElementById("age").value);
    const gender = document.getElementById("gender").value;
    const weight = parseFloat(document.getElementById("weight").value);
    const height = parseFloat(document.getElementById("height").value);
    const activityLevel = parseFloat(document.getElementById("activity").value);
    const goal = document.getElementById("goal").value;
    const state = document.getElementById("state").value;
    const dietType = document.getElementById("diet").value;
  
    const resultDiv = document.getElementById("result");
  
    // BMI Calculation
    const bmi = (weight / (height / 100) ** 2).toFixed(2);
  
    // BMR Calculation using Mifflin-St Jeor Equation
    let bmr;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
  
    // TDEE Calculation
    const tdee = (bmr * activityLevel).toFixed(2);
  
    // Show diet recommendations
    let dietRecommendation = "No recommendation available";
    if (state && dietType && diets[state]) {
      const selectedDiet = diets[state][dietType];
      dietRecommendation = `<h3>Diet Plan:</h3><ul>${selectedDiet
        .map((item) => <li>${item}</li>)
        .join("")}</ul>`;
    }
  
    // Display results
    resultDiv.innerHTML = `
          <h2>Results</h2>
          <p><strong>BMI:</strong> ${bmi}</p>
          <p><strong>BMR:</strong> ${bmr.toFixed(2)} calories/day</p>
          <p><strong>TDEE:</strong> ${tdee} calories/day</p>
          <h3>Goal: ${goal.charAt(0).toUpperCase() + goal.slice(1)}</h3>
          ${dietRecommendation}
      `;
    // Show the download button
    document.getElementById("downloadBtn").style.display = "block";
  
    // Add download functionality
    document.getElementById("downloadBtn").onclick = function () {
      const resultsText = `
        Results:
        BMI: ${bmi}
        BMR: ${bmr.toFixed(2)} calories/day
        TDEE: ${tdee} calories/day
        Goal: ${goal.charAt(0).toUpperCase() + goal.slice(1)}
        Diet Plan: ${dietRecommendation.replace(/<[^>]*>/g, "")}
      `;
  
      const blob = new Blob([resultsText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "diet_and_calorie_results.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url); // Clean up
    };
  });