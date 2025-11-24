import { useEffect, useState, useRef } from "react";
import { conversationsApi, type Conversation } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import { Send } from "lucide-react";

// Helper to get the other participant's email
const getOtherParticipant = (conversation: Conversation, currentUserId: string) => {
  const otherParticipant = conversation.participants.find(
    (p) => p._id !== currentUserId
  );
  return otherParticipant?.email || "Unknown User";
};

export default function Inbox() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessageText, setNewMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const { socket } = useSocket();
  const currentUserId = user?._id;

  const fetchConversations = async () => {
    if (!currentUserId) return;
    setLoading(true);
    try {
      const res = await conversationsApi.list();
      setConversations(res.conversations);
      if (!selectedConversation && res.conversations.length > 0) {
        setSelectedConversation(res.conversations[0]);
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversationDetails = async (conversationId: string) => {
    if (!currentUserId) return;
    try {
      await conversationsApi.markAsRead(conversationId);
      const res = await conversationsApi.get(conversationId);
      setSelectedConversation(res.conversation);
      fetchConversations(); // Refresh conversation list to update unread status
    } catch (error) {
      console.error("Failed to fetch conversation details:", error);
      setSelectedConversation(null);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [currentUserId]);

  useEffect(() => {
    if (selectedConversation) {
      fetchConversationDetails(selectedConversation._id);
    }
  }, [selectedConversation?._id]);

  useEffect(() => {
    if (socket) {
      socket.on("new_message", ({ conversationId, message }) => {
        if (selectedConversation?._id === conversationId) {
          setSelectedConversation((prev) => {
            if (prev) {
              return { ...prev, messages: [...prev.messages, message] };
            }
            return null;
          });
        } else {
          // If the new message is for a different conversation,
          // we should still update the conversation list to show the new last message
          fetchConversations();
        }
      });

      return () => {
        socket.off("new_message");
      };
    }
  }, [socket, selectedConversation]);

  useEffect(() => {
    if (selectedConversation?.messages.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedConversation?.messages.length]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !selectedConversation || !currentUserId) return;

    setSending(true);
    try {
      await conversationsApi.sendMessage(selectedConversation._id, newMessageText);
      setNewMessageText("");
      // Refresh the selected conversation to show the new message
      await fetchConversationDetails(selectedConversation._id);
      // Also refresh the conversations list to update last message/timestamp
      await fetchConversations();
    } catch (error) {
      console.error("Failed to send message:", error);
      // Optionally show an error message to the user
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="text-center text-slate-500">Loading conversations...</div>
      </section>
    );
  }

  if (!currentUserId) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="text-center text-red-500">Please log in to view your inbox.</div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">Your Inbox</h1>
      <div className="flex h-[70vh] rounded-2xl border border-slate-200 bg-white shadow-lg">
        {/* Conversation List (Left Pane) */}
        <div className="w-1/3 overflow-y-auto border-r border-slate-200">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-slate-500">No conversations yet.</div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv._id}
                className={`cursor-pointer border-b border-slate-100 p-4 transition hover:bg-slate-50 ${
                  selectedConversation?._id === conv._id ? "bg-slate-100" : ""
                }`}
                onClick={() => setSelectedConversation(conv)}
              >
                <p className="font-semibold text-slate-800">
                  {getOtherParticipant(conv, currentUserId)}
                </p>
                <p className="truncate text-sm text-slate-600">{conv.subject}</p>
                {conv.lastMessage && (
                  <p className="text-xs text-slate-400">
                    {conv.lastMessage.text.substring(0, 30)}...
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Message View (Right Pane) */}
        <div className="flex w-2/3 flex-col">
          {selectedConversation ? (
            <>
              <div className="border-b border-slate-200 p-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  {selectedConversation.subject}
                </h2>
                <p className="text-sm text-slate-600">
                  With: {getOtherParticipant(selectedConversation, currentUserId)}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {selectedConversation.messages.length === 0 ? (
                  <div className="text-center text-slate-500">
                    Start a conversation!
                  </div>
                ) : (
                  selectedConversation.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`mb-3 flex ${
                        message.sender._id === currentUserId ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender._id === currentUserId
                            ? "bg-[var(--rs-primary)] text-white"
                            : "bg-slate-200 text-slate-800"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className="mt-1 text-xs opacity-70">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="border-t border-slate-200 p-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-lg border border-slate-300 p-2 text-sm focus:border-[var(--rs-primary)] focus:ring-[var(--rs-primary)]"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-[var(--rs-primary)] p-2 text-white transition hover:opacity-90 disabled:opacity-50"
                    disabled={sending}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-slate-500">
              Select a conversation to view messages.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
