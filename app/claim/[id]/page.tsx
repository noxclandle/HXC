import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ClaimClientUI from '@/components/claim/ClaimClientUI';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id: params.id },
    });
    if (!contact) {
      return { title: "不明なアイデンティティ / Identity Not Found" };
    }
    return {
      title: `デジタル名刺の受け取り: ${contact.name} / Receive Digital Card: ${contact.name}`,
      description: "HXC (Hexa Relation) で作成されたデジタル名刺です。情報を確認して受け取ってください。 / Verify and receive this digital business card.",
    };
  } catch (e) {
    return { title: "名刺の受け取り / Receive Hexa Card" };
  }
}

export default async function ClaimPage({ params }: Props) {
  const contact = await prisma.contact.findUnique({
    where: { id: params.id },
  });

  if (!contact) {
    notFound();
  }

  // クライアントにシリアライズ可能な形で渡す
  const serializedContact = {
    id: contact.id,
    name: contact.name,
    email: contact.email || "",
    phone: contact.phone || "",
    role: contact.handle_name || "一般 / Guest",
    address: contact.address || "",
    notes: contact.notes || "",
  };

  return <ClaimClientUI contact={serializedContact} />;
}
