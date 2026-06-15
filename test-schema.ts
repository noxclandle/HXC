import { z } from "zod";
const profileUpdateSchema = z.object({
  name: z.string().optional().or(z.literal("")),
  reading: z.string().optional().or(z.literal("")),
  title: z.string().optional().or(z.literal("")),
  website: z.string().optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
  photo_url: z.string().optional().or(z.literal("")),
  logo_url: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().optional().or(z.literal("")),
  link_x: z.string().optional().or(z.literal("")),
  link_instagram: z.string().optional().or(z.literal("")),
  link_line: z.string().optional().or(z.literal("")),
  link_facebook: z.string().optional().or(z.literal("")),
  equipped_assets: z.any().optional(),
});

const payload = {
  name: "福井 豪",
  reading: "ふくいつよし",
  title: "でべろっぱー",
  company: "Hexa relation",
  website: "https://www.hexa-relation.com/",
  bio: "マジシャン、探偵、AI開発、メンサ",
  phone: "08028647945",
  email: "str1yf5x@gmail.com",
  logo_url: "IMAGE_LARGE",
  photo_url: "IMAGE_LARGE",
  link_x: "clandles2",
  link_instagram: "username",
  link_line: "https://line.me/ti/p/-OuUUleJ1h",
  link_facebook: "https://facebook.com/your-id",
  equipped_assets: { frame: "Obsidian", scaleName: "standard" }
};

const result = profileUpdateSchema.safeParse(payload);
console.log(result.success ? "Schema Validation Passed" : result.error.format());
