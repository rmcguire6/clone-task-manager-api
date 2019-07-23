const mongoose = require('mongoose')

mongoose
  .connect(
    process.env.MONGODB_URL,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  )
  .then(() => {
    console.log('Database is up and running.')
  })
  .catch(() => {
    console.log('Database error')
  })
