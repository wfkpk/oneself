import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FirebaseAuthStrategy } from 'src/auth/firebase-auth.strategy';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly firebase: FirebaseAuthStrategy,
  ) {}

  async createUser(authToken: string) {
    const firebaseUser = await this.firebase.validate(authToken);

    const firebaseUid = firebaseUser.uid;
    const firebaseEmail = firebaseUser.email;
    const mailVerified = firebaseUser.email_verified;

    const isUser = await this.prisma.user.findUnique({
      where: {
        email: firebaseEmail,
      },
    });
    if (isUser) {
      throw new BadRequestException('user already exists');
    }

    if (isUser.firebaseUid !== firebaseUid) {
      throw new BadRequestException('user already exists');
    }
    const user = await this.prisma.user.create({
      data: {
        firebaseUid: firebaseUid,
        email: firebaseEmail,
        mailVerified: mailVerified,
      },
    });

    return user;
  }

  async getUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        mailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }
}
