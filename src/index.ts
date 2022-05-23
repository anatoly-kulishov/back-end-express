import express from "express";

const app = express();
const port = 3000;

app.get('/', (req: any, res: any) => {
  res.send('Hello World!');
})

app.get('/users', (req: any, res: any) => {
  res.send('Hello Users!');
})

app.post('/users', (req: any, res: any) => {
  res.send('We have created a new user');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})