import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, Ticket, Technician, Company } from "../types";
import { 
  Send, Image, Paperclip, MapPin, Mic, FileText, Bot, 
  User, CheckCheck, Plus, Users, ArrowLeft, AlertCircle 
} from "lucide-react";

interface SharedChatProps {
  currentRole: 'admin' | 'company' | 'tech';
  tickets: Ticket[];
  technicians: Technician[];
  companies: Company[];
  messages: ChatMessage[];
  onSendMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  systemContext?: any; // To pass metadata like finances/jobs for Admin IA
}

export default function SharedChat({ 
  currentRole, 
  tickets, 
  technicians, 
  companies, 
  messages, 
  onSendMessage,
  systemContext 
}: SharedChatProps) {
  const [activeTab, setActiveTab] = useState<'chats' | 'ai'>('chats');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  
  // AI Chat Assistant state
  const [aiInputText, setAiInputText] = useState("");
  const [aiChatHistory, setAiChatHistory] = useState<{ sender: 'user' | 'bot'; text: string; timestamp: string }[]>([
    {
      sender: 'bot',
      text: "Olá! Sou o Assistente de Inteligência Artificial da NexoraField. Como posso ajudar você hoje?",
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedTicketId]);

  useEffect(() => {
    aiEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiChatHistory]);

  // Set default ticket if none selected
  const activeTickets = tickets.filter(t => t.status !== 'Aberto' && t.status !== 'IA_Processando' && t.status !== 'Cancelado');
  
  useEffect(() => {
    if (!selectedTicketId && activeTickets.length > 0) {
      setSelectedTicketId(activeTickets[0].id);
    }
  }, [tickets]);

  const handleSendGroupMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedTicketId) return;

    let senderName = "Administrador";
    let senderId = "admin-1";
    if (currentRole === 'company') {
      senderName = "Gerente Operacional";
      senderId = "comp-1";
    } else if (currentRole === 'tech') {
      const activeTicket = tickets.find(t => t.id === selectedTicketId);
      const allocatedTech = technicians.find(t => t.id === activeTicket?.assignedTechId);
      senderName = allocatedTech ? allocatedTech.name : "Técnico Alocado";
      senderId = activeTicket?.assignedTechId || "tech-1";
    }

    onSendMessage({
      ticketId: selectedTicketId,
      senderType: currentRole,
      senderName,
      senderId,
      text: inputText
    });

    setInputText("");
  };

  const handleSendSimulatedAttachment = (type: 'image' | 'pdf' | 'voice' | 'location') => {
    if (!selectedTicketId) return;

    let senderName = "Administrador";
    let senderId = "admin-1";
    if (currentRole === 'company') {
      senderName = "Gerente Operacional";
      senderId = "comp-1";
    } else if (currentRole === 'tech') {
      const activeTicket = tickets.find(t => t.id === selectedTicketId);
      senderName = "Técnico Alocado";
      senderId = activeTicket?.assignedTechId || "tech-1";
    }

    let text = "";
    let fileUrl = "";
    let fileType: any = undefined;
    let location = undefined;

    switch (type) {
      case 'image':
        text = "Enviou uma evidência de foto em campo.";
        fileUrl = "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=600&h=400&fit=crop";
        fileType = "image";
        break;
      case 'pdf':
        text = "Anexou documento técnico de homologação (PDF).";
        fileUrl = "#";
        fileType = "pdf";
        break;
      case 'voice':
        text = "Mensagem de voz enviada (0:15)";
        fileUrl = "#";
        fileType = "voice";
        break;
      case 'location':
        text = "Compartilhou a localização em tempo real.";
        location = { lat: -22.9068, lng: -47.0616 };
        fileType = "voice"; // placeholder for styling trigger
        break;
    }

    onSendMessage({
      ticketId: selectedTicketId,
      senderType: currentRole,
      senderName,
      senderId,
      text,
      fileUrl,
      fileType,
      location
    });
  };

  const handleSendAiMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInputText.trim()) return;

    const userMsg = aiInputText;
    const timeStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setAiChatHistory(prev => [...prev, { sender: 'user', text: userMsg, timestamp: timeStr }]);
    setAiInputText("");
    setAiLoading(true);

    try {
      const response = await fetch("/api/ai/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: currentRole,
          message: userMsg,
          systemContext: systemContext || {
            ticketsCount: tickets.length,
            techniciansCount: technicians.length,
            onlineTechs: technicians.filter(t => t.status === 'online').length
          }
        })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setAiChatHistory(prev => [...prev, { sender: 'bot', text: data.text, timestamp: timeStr }]);
      } else {
        setAiChatHistory(prev => [...prev, { sender: 'bot', text: `Ocorreu um erro ao comunicar com a IA: ${data.error || "Erro Desconhecido"}`, timestamp: timeStr }]);
      }
    } catch (err: any) {
      setAiChatHistory(prev => [...prev, { sender: 'bot', text: `Não foi possível conectar à IA no servidor. Verifique o status da aplicação. Fallback: ${userMsg}`, timestamp: timeStr }]);
    } finally {
      setAiLoading(false);
    }
  };

  // Filter messages for active chat room
  const activeRoomMessages = messages.filter(m => m.ticketId === selectedTicketId);
  const activeTicketObj = tickets.find(t => t.id === selectedTicketId);
  const activeTechObj = activeTicketObj ? technicians.find(t => t.id === activeTicketObj.assignedTechId) : null;
  const activeCompObj = activeTicketObj ? companies.find(c => c.id === activeTicketObj.companyId) : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm h-[600px] flex flex-col">
      {/* Sub-header Tabs */}
      <div className="bg-slate-50 border-b border-slate-200 flex p-1">
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
            activeTab === 'chats'
              ? 'bg-white text-slate-800 shadow-sm border border-slate-200'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Chat de Chamados (Grupo / Direct)</span>
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
            activeTab === 'ai'
              ? 'bg-white text-slate-800 shadow-sm border border-slate-200'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bot className="h-4 w-4 text-indigo-500 animate-bounce" />
          <span>Assistente Virtual IA ({currentRole === 'tech' ? 'Copiloto' : currentRole === 'company' ? 'Consultor' : 'Analista'})</span>
        </button>
      </div>

      {activeTab === 'chats' ? (
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Rooms list */}
          <div className="w-1/3 border-r border-slate-200 overflow-y-auto hidden md:block bg-slate-50/50">
            <div className="p-3 border-b border-slate-200 bg-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Salas de Chat Ativas</span>
            </div>
            {activeTickets.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                Nenhum chamado alocado com chat ativo.
              </div>
            ) : (
              activeTickets.map(ticket => {
                const isSelected = ticket.id === selectedTicketId;
                const tech = technicians.find(t => t.id === ticket.assignedTechId);
                const lastMsg = messages.filter(m => m.ticketId === ticket.id).slice(-1)[0];
                return (
                  <button
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`w-full text-left p-3.5 border-b border-slate-100 flex gap-3 transition-colors ${
                      isSelected ? 'bg-indigo-50/60 border-l-4 border-l-indigo-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700">
                        {ticket.category.substring(0, 2)}
                      </div>
                      <span className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="text-xs font-bold text-slate-800 truncate">{ticket.title}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate mb-1">
                        Téc: {tech?.name || 'Não alocado'}
                      </p>
                      {lastMsg ? (
                        <p className="text-[11px] text-slate-400 truncate">
                          <strong className="text-slate-600">{lastMsg.senderName}:</strong> {lastMsg.text}
                        </p>
                      ) : (
                        <span className="text-[10px] font-mono text-indigo-500">Grupo de chamados criado</span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Active Chat Conversation */}
          <div className="flex-1 flex flex-col bg-slate-50/40">
            {activeTicketObj ? (
              <>
                {/* Chat Room Header */}
                <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold">
                      {activeTicketObj.category}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{activeTicketObj.title}</h4>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className="font-semibold text-slate-600">Grupo Tripartido:</span> 
                        <span>Empresa ({activeCompObj?.name || '...'})</span> • 
                        <span>Técnico ({activeTechObj?.name || '...'})</span> • 
                        <span>Admin Nexora</span>
                      </p>
                    </div>
                  </div>
                  {/* Status Indicator */}
                  <div className="hidden sm:block text-right">
                    <span className="px-2 py-1 rounded-full text-[9px] font-mono font-bold bg-orange-100 text-orange-700 border border-orange-200">
                      STATUS: {activeTicketObj.status.replace("_", " ")}
                    </span>
                  </div>
                </div>

                {/* Messages Panel */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {activeRoomMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs space-y-2">
                      <Users className="h-8 w-8 text-slate-300" />
                      <p>Sem mensagens anteriores nesta sala de chamados.</p>
                      <p className="text-[10px] text-slate-500">Inicie o alinhamento de campo enviando uma mensagem abaixo.</p>
                    </div>
                  ) : (
                    activeRoomMessages.map((msg) => {
                      const isMe = msg.senderType === currentRole;
                      const isSystem = msg.senderType === 'system';
                      
                      if (isSystem) {
                        return (
                          <div key={msg.id} className="flex justify-center my-2">
                            <div className="bg-slate-200/80 text-slate-600 text-[10px] font-mono px-3.5 py-1.5 rounded-full border border-slate-300/40 text-center max-w-md shadow-sm">
                              {msg.text}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm text-xs relative ${
                            isMe 
                              ? 'bg-indigo-600 text-white rounded-tr-none' 
                              : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                          }`}>
                            <div className={`text-[9px] font-bold mb-1 flex justify-between gap-4 ${
                              isMe ? 'text-indigo-200' : 'text-slate-500'
                            }`}>
                              <span>{msg.senderName}</span>
                              <span className="font-semibold uppercase text-[8px] px-1 bg-slate-100 text-slate-600 rounded">
                                {msg.senderType}
                              </span>
                            </div>
                            
                            {/* Message text */}
                            <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            
                            {/* Attachments rendering */}
                            {msg.fileUrl && (
                              <div className="mt-2 p-2 rounded-lg bg-slate-900/10 border border-black/10 flex items-center gap-2">
                                {msg.fileType === 'image' && (
                                  <img src={msg.fileUrl} alt="Evidência" className="w-full h-32 object-cover rounded" />
                                )}
                                {msg.fileType === 'pdf' && (
                                  <>
                                    <FileText className="h-5 w-5 text-red-500" />
                                    <span className="underline cursor-pointer">laudo_tecnico.pdf</span>
                                  </>
                                )}
                                {msg.fileType === 'voice' && (
                                  <>
                                    <Mic className="h-4 w-4" />
                                    <div className="flex-1 bg-slate-300 h-1.5 rounded-full overflow-hidden">
                                      <div className="bg-indigo-500 h-full w-2/3"></div>
                                    </div>
                                    <span>0:15</span>
                                  </>
                                )}
                              </div>
                            )}

                            {msg.location && (
                              <div className="mt-2 p-2 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200/50 flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-indigo-600 animate-bounce" />
                                <div className="font-mono text-[9px]">
                                  Lat: {msg.location.lat} • Lng: {msg.location.lng}
                                </div>
                              </div>
                            )}

                            <div className={`text-[8px] text-right mt-1.5 flex items-center justify-end gap-1 ${
                              isMe ? 'text-indigo-200' : 'text-slate-400'
                            }`}>
                              <span>{new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                              {isMe && <CheckCheck className="h-3.5 w-3.5 text-cyan-300" />}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input controls */}
                <form onSubmit={handleSendGroupMessage} className="bg-white p-3 border-t border-slate-200 flex items-center gap-2">
                  {/* Attachment Shortcuts */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      title="Anexar Imagem"
                      onClick={() => handleSendSimulatedAttachment('image')}
                      className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                      <Image className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Anexar PDF"
                      onClick={() => handleSendSimulatedAttachment('pdf')}
                      className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Localização GPS"
                      onClick={() => handleSendSimulatedAttachment('location')}
                      className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                      <MapPin className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Mensagem de Voz"
                      onClick={() => handleSendSimulatedAttachment('voice')}
                      className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all animate-pulse"
                    >
                      <Mic className="h-4 w-4" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Escreva sua mensagem operacional..."
                    className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/10"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <Users className="h-10 w-10 text-slate-300 mb-2" />
                <p className="text-xs">Por favor, selecione um chamado na aba lateral esquerda para abrir o chat de cooperação.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* AI ASSISTANT CHAT TAB */
        <div className="flex-1 flex flex-col bg-slate-50/50">
          {/* AI Banner */}
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 px-4 py-3 border-b border-indigo-800 text-white flex items-center gap-3">
            <div className="bg-white/15 p-1.5 rounded-lg">
              <Bot className="h-5 w-5 text-indigo-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold">Nexora AI Engine v3.5-flash</span>
                <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500 text-white rounded font-mono uppercase font-bold tracking-wider">Conectado</span>
              </div>
              <p className="text-[10px] text-indigo-200">
                {currentRole === 'tech' && "Copiloto Técnico Especialista em Hardware, NRs e Configurações."}
                {currentRole === 'company' && "Conselheiro de SLAs, Habilidades, Estimativas e Planejamento."}
                {currentRole === 'admin' && "Analista Administrativo Inteligente de faturamento, fraudes e chamados."}
              </p>
            </div>
          </div>

          {/* AI Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {aiChatHistory.map((msg, idx) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm text-xs ${
                    isUser 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none leading-relaxed'
                  }`}>
                    <div className={`text-[9px] font-mono mb-1.5 flex items-center gap-1 font-bold ${
                      isUser ? 'text-indigo-200' : 'text-indigo-600'
                    }`}>
                      {isUser ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                      <span>{isUser ? 'Você' : 'Nexora AI'}</span>
                    </div>

                    {/* Rich text with basic markdown support (bullet points) */}
                    <div className="space-y-1">
                      {msg.text.split('\n').map((line, lIdx) => {
                        if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
                          return <li key={lIdx} className="ml-3 list-disc text-slate-700 font-sans">{line.replace(/^[-*]\s*/, '')}</li>;
                        }
                        if (line.trim().startsWith('###')) {
                          return <h5 key={lIdx} className="font-bold text-[11px] mt-2 mb-1 text-slate-900 border-b border-slate-100 pb-0.5">{line.replace(/^###\s*/, '')}</h5>;
                        }
                        return <p key={lIdx}>{line}</p>;
                      })}
                    </div>

                    <p className={`text-[8px] text-right mt-1.5 ${isUser ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
            
            {aiLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm text-xs max-w-[80%] flex items-center gap-3">
                  <div className="flex space-x-1">
                    <span className="h-2 w-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="h-2 w-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="h-2 w-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span className="text-slate-400 text-[10px] font-mono">Nexora IA está interpretando e gerando resposta...</span>
                </div>
              </div>
            )}
            <div ref={aiEndRef} />
          </div>

          {/* Prompt Suggestion Chips based on Role */}
          <div className="px-4 py-2 border-t border-slate-100 bg-white flex flex-wrap gap-1.5 overflow-x-auto whitespace-nowrap">
            {currentRole === 'tech' && (
              <>
                <button 
                  onClick={() => setAiInputText("Como configurar acesso remotos no DVR Intelbras MHDX?")}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono px-2.5 py-1 rounded-full border border-slate-200"
                >
                  "Como configurar acesso no DVR Intelbras?"
                </button>
                <button 
                  onClick={() => setAiInputText("Quais as precauções de segurança para NR35 trabalho em altura de poste?")}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono px-2.5 py-1 rounded-full border border-slate-200"
                >
                  "Precauções de segurança para NR35"
                </button>
              </>
            )}
            {currentRole === 'company' && (
              <>
                <button 
                  onClick={() => setAiInputText("Sugira uma descrição técnica para contratação de especialista em fibra óptica em Campinas")}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono px-2.5 py-1 rounded-full border border-slate-200"
                >
                  "Escrever chamado para fibra óptica"
                </button>
                <button 
                  onClick={() => setAiInputText("Quais são as melhores certificações para exigir para manutenção solar fotovoltaica?")}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono px-2.5 py-1 rounded-full border border-slate-200"
                >
                  "Exigências para manutenção solar"
                </button>
              </>
            )}
            {currentRole === 'admin' && (
              <>
                <button 
                  onClick={() => setAiInputText("Quanto faturamos este mês na plataforma NexoraField e qual técnico tem a melhor avaliação?")}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono px-2.5 py-1 rounded-full border border-slate-200"
                >
                  "Análise de Faturamento e Melhores Técnicos"
                </button>
                <button 
                  onClick={() => setAiInputText("Quais empresas geraram mais chamados e qual a taxa média de aceitação?")}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono px-2.5 py-1 rounded-full border border-slate-200"
                >
                  "Rank de empresas e aceitação"
                </button>
              </>
            )}
          </div>

          {/* AI Chat Input Form */}
          <form onSubmit={handleSendAiMessage} className="bg-white p-3 border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={aiInputText}
              onChange={(e) => setAiInputText(e.target.value)}
              placeholder="Faça uma pergunta técnica ou operacional à IA..."
              className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={aiLoading}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/10 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
