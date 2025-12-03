import { useEffect, useState, useRef } from "react";
import { conversationsApi, type Conversation, type Message } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import { Send, ArrowLeft } from "lucide-react";
import { useSearchParams } from "react-router-dom";

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
  const [searchParams] = useSearchParams();
  const conversationIdParam = searchParams.get("conversationId");

  const { user } = useAuth();
  const { socket } = useSocket();
  const currentUserId = user?._id;

  const fetchConversations = async () => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await conversationsApi.list();
      setConversations(res.conversations);
      
      if (conversationIdParam) {
        const targetConversation = res.conversations.find(c => c._id === conversationIdParam);
        if (targetConversation) {
          setSelectedConversation(targetConversation);
        } else {
          // If not in the list, try fetching it directly to handle race conditions
          fetchConversationDetails(conversationIdParam);
        }
      }
      // On desktop, select first conversation if none selected
      else if (window.innerWidth >= 768 && !selectedConversation && res.conversations.length > 0) {
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
      // Update the conversation in the list if it exists
      setConversations(prev => {
          const exists = prev.some(c => c._id === res.conversation._id);
          if (exists) {
              return prev.map(c => c._id === res.conversation._id ? res.conversation : c);
          }
          return [res.conversation, ...prev];
      });
      // Refresh list to update unread status
      const listRes = await conversationsApi.list();
      setConversations(listRes.conversations);
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
      socket.on("new_message", ({ conversationId, message }: { conversationId: string; message: Message }) => {
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
    <div className="bg-slate-50 h-[calc(100vh-80px)]">
      <section className="mx-auto h-full max-w-7xl px-0 py-4 sm:px-6 md:py-8">
        <div className="flex h-full overflow-hidden bg-white sm:rounded-2xl sm:shadow-xl sm:border sm:border-slate-200">
          {/* Conversation List (Left Pane) */}
          <div className={`flex w-full flex-col border-r border-slate-200 md:w-1/3 ${selectedConversation ? "hidden md:flex" : "flex"}`}>
            <div className="border-b border-slate-100 p-4">
                <h1 className="text-xl font-bold text-slate-900">Inbox</h1>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No conversations yet.</div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv._id}
                    className={`cursor-pointer border-b border-slate-50 p-4 transition hover:bg-slate-50 ${
                      selectedConversation?._id === conv._id ? "bg-emerald-50/60 border-l-4 border-l-emerald-500" : "border-l-4 border-l-transparent"
                    }`}
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <p className="font-semibold text-slate-900">
                      {getOtherParticipant(conv, currentUserId)}
                    </p>
                    <p className="truncate text-sm font-medium text-slate-700">{conv.subject}</p>
                    {conv.lastMessage && (
                      <div className="mt-1 flex justify-between text-xs text-slate-500">
                        <span className="truncate pr-2">{conv.lastMessage.text.substring(0, 30)}...</span>
                        <span className="shrink-0">{new Date(conv.updatedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Message View (Right Pane) */}
          <div className={`flex w-full flex-col md:w-2/3 ${selectedConversation ? "flex" : "hidden md:flex"}`}>
            {selectedConversation ? (
              <>
                <div className="flex items-center gap-3 border-b border-slate-200 p-4 shadow-sm bg-white z-10">
                  <button 
                    onClick={() => setSelectedConversation(null)}
                    className="rounded-full p-2 text-slate-600 hover:bg-slate-100 md:hidden"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      {selectedConversation.subject}
                    </h2>
                    <p className="text-xs text-slate-500">
                      With {getOtherParticipant(selectedConversation, currentUserId)}
                    </p>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-4">
                  {selectedConversation.messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                      Start the conversation!
                    </div>
                  ) : (
                    selectedConversation.messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.sender._id === currentUserId ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                            message.sender._id === currentUserId
                              ? "bg-[var(--rs-primary)] text-white rounded-br-none"
                              : "bg-white text-slate-800 border border-slate-100 rounded-bl-none"
                          }`}
                        >
                          <p>{message.text}</p>
                          <p className={`mt-1 text-[10px] ${message.sender._id === currentUserId ? "text-emerald-100" : "text-slate-400"}`}>
                            {new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="border-t border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 rounded-full border border-slate-300 bg-slate-50 px-5 py-3 text-sm focus:border-[var(--rs-primary)] focus:ring-1 focus:ring-[var(--rs-primary)] focus:bg-white transition"
                      disabled={sending}
                    />
                    <button
                      type="submit"
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--rs-primary)] text-white shadow-lg shadow-emerald-500/30 transition hover:bg-[#0ea5e9] disabled:opacity-50 disabled:shadow-none"
                      disabled={sending}
                    >
                      <Send size={20} className="ml-0.5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 p-8 text-center">
                <div className="h-24 w-24 rounded-full bg-slate-200 mb-4 animate-pulse md:hidden"></div>
                <div className="hidden md:block">
                    <img src="/placeholder.svg" className="h-64 w-64 opacity-50 mb-4 grayscale" alt="No selection" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700">Your Messages</h3>
                <p className="text-slate-500 mt-2">Select a conversation from the list to start chatting.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
