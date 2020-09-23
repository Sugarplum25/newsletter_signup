const express = require('express');
const path = require('path');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const pathToFile = path.join(__dirname, '/signup.html');
  res.sendFile(pathToFile);
});

app.post('/', (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const { email } = req.body;
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);
  const url = 'https://us2.api.mailchimp.com/3.0/lists/e260e6c49f';
  const options = {
    method: 'POST',
    auth: 'mariya:31ffbd32750cbb3a711087d9a0acb7e2-us2',
  };
  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(path.join(__dirname, '/success.html'));
    } else {
      res.sendFile(path.join(__dirname, '/failure.html'));
    }
    response.on('data', (data) => { console.log(data); });
  });
  request.write(jsonData);
  request.end();
});
app.post('/failure', (req, res) => {
  res.redirect('/');
});

app.listen(process.env.PORT || 3000);
