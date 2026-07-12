import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const resonanceQuerySchema = z.object({
  mode: z.enum(["incoming"]).optional(),
  targetSlug: z.string().optional(),
});

const resonancePostSchema = z.object({
  targetSlug: z.string().min(1),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ status: "none", isViewerMember: false });
    }

    const { searchParams } = new URL(req.url);
    const currentUserId = session.user.id;

    const queryParsed = resonanceQuerySchema.safeParse({
      mode: searchParams.get("mode") || undefined,
      targetSlug: searchParams.get("targetSlug") || undefined,
    });
    if (!queryParsed.success) {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }

    // Check if we are fetching all incoming pending requests
    const mode = queryParsed.data.mode;
    if (mode === "incoming") {
      const incomingRequests = await prisma.resonanceLink.findMany({
        where: {
          target_id: currentUserId,
          status: "pending"
        },
        orderBy: {
          created_at: "desc"
        }
      });

      const requesters = await prisma.user.findMany({
        where: {
          id: { in: incomingRequests.map(r => r.requester_id) }
        },
        select: {
          id: true,
          name: true,
          handle_name: true,
          photo_url: true
        }
      });

      const formatted = incomingRequests.map(link => {
        const user = requesters.find(u => u.id === link.requester_id);
        return {
          id: link.id,
          createdAt: link.created_at,
          requester: {
            id: user?.id,
            name: user?.name || user?.handle_name || "HXC Member",
            slug: user?.handle_name || user?.id
          }
        };
      });

      return NextResponse.json({ requests: formatted });
    }

    const targetSlug = queryParsed.data.targetSlug;
    if (!targetSlug) {
      return NextResponse.json({ error: "Missing target slug" }, { status: 400 });
    }

    const targetUser = await prisma.user.findFirst({
      where: {
        OR: [
          { handle_name: targetSlug },
          { id: targetSlug }
        ]
      }
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 });
    }

    if (currentUserId === targetUser.id) {
      return NextResponse.json({ status: "self", isViewerMember: true });
    }

    const outgoingLink = await prisma.resonanceLink.findUnique({
      where: {
        requester_id_target_id: {
          requester_id: currentUserId,
          target_id: targetUser.id
        }
      }
    });

    const incomingLink = await prisma.resonanceLink.findUnique({
      where: {
        requester_id_target_id: {
          requester_id: targetUser.id,
          target_id: currentUserId
        }
      }
    });

    if (incomingLink?.status === "connected" || outgoingLink?.status === "connected") {
      return NextResponse.json({ status: "connected", isViewerMember: true });
    }

    if (outgoingLink?.status === "pending") {
      return NextResponse.json({ status: "pending_sent", isViewerMember: true });
    }

    if (incomingLink?.status === "pending") {
      return NextResponse.json({ status: "pending_received", isViewerMember: true });
    }

    return NextResponse.json({ status: "none", isViewerMember: true });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Resonance Status Error", { error: message });
    return NextResponse.json({ error: message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const bodyParsed = resonancePostSchema.safeParse(json);
    if (!bodyParsed.success) {
      return NextResponse.json({ error: "Missing target slug" }, { status: 400 });
    }
    const { targetSlug } = bodyParsed.data;

    const currentUserId = session.user.id;

    // 1. Get current user info
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId }
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Get target user info
    const targetUser = await prisma.user.findFirst({
      where: {
        OR: [
          { handle_name: targetSlug },
          { id: targetSlug }
        ]
      }
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 });
    }

    if (currentUser.id === targetUser.id) {
      return NextResponse.json({ error: "Cannot resonate with yourself" }, { status: 400 });
    }

    // 3. Check for existing resonance links
    // Outgoing check (self to target)
    const outgoingLink = await prisma.resonanceLink.findUnique({
      where: {
        requester_id_target_id: {
          requester_id: currentUser.id,
          target_id: targetUser.id
        }
      }
    });

    // Incoming check (target to self)
    const incomingLink = await prisma.resonanceLink.findUnique({
      where: {
        requester_id_target_id: {
          requester_id: targetUser.id,
          target_id: currentUser.id
        }
      }
    });

    // If already connected in either direction, return connected state
    if (incomingLink?.status === "connected" || outgoingLink?.status === "connected") {
      return NextResponse.json({ status: "connected", message: "Already connected." });
    }

    // A. Incoming link is pending -> Mutual Resonance complete!
    if (incomingLink && incomingLink.status === "pending") {
      await prisma.$transaction(async (tx) => {
        // 1. Upgrade resonance status to connected
        await tx.resonanceLink.update({
          where: { id: incomingLink.id },
          data: { status: "connected" }
        });

        // 2. Automatically populate contact books
        // Add B to A's contacts
        const existingContactForA = await tx.contact.findFirst({
          where: { owner_id: currentUser.id, email: targetUser.email }
        });
        if (!existingContactForA && targetUser.email) {
          await tx.contact.create({
            data: {
              owner_id: currentUser.id,
              name: targetUser.name || targetUser.handle_name || "HXC Member",
              handle_name: targetUser.handle_name,
              phone: targetUser.phone,
              email: targetUser.email,
              address: targetUser.address,
              notes: "Resonance Connection established."
            }
          });
        }

        // Add A to B's contacts
        const existingContactForB = await tx.contact.findFirst({
          where: { owner_id: targetUser.id, email: currentUser.email }
        });
        if (!existingContactForB && currentUser.email) {
          await tx.contact.create({
            data: {
              owner_id: targetUser.id,
              name: currentUser.name || currentUser.handle_name || "HXC Member",
              handle_name: currentUser.handle_name,
              phone: currentUser.phone,
              email: currentUser.email,
              address: currentUser.address,
              notes: "Resonance Connection established."
            }
          });
        }

        // 3. Award 3,000 RT each
        // To User A
        await tx.rTTransaction.create({
          data: {
            user_id: currentUser.id,
            amount: 3000,
            type: "RESONANCE_BONUS",
            description: `Resonance established with ${targetUser.name || targetUser.handle_name}`
          }
        });
        await tx.user.update({
          where: { id: currentUser.id },
          data: { rt_balance: { increment: 3000 } }
        });

        // To User B
        await tx.rTTransaction.create({
          data: {
            user_id: targetUser.id,
            amount: 3000,
            type: "RESONANCE_BONUS",
            description: `Resonance established with ${currentUser.name || currentUser.handle_name}`
          }
        });
        await tx.user.update({
          where: { id: targetUser.id },
          data: { rt_balance: { increment: 3000 } }
        });

        // 4. Unlock title: "Resonance Catalyst"
        const updateTitles = (currentTitles: unknown) => {
          const titles = (currentTitles as string[]) || [];
          if (!titles.includes("Resonance Catalyst")) {
            return [...titles, "Resonance Catalyst"];
          }
          return titles;
        };

        const newTitlesA = updateTitles(currentUser.unlocked_titles);
        await tx.user.update({
          where: { id: currentUser.id },
          data: { unlocked_titles: newTitlesA }
        });

        const newTitlesB = updateTitles(targetUser.unlocked_titles);
        await tx.user.update({
          where: { id: targetUser.id },
          data: { unlocked_titles: newTitlesB }
        });
      });

      return NextResponse.json({ 
        status: "connected", 
        message: "Resonance established! Mutual contact details exchanged, +3,000 RT awarded, and 'Resonance Catalyst' Title unlocked." 
      });
    }

    // B. Outgoing request is already pending -> Return pending
    if (outgoingLink && outgoingLink.status === "pending") {
      return NextResponse.json({ status: "pending", message: "Resonance request already sent." });
    }

    // C. No existing links -> Create new pending resonance request
    await prisma.resonanceLink.create({
      data: {
        requester_id: currentUser.id,
        target_id: targetUser.id,
        status: "pending"
      }
    });

    return NextResponse.json({ status: "pending", message: "Resonance request sent." });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Resonance Link Error", { error: message });
    return NextResponse.json({ error: message || "Internal server error" }, { status: 500 });
  }
}
