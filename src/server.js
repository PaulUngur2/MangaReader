const ConvertAPI = require('convertapi-js');
const convertapi = new ConvertAPI('0iZd3gNyLIZJZWEA');

app.post('/convert', (req, res) => {
    const { files } = req.body;

    convertapi.convert('pdf', { Files: files }, 'images')
      .then(result => {
          res.send(result.file.url);
      })
      .catch(error => {
          res.status(500).send(error);
      });
});

  