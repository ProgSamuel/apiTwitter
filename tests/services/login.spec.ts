import { LoginService } from '../../src/services/login.service'
import { prismaMock } from '../config/prisma.mock'
import * as dotenv from "dotenv";
dotenv.config();

describe('email login tests', () => {
  test('should return 404 if email or password are not provided', async () => {
    // sut
    const loginService = new LoginService()

    // methodos
    const result = await loginService.loginEmail(
      "emailteste@teste.com.br", ""
    )
    // asserts
    expect(result).toBeDefined()
    expect(result.ok).toEqual(false)
    expect(result).toHaveProperty("code", 400)
    expect(result).toHaveProperty("message", "Fill in all mandatory fields")
    expect(result.data).toBeUndefined()
  })

  test('should return 404 if the email does not exist ', async () => {
    //sut
    const loginService = new LoginService()

    // simulated behavior
    prismaMock.user.findFirst.mockResolvedValue(null)

    // methodos
    const result = await loginService.loginEmail(
      "emailteste@teste.com", "teste9090"
    )
    // asserts
    expect(result).toBeDefined()
    expect(result.ok).toEqual(false)
    expect(result).toHaveProperty("code", 404)
    expect(result).toHaveProperty("message", "Email does not exist")
    expect(result.data).toBeUndefined()

  })

  test('should return 400 if password is incorrect ', async () => {
    //sut
    const loginService = new LoginService()

    // simulated behavior
    prismaMock.user.findFirst.mockResolvedValue({
      idUser: "63c46857-0df2-4440-879b-0003a6bd5d5e",
      email:"teste@teste.com",
      dthrCreated: new Date(),
      dthrUpdated: new Date(),
      name: "Teste",
      username:"teste",
      password:"teste9090", 
      photo: null,
      token: null,
    })
    

    // methodos
    const result = await loginService.loginEmail(
      "teste@teste.com", "teste9090errada"
    )
    // asserts
    expect(result).toBeDefined()
    expect(result.ok).toEqual(false)
    expect(result).toHaveProperty("code", 400)
    expect(result).toHaveProperty("message", "Invalid password")
    expect(result.data).toBeUndefined()
  })

  test('should return 200 if login completed successfully', async () => {
    //sut
    const loginService = new LoginService()
    // simulated behavior 
    prismaMock.user.findFirst.mockResolvedValue({
      idUser: "63c46857-0df2-4440-879b-0003a6bd5d5e",
      name: "Teste",
      email:"teste@teste.com.br",
      username:"teste",
      password:"teste9090",
      token: null,
      photo: null,
      dthrCreated: new Date(),
      dthrUpdated: new Date(),
    })

    prismaMock.user.update.mockResolvedValue({
      idUser: "63c46857-0df2-4440-879b-0003a6bd5d5e",
      name: "Teste",
      email:"teste@teste.com.br",
      username:"teste",
      password:"teste9090",
      token: "eyJqualquer_token",
      photo: null,
      dthrCreated: new Date(),
      dthrUpdated: new Date(),
    })
    // methodos
    const result = await loginService.loginEmail(
      "teste@teste.com.br", "teste9090"
    )
    // asserts
    expect(result).toBeDefined()
    expect(result.ok).toEqual(true)
    expect(result).toHaveProperty("code", 200)
    expect(result).toHaveProperty("message", "Login ok")

    expect(result.data).toBeDefined()
    expect(result.data).toHaveProperty("idUser")
    expect(result.data).toHaveProperty("email")
    expect(result.data).toHaveProperty("token")
    
    expect(result.data.token).toContain("eyJ")
  })
})

describe('username login tests', () => {
  test('should return 400 if username or password are not provided', async () => {
    // sut
    const loginService = new LoginService()
    // methodos
    const result = await loginService.loginUsername(
      "teste", ""
    )
    // asserts
    expect(result).toBeDefined()
    expect(result.ok).toEqual(false)
    expect(result).toHaveProperty("code", 400)
    expect(result).toHaveProperty("message", "Fill in all mandatory fields")
    expect(result.data).toBeUndefined()
  })

  test('should return 404 if the username does not exist ', async () => {
    // sut
    const loginService = new LoginService()
    // simulated behavior 
    prismaMock.user.findFirst.mockResolvedValue(null)
    // methodos
    const result = await loginService.loginUsername(
      "teste1", "teste9090errada"
    )
    // asserts
    expect(result).toBeDefined()
    expect(result.ok).toEqual(false)
    expect(result).toHaveProperty("code", 404)
    expect(result).toHaveProperty("message", "Username does not exist")
    expect(result.data).toBeUndefined()
  })

  test('should return 400 if password is incorrect ', async () => {
    //sut
    const loginService = new LoginService()
    // simulated behavior 
    prismaMock.user.findFirst.mockResolvedValue({
      idUser: "63c46857-0df2-4440-879b-0003a6bd5d5e",
      email:"teste@teste.com",
      dthrCreated: new Date(),
      dthrUpdated: new Date(),
      name: "Teste",
      username:"teste",
      password:"teste9090",
      photo: null,
      token: null,
    })

    // methodos
    const result = await loginService.loginUsername(
      "teste", "teste9090e"
    )
    // asserts
    expect(result).toBeDefined()
    expect(result.ok).toEqual(false)
    expect(result).toHaveProperty("code", 400)
    expect(result).toHaveProperty("message", "Invalid password")
    expect(result.data).toBeUndefined()
  })

  test('should return 200 if login completed successfully', async () => {
    //sut
    const loginService = new LoginService()
    // simulated behavior 
    prismaMock.user.findFirst.mockResolvedValue({
      idUser: "63c46857-0df2-4440-879b-0003a6bd5d5e",
      name: "Teste",
      email:"teste@teste.com.br",
      username:"teste",
      password:"teste9090",
      token: null,
      photo: null,
      dthrCreated: new Date(),
      dthrUpdated: new Date(),
    })

    prismaMock.user.update.mockResolvedValue({
      idUser: "63c46857-0df2-4440-879b-0003a6bd5d5e",
      name: "Teste",
      email:"teste@teste.com.br",
      username:"teste",
      password:"teste9090",
      token: "eyJqualquer_token",
      photo: null,
      dthrCreated: new Date(),
      dthrUpdated: new Date(),
    })

    // methodos
    const result = await loginService.loginUsername(
      "teste", "teste9090"
    )
    // asserts
    expect(result).toBeDefined()
    expect(result.ok).toEqual(true)
    expect(result).toHaveProperty("code", 200)
    expect(result).toHaveProperty("message", 'Login ok')

    expect(result.data).toBeDefined()
    expect(result.data).toHaveProperty("idUser")
    expect(result.data).toHaveProperty("username")
    expect(result.data).toHaveProperty("token")
    
    expect(result.data.token).toContain("eyJ")
  })
})

