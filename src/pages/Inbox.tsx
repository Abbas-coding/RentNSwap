import { useEffect, useState } from "react";
import { conversationsApi, type Conversation, type ConversationSummary } from "@/lib/api";

export default function Inbox() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    conversationsApi
      .list()
      .then((res) => {
        setConversations(res.conversations);
        if (res.conversations[0]) {
          loadConversation(res.conversations[0]._id);
        }
      })
      .catch(() => setConversations([]));
  }, []);

  const loadConversation = (id: string) => {
    conversationsApi.get(id).then((res) => setActiveConversation(res.conversation));
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Inbox</h1>
        <p className="mt-2 text-sm text-slate-600">
          Real-time chat integration is coming. For now, messages read/write via REST endpoints hitchhiked to MongoDB.
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-2">
            {conversations.map((thread) => (
              <button
                key={thread._id}
                onClick={() => loadConversation(thread._id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  activeConversation?._id === thread._id
                    ? "border-[var(--rs-primary)] bg-emerald-50 text-slate-900"
                    : "border-emerald-100 text-slate-600 hover:border-[var(--rs-primary)]"
                }`}
              >
                <p className="font-semibold text-slate-800">{thread.subject}</p>
                <p className="text-xs text-slate-500">
                  {thread.lastMessage?.text ?? "No messages yet"}
                </p>
              </button>
            ))}
            {conversations.length === 0 && (
              <p className="rounded-2xl border border-emerald-50 p-3 text-sm text-slate-500">
                No conversations yet. Seed the database to populate this list.
              </p>
            )}
          </aside>
          <div className="rounded-2xl border border-emerald-100 p-6">
            {activeConversation ? (
              <>
                <div className="flex items-center justify-between border-b border-emerald-50 pb-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{activeConversation.subject}</p>
                    <p className="text-xs text-slate-500">
                      Thread updated {new Date(activeConversation.updatedAt as string).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {activeConversation.messages.map((msg, index) => (
                    <div key={index} className="flex justify-start text-sm">
                      <div className="max-w-xs rounded-2xl bg-emerald-50 px-4 py-3 text-slate-700">
                        <p>{msg.text}</p>
                        <p className="mt-1 text-xs opacity-70">
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl border border-dashed border-emerald-200 p-4 text-sm text-slate-500">
                  Composer placeholder — soon to send messages via POST `/api/conversations/:id/messages`.
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-500">Select a conversation to preview messages.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
