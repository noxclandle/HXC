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
      return { title: "Identity Lost" };
    }
    return {
      title: `${contact.name} | 電子名刺の受取`,
      description: "HXC (Hexa Relation) により、あなたの紙名刺がデジタルに透過されました。このカードを受け取り、アクティベートしてください。",
    };
  } catch (e) {
    return { title: "Hexa Claim" };
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
    role: contact.handle_name || "The Observer",
    address: contact.address || "",
    notes: contact.notes || "",
  };

  return <ClaimClientUI contact={serializedContact} />;
}
