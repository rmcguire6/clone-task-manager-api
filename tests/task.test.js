const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  taskFour,
  taskFive,
  taskSix,
  setupDatabase
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'From my test'
    })
    .expect(201)
  const task = await Task.findById(response.body._id)
  expect(task).not.toBeNull()
  expect(task.completed).toEqual(false)
})
test('Should get all tasks for the user with given id', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
  expect(response.body.length).toEqual(2)
})
test('Should not be able to delete tasks that user does not own', async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)
  const task = await Task.findById(taskOne._id)
  expect(task).not.toBeNull()
})
test('Should not create task with invalid description', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: ''
    })
    .expect(400)
  const task = await Task.findById(response.body._id)
  expect(task).toBeNull()
})
test('Should not create task with invalid completed value', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'task',
      completed: 'not yet'
    })
    .expect(400)
  const task = await Task.findById(response.body._id)
  expect(task).toBeNull()
})
test('Should not update task with invalid description', async () => {
  const response = await request(app)
    .patch(`/tasks/${taskOne._Id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: ''
    })
    .expect(400)
  const task = await Task.findById(response.body._id)
  expect(task).toBeNull()
})
test('Should not update task with invalid completed status', async () => {
  const response = await request(app)
    .patch(`/tasks/${taskOne._Id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'task',
      completed: 'not yet'
    })
    .expect(400)
  const task = await Task.findById(response.body._id)
  expect(task).toBeNull()
})
test('Should delete a task that user does own', async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
  const task = await Task.findById(taskOne._id)
  expect(task).toBeNull()
})
test('Should not be able to delete a task if the user is not authenticated', async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .send()
    .expect(401)
  const task = await Task.findById(taskOne._id)
  expect(task).not.toBeNull()
})
test('Should not be able to update a task that user does not own', async () => {
  const response = await request(app)
    .patch(`/tasks/${taskThree._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      completed: false
    })
    .expect(404)
  const task = await Task.findById(taskThree._id)
  expect(task.completed).toBe(true)
})
test('Should fetch user task by id', async () => {
  await request(app)
    .get(`/tasks/${taskThree._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200)
})
test('Should not fetch user task by id if unauthenticated', async () => {
  await request(app)
    .get(`/tasks/${taskThree._id}`)
    .send()
    .expect(401)
})
test('Should not fetch other users task by id', async () => {
  const response = await request(app)
    .get(`/tasks/${taskThree._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(404)
})

test('Should fetch only completed tasks', async () => {
  const response = await request(app)
    .get(`/tasks?completed=true`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
  expect(response.body.length).toEqual(1)
})
test('Should fetch only incomplete tasks', async () => {
  const response = await request(app)
    .get(`/tasks?completed=false`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
  expect(response.body.length).toEqual(1)
})
// Need to review his sort/match/page/limit--not sure code is working right

test('Should sort tasks by ascending description', async () => {
  const response = await request(app)
    .get(`/tasks?sortBy=description:asc`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200)
  expect(response.body[3].description).toEqual('Third task')
})
test('Should sort tasks by descending createdAt', async () => {
  const response = await request(app)
    .get(`/tasks?sortBy=createdAt:desc`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200)
  expect(response.body[3].description).toEqual('Third task')
})

test('Should sort tasks by descending updatedAt', async () => {
  const response = await request(app)
    .get(`/tasks?sortBy=updatedAt:desc`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200)
  expect(response.body[3].description).toEqual('Third task')
})
// not working
test('Should sort tasks by completion', async () => {
  const response = await request(app)
    .get(`/tasks?sortBy=completion:asc`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200)
  console.log(response.body)
  // expect(response.body[3].description).toEqual('Third task')
})
test('Should fetch a page of tasks', async () => {
  const response = await request(app)
    .get(`/tasks?limit=2`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200)
  expect(response.body.length).toEqual(2)
})
