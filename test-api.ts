import { prisma } from './lib/prisma';
import { NextResponse } from 'next/server';

async function test() {
  const user = await prisma.user.findFirst({ where: { email: 'str1yf5x@gmail.com' } });
  if (!user) return console.log('no user');
  
  const payload = {
    name: "福井 豪",
    reading: "ふくいつよし",
    title: "でべろっぱー",
    company: "Hexa relation",
    website: "https://www.hexa-relation.com/",
    bio: "マジシャン、探偵、AI開発、メンサ",
    phone: "08028647945",
    email: "str1yf5x@gmail.com",
    logo_url: user.logo_url,
    photo_url: user.photo_url,
    link_x: "clandles2",
    link_instagram: "username",
    link_line: "https://line.me/ti/p/-OuUUleJ1h",
    link_facebook: "https://facebook.com/your-id",
    equipped_assets: user.equipped_assets
  };

  try {
    const res = await fetch("https://hxc-puce.vercel.app/api/profile/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Mocking a session cookie or token is impossible without a real login session from the browser.
        // I will instead test the DB logic directly again with the exact schema.
      },
      body: JSON.stringify(payload)
    });
    console.log(res.status, await res.text());
  } catch (e) {
    console.error(e);
  }
}
test();
