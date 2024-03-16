import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const pet = await prisma.pets.upsert({
        where: {
            name: 'Bob'
        },
        update: {},
        create: {
            name: 'Bob',
            owner: 'Manuel'
        }
    })
    console.log({pet})
}
main()
.then(() => prisma.$disconnect())
.catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})