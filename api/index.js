const express = require('express')
const path = require('path')
const moment = require('moment')
const { HOST } = require('../src/constants')
const db = require('../src/database')

const PORT = process.env.PORT || 5000

const app = express()
  .set('port', PORT)
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

// Static public files
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  res.send('Get ready for OpenSea!');
})

app.get('/api/token/:token_id', function (req, res) {
  const tokenId = parseInt(req.params.token_id).toString()
  const person = db[tokenId]
  const bdayParts = person.birthday.split(' ')
  const day = parseInt(bdayParts[1])
  const month = parseInt(bdayParts[0])
  const data = {
    'name': person.name,
    'image': `${HOST}/images/${tokenId}.png`,
    'attributes': [
      {
        'trait_type': 'birthday',
        'value': person.birthday
      },
      {
        'trait_type': 'birth month',
        'value': monthName(month)
      },
      {
        'trait_type': 'zodiac sign',
        'value': zodiac(day, month)
      },
      // 'age': moment().diff(person.birthday, 'years')
    ]
  }
  res.send(data)
})

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
})

// returns the zodiac sign according to day and month ( https://coursesweb.net/javascript/zodiac-signs_cs )
function zodiac(day, month) {
  var zodiac = ['', 'Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn'];
  var last_day = ['', 19, 18, 20, 20, 21, 21, 22, 22, 21, 22, 21, 20, 19];
  return (day > last_day[month]) ? zodiac[month * 1 + 1] : zodiac[month];
}

function monthName(month) {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ]
  return monthNames[month - 1]
}