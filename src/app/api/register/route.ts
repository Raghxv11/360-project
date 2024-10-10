
import { NextRequest, NextResponse } from "next/server";
import fs from 'fs-extra';
import bcrypt from 'bcryptjs';
import path from 'path';


export const maxDuration = 300;
const userFilePath = path.join(process.cwd(), 'data', 'users.json');


export async function POST(_req: NextRequest): Promise<NextResponse> {
  try {
    const { username, password  } = await _req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = { username, password: hashedPassword };

    const users = await fs.readJson(userFilePath);
    const userExists = users.find((user: any) => user.username === username);

    if (userExists) {
      return NextResponse.json({
        status: 400,
        data: null,
      });
    }

    users.push(userData);
    await fs.writeJson(userFilePath, users);

    return NextResponse.json({
      status: 200,
      data: {
        message: 'User registered successfully',
      },
    });
  } catch (_error) {
    console.error(_error);
    return NextResponse.json({
      status: 429,
      data: null,
    });
  }
}
