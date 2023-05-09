const { App } = require('@slack/bolt');
const axios = require("axios");
const slackConfiguration = require('./slack_configuration.json')

const app = new App({
  token : slackConfiguration.SLACK_BOT_TOKEN,
  signingSecret: slackConfiguration.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken:slackConfiguration.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000
});


app.message('hello', async ({ message, say }) => {
  
  await say(`Hey there <@${message.user}>!`);
});

app.message('weather', async ({ message, say }) => {
  
  const city= message.text.slice(8).toLowerCase()
  let response = await axios.get("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"+city+"?unitGroup=metric&include=days&key=WUW8C64RU3L2K6AXCNSKMCPZK&contentType=json")
  const curr_day=response.data.days[0]
  const curr_temp=curr_day.temp;
  const feels_like=curr_day.feelslike;
  const humidity=curr_day.humidity;
  const precip= curr_day.precip
  // console.log(response.data.days[0].temp)
  await say(`Weather of ${city.charAt(0).toUpperCase() + city.slice(1)}\n
             Current Temp: ${curr_temp}°C\n
             It Feels Like: ${feels_like}°C\n
             Humidity: ${humidity}%\n
             Precipitation: ${precip}`)
});

app.message('how are you', async ({ message, say }) => {
  
  await say(`Thanks for asking ,<@${message.user}>! BTW, I am great!!`);
});

app.message('help', async ({ message, say }) => {
  
  await say(`<@${message.user}>, You can use 'hello', 'how are you' ,'everyone', 'weather <city-name>' to interact with me.`);
});

app.message('everyone', async ({  say }) => {
  await say(`<!channel> !`);
});



(async () => {
  // Start your app
  await app.start();

  console.log('Weather-inator is ON!');
})();