const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      name: 'Arnold',
      email: 'arnold@example.com',
      password: 'Arnoldpass7'
    })
    .expect(201)
  // Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()
  // Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: 'Arnold',
      email: 'arnold@example.com'
    },
    token: user.tokens[0].token
  })
  expect(user.password).not.toBe('Arnoldpass7')
})

test('Should login existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200)
  const user = await User.findById(response.body.user._id)
  expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexisting user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: 'badguy@example.com',
      password: 'Idonotlike'
    })
    .expect(400)
})
test('Should fetch user profile', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})
test('Should not fetch profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})
test('Should delete authenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
  const user = await User.findById(userOneId)
  expect(user).toBeNull()
})
test('Should not delete an unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
  const user = await User.findById(userOneId)
  expect(user).not.toBeNull()
})
test('Should not delete an unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})
test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200)
  const user = await User.findById(userOneId)
  expect(user.avatar).toEqual(expect.any(Buffer))
})
test('Should update valid user fields', async () => {
  await request(app)
    .patch('/users/me/')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'George'
    })
    .expect(200)
  const user = await User.findById(userOneId)
  expect(user.name).toEqual('George')
})
test('Should not update invalid user fields', async () => {
  await request(app)
    .patch('/users/me/')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: 'St.George, Utah'
    })
    .expect(400)
})
test('Should not signup user with invalid name', async () => {
  await request(app)
    .post('/users')
    .send({
      name: '',
      email: 'arnold@example.com',
      password: 'Arnoldpass7'
    })
    .expect(400)
})
test('Should not signup user with invalid email', async () => {
  await request(app)
    .post('/users')
    .send({
      name: 'Arnold',
      email: 'arnold@example',
      password: 'Arnoldpass7'
    })
    .expect(400)
})
test('Should not signup user with invalid password', async () => {
  await request(app)
    .post('/users')
    .send({
      name: 'Arnold',
      email: 'arnold@example.com',
      password: 'A'
    })
})
test('Should not update user if unauthenticated', async () => {
  await request(app)
    .patch('/users/me/')

    .send({
      name: 'George'
    })
    .expect(401)
  const user = await User.findById(userOneId)
  expect(user.name).toEqual('Joseph')
})
test('Should not update user with invalid name', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: '',
      email: 'arnold@example.com',
      password: 'Arnoldpass7'
    })
    .expect(400)
})
test('Should not update user with invalid email', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'Arnold',
      email: 'arnold@example',
      password: 'Arnoldpass7'
    })
    .expect(400)
})
test('Should not update user with invalid password', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'Arnold',
      email: 'arnold@example.com',
      password: 'A'
    })
    .expect(400)
})
