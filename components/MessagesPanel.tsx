'use client';

import { useOpenClawStore } from '@/lib/openclawStore';
import { MessageSource } from '@/lib/openclawTypes';
import {
  MessageSquare,
  Send as SendIcon,
  Phone,
  Globe,
  Terminal,
  Filter,
  Loader2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const sourceIcons: Record<MessageSource, typeof MessageSquare> = {
  telegram: SendIcon,
  whatsapp: Phone,
  api: Globe,
  terminal: Terminal,
};

const sourceColors: Record<MessageSource, string> = {
  telegram: 'text-blue-400 bg-blue-500/20',
  whatsapp: 'text-green-400 bg-green-500/20',
  api: 'text-purple-400 bg-purple-500/20',
  terminal: 'text-orange-400 bg-orange-500/20',
};

const sourceLabels: Record<MessageSource, string> = {
  telegram: 'TG',
  whatsapp: 'WA',
  api: 'API',
  terminal: 'Term',
};

export default function MessagesPanel() {
  const {
    messages,
    messagesFilter,
    setMessagesFilter,
    getFilteredMessages,
  } = useOpenClawStore();

  const filteredMessages = getFilteredMessages();

  const filterOptions: (MessageSource | 'all')[] = ['all', 'telegram', 'whatsapp', 'api', 'terminal'];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-3 h-3 animate-spin text-blue-400" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3 text-green-400" />;
      case 'error':
        return <XCircle className="w-3 h-3 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 rounded-xl border border-slate-700/50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-orange-400" />
          <h2 className="font-semibold text-slate-100">Messages</h2>
          <span className="px-2 py-0.5 bg-slate-800 rounded-full text-xs text-slate-400">
            {messages.length}
          </span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-2 border-b border-slate-700/50 overflow-x-auto">
        {filterOptions.map((filter) => {
          const isActive = messagesFilter === filter;
          const Icon = filter === 'all' ? Filter : sourceIcons[filter];
          const colorClass = filter === 'all' ? '' : sourceColors[filter];

          return (
            <button
              key={filter}
              onClick={() => setMessagesFilter(filter)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-orange-500/20 text-orange-400'
                  : `bg-slate-800 text-slate-400 hover:bg-slate-700 ${colorClass}`
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>
                {filter === 'all' ? 'Tous' : sourceLabels[filter]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
            <MessageSquare className="w-8 h-8" />
            <p>Aucun message</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredMessages.map((msg) => {
              const Icon = sourceIcons[msg.source];
              const colorClass = sourceColors[msg.source];

              return (
                <div
                  key={msg.id}
                  className="p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`p-1.5 rounded ${colorClass}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <span className="font-medium text-slate-200">{msg.from}</span>
                        {msg.chatId && (
                          <span className="ml-2 text-xs text-slate-500">#{msg.chatId}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(msg.status)}
                      <span className="text-xs text-slate-500">
                        {formatDistanceToNow(new Date(msg.timestamp), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-300 whitespace-pre-wrap">
                    {msg.text}
                  </p>
                  {msg.replyTo && (
                    <div className="mt-2 pl-3 border-l-2 border-slate-600 text-xs text-slate-500">
                      Reponse a: {msg.replyTo}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
