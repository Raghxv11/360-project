
import { NextRequest, NextResponse } from "next/server";
import fs from 'fs-extra';
import bcrypt from 'bcryptjs';
import path from 'path';
import jwt from 'jsonwebtoken';



export const maxDuration = 300;
const userFilePath = path.join(process.cwd(), 'data', 'users.json');


export async function POST(_req: NextRequest): Promise<NextResponse> {
  try {
    const { username, password  } = await _req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = { username, password: hashedPassword };

    const users = await fs.readJson(userFilePath);
    const user = users.find((user: any) => user.username === username);

    if (!user) {
        return NextResponse.json({
            status: 400,
            data: null,
          });
      }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return NextResponse.json({
            status: 400,
            data: null,
          });
    }

    const token = jwt.sign({ username }, 'your_secret_key', { expiresIn: '1h' });

    return NextResponse.json({
        status: 200,
        data: {
          token,
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
