const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function login(userEmail) {
  try {
    return prisma.users.findFirst({ where: { email: userEmail } });
  } catch (error) {
    throw new Error(`Error in login: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

async function register(userBody) {
  try {
    return prisma.users.create({
      data: {
        full_name: userBody.full_name,
        email: userBody.email,
        role: userBody.role,
        password: userBody.password,
        phone_number: userBody.phone_number,
      },
    });
  } catch (error) {
    throw new Error(`Error in register: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

async function getUserByPhoneNumber(phoneNumber) {
  try {
    return prisma.users.findFirst({ where: { phone_number: phoneNumber } });
  } catch (error) {
    throw new Error(`Error in password recovery: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

async function setNewPassword(phoneNumber, password) {
  try {
    console.log(phoneNumber, password);
    const user = await prisma.users.findFirst({
      where: { phone_number: phoneNumber },
    });
    const status = await prisma.users.update({
      where: { id: user.id },
      data: { password: password },
    });
    if (status) {
      return true;
    }
  } catch (error) {
    throw new Error(`Error in password recovery: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = { login, register, setNewPassword, getUserByPhoneNumber };
