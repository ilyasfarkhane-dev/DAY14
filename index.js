const fs = require("fs").promises;

const filePath = "./input.txt";

async function readFle() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch (error) {
    console.log(error);
  }
}

async function deleteExistingFile(cityName) {
  try {
    const fileName = `${cityName}.txt`;
    await fs.unlink(fileName);
    console.log(`Deleted existing file for ${cityName}`);
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw new Error("Error deleting existing file: " + err.message);
    }
  }
}

async function selectRandomCity() {
  try {
    const jsonData = await readFle();
    const randomIndex = Math.floor(Math.random() * jsonData.length);
    return jsonData[randomIndex];
  } catch (err) {
    console.log(err);
  }
}

selectRandomCity();

async function getWeather() {
  try {
    const jsonData = await selectRandomCity();
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${jsonData.lat}&longitude=${jsonData.lng}&current_weather=true`
    );
    const data = await response.json();
    const temp = `${jsonData.name} : ${data.current_weather.temperature}${data.current_weather_units.temperature}`;
   
    await deleteExistingFile(jsonData.name);
    const fileName = `${jsonData.name}.txt`;
    await fs.writeFile(fileName, temp, "utf8");
    console.log(`Temperature result has been written to ${fileName}`);
  } catch (error) {
    console.log(error);
  }
}
getWeather();
