import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Send, MessageCircle, ArrowLeft } from 'lucide-react';
import { chatAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useSocket } from '../hooks/useSocket';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function ChatPage() {
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [activeConv, setActiveConv] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef(null);
  const qc = useQueryClient();
  const { joinConversation, sendSocketMessage, onMessage } = useSocket();

  const sellerParam = searchParams.get('seller');
  const productParam = searchParams.get('product');

  const { data: convData } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => chatAPI.getConversations().then((r) => r.data),
    enabled: !!user,
  });

  const conversations = convData?.conversations || [];

  // Auto-select conversation from URL params
  useEffect(() => {
    if (sellerParam && conversations.length > 0) {
      const existing = conversations.find((c) =>
        c.participants.some((p) => (p._id || p) === sellerParam)
      );
      if (existing) setActiveConv(existing);
    }
  }, [sellerParam, conversations]);

  // Load messages for active conversation
  useEffect(() => {
    if (!activeConv) return;
    chatAPI.getMessages(activeConv._id).then(({ data }) => {
      setMessages(data.messages || []);
    });
    joinConversation(activeConv._id);
  }, [activeConv]);

  // Listen for real-time messages
  useEffect(() => {
    const cleanup = onMessage((msg) => {
      if (msg.conversation === activeConv?._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return cleanup;
  }, [activeConv, onMessage]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMsg = useMutation({
    mutationFn: (content) => chatAPI.sendMessage({
      conversationId: activeConv?._id,
      receiverId: sellerParam || activeConv?.participants?.find((p) => (p._id || p) !== user._id)?._id,
      content,
      productId: productParam,
    }),
    onSuccess: ({ data }) => {
      setMessages((prev) => [...prev, data.message]);
      if (!activeConv) setActiveConv({ _id: data.conversationId });
      sendSocketMessage({ conversationId: data.conversationId, ...data.message });
      qc.invalidateQueries(['conversations']);
    },
    onError: () => toast.error('Failed to send message'),
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMsg.mutate(message);
    setMessage('');
  };

  const getOtherParticipant = (conv) =>
    conv.participants?.find((p) => (p._id || p) !== user?._id);

  return (
    <div className="pt-16 min-h-screen flex" style={{ background: 'var(--cream)' }}>
      {/* Conversations sidebar */}
      <motion.div
        className={`${showSidebar ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-80 border-r flex-shrink-0`}
        style={{ borderColor: 'var(--sand)', background: 'var(--parchment)' }}
      >
        <div className="p-5 border-b" style={{ borderColor: 'var(--sand)' }}>
          <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--charcoal)' }}>Messages</h2>
          <p className="text-xs mt-1" style={{ color: 'var(--warm-gray)' }}>{conversations.length} conversation{conversations.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="text-center py-12 px-4">
              <MessageCircle size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm" style={{ color: 'var(--warm-gray)' }}>No conversations yet. Browse products and message artisans!</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const other = getOtherParticipant(conv);
              const isActive = activeConv?._id === conv._id;
              return (
                <motion.button
                  key={conv._id}
                  className="w-full flex items-center gap-3 p-4 text-left transition-all border-b"
                  style={{
                    borderColor: 'var(--sand)',
                    background: isActive ? 'rgba(193,105,58,0.08)' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--terracotta)' : '3px solid transparent',
                  }}
                  onClick={() => { setActiveConv(conv); setShowSidebar(false); }}
                  whileHover={{ background: 'rgba(193,105,58,0.05)' }}
                >
                  <img
                    src={other?.avatar?.url || `https://placehold.co/40x40/F2EBE0/C1693A?text=${other?.name?.[0] || '?'}`}
                    alt="" className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: 'var(--charcoal)' }}>{other?.name || 'Unknown'}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--warm-gray)' }}>{conv.lastMessage || 'Start a conversation'}</p>
                  </div>
                </motion.button>
              );
            })
          )}
        </div>
      </motion.div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col">
        {!activeConv && !sellerParam ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'var(--parchment)' }}>
              <MessageCircle size={32} style={{ color: 'var(--warm-gray)' }} />
            </div>
            <p className="font-display text-xl" style={{ color: 'var(--charcoal)' }}>Select a conversation</p>
            <p className="text-sm max-w-xs" style={{ color: 'var(--warm-gray)' }}>Choose from the left sidebar or visit a product page to message the artisan directly.</p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--sand)', background: 'var(--parchment)' }}>
              <button className="md:hidden btn-ghost p-2 rounded-xl" onClick={() => setShowSidebar(true)}>
                <ArrowLeft size={18} />
              </button>
              {activeConv && (
                <>
                  {(() => {
                    const other = getOtherParticipant(activeConv);
                    return (
                      <>
                        <img src={other?.avatar?.url || `https://placehold.co/40x40/F2EBE0/C1693A?text=${other?.name?.[0] || '?'}`}
                          alt="" className="w-9 h-9 rounded-xl object-cover" />
                        <div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--charcoal)' }}>{other?.name}</p>
                          <p className="text-xs" style={{ color: '#10B981' }}>● Online</p>
                        </div>
                      </>
                    );
                  })()}
                </>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => {
                const mine = (msg.sender?._id || msg.sender) === user?._id;
                return (
                  <motion.div
                    key={msg._id || i}
                    className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  >
                    <div
                      className="max-w-xs px-4 py-2.5 rounded-2xl text-sm"
                      style={{
                        background: mine ? 'var(--terracotta)' : 'var(--parchment)',
                        color: mine ? '#fff' : 'var(--charcoal)',
                        border: mine ? 'none' : '1px solid var(--sand)',
                        borderBottomRightRadius: mine ? '4px' : '16px',
                        borderBottomLeftRadius: mine ? '16px' : '4px',
                      }}
                    >
                      <p>{msg.content}</p>
                      <p className="text-xs mt-1 opacity-60">{msg.createdAt ? formatDate(msg.createdAt) : 'Just now'}</p>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t flex gap-3 items-center" style={{ borderColor: 'var(--sand)', background: 'var(--parchment)' }}>
              <input
                className="input-field flex-1 text-sm"
                placeholder="Type your message…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <motion.button
                type="submit"
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--grad-terra)' }}
                disabled={!message.trim() || sendMsg.isLoading}
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
              >
                <Send size={17} color="white" />
              </motion.button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
