import { prismaMock } from '../config/prisma.mock'
import { FollowService } from "../../src/services/follow.service"
import * as dotenv from "dotenv";
import { any } from 'jest-mock-extended';
dotenv.config();

describe('follow tests', () => {
    test('should return 201 if the user starts following another user', async () => {
        // sut
        const sut = new FollowService()

        prismaMock.followers.create.mockResolvedValue({
            id: "id_qualquer",
            idUser: "idUser_qualquer",
            idFollowing: "idFollowing_qualquer",
            dthrCreated: new Date(),
            dthrUpdated: new Date()
        })

        // methodos

        const result = await sut.follow({
            idFollow: "idFollowing_qualquer",
            idUser: "idUser_qualquer",
            user: {
                following: [],
                idUser: "idUser_qualquer",
                username: "User_1"
            },
            userFollow: {
                following: [],
                idUser: "idFollowing_qualquer",
                username: "Following_1"
            }
        })

        // asserts
        expect(result).toBeDefined()
        expect(result.ok).toEqual(true)
        expect(result).toHaveProperty("code", 201)
        expect(result).toHaveProperty("message", "User_1 started following Following_1")
        expect(result.data).toBeUndefined()
    })

    test('should return 500 if there is any failure in the following process', async () => {
        // sut
        const sut = new FollowService()
        prismaMock.followers.create.mockRejectedValue(any)

        // methodos
        const result = await sut.follow(null!)

        // asserts
        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result).toHaveProperty("code", 500)
        expect(result).toHaveProperty("message", "Error when following the user.")
        expect(result.data).toBeDefined()
    })
})

describe('unfollow tests', () => {
    test('should return 201 if the user stops following another user', async () => {
        // sut
        const sut = new FollowService()

        prismaMock.followers.delete.mockResolvedValue({
            id: "id_qualquer",
            idUser: "idUser_qualquer",
            idFollowing: "idFollowing_qualquer",
            dthrCreated: new Date(),
            dthrUpdated: new Date()
        })

        // methodos
        const result = await sut.unfollow({
            idFollow: "idFollowing_qualquer",
            idUser: "idUser_qualquer",
            user: {
                following: [],
                idUser: "idUser_qualquer",
                username: "User_1"
            },
            userFollow: {
                following: [],
                idUser: "idFollowing_qualquer",
                username: "Following_1"
            }
        })

        // asserts
        expect(result).toBeDefined()
        expect(result.ok).toEqual(true)
        expect(result).toHaveProperty("code", 201)
        expect(result).toHaveProperty("message", "User_1 unfollowed Following_1")
        expect(result.data).toBeUndefined()
    })

    test('should return 500 if there is any failure in the unfollow process ', async () => {
        // sut
        const sut = new FollowService()
        prismaMock.followers.delete.mockRejectedValue(any)
        // methodos
        const result = await sut.unfollow(null!)

        // asserts
        expect(result).toBeDefined()
        expect(result.ok).toEqual(false)
        expect(result).toHaveProperty("code", 500)
        expect(result).toHaveProperty("message", "Error when unfollowing the user.")
        expect(result.data).toBeDefined()
    })
})

