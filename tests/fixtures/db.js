const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
  _id: userOneId,
  name: 'Joseph',
  email: 'joseph@example.com',
  password: 'nevermind',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }
  ]
}
const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
  _id: userTwoId,
  name: 'Barnabas',
  email: 'barnabas@example.com',
  password: 'nevermind',
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }
  ]
}
const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: 'First task',
  completed: false,
  owner: userOneId
}
const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Second task',
  completed: true,
  owner: userOneId
}
const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Third task',
  completed: true,
  owner: userTwoId
}
const taskFour = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Fourth task',
  completed: false,
  owner: userTwoId
}
const taskFive = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Fifth task',
  completed: false,
  owner: userTwoId
}
const taskSix = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Sixth task',
  completed: true,
  owner: userTwoId
}
const setupDatabase = async () => {
  await User.deleteMany()
  await Task.deleteMany()
  await new User(userOne).save()
  await new User(userTwo).save()
  await new Task(taskOne).save()
  await new Task(taskTwo).save()
  await new Task(taskThree).save()
  await new Task(taskFour).save()
  await new Task(taskFive).save()
  await new Task(taskSix).save()
}

module.exports = {
  userOneId,
  userOne,
  userTwo,
  userTwoId,
  taskOne,
  taskTwo,
  taskThree,
  taskFour,
  taskFive,
  taskSix,
  setupDatabase
}
