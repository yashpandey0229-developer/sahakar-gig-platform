import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  MessageSquare, 
  X, 
  Radio, 
  Bot, 
  Check, 
  ArrowRight,
  Zap,
  Globe2,
  Key,
  Settings,
  Send,
  Loader2
} from 'lucide-react';
import { speechService } from '../../services/speechService';
import { askGemini } from '../../services/geminiService';
import { useAppState } from '../../context/AppStateContext';

export function VoiceAssistant({ onSelectService }) {
  const { 
    currentRole, 
    setCurrentRole, 
    language, 
    setLanguage, 
    activeWorker, 
    activeBooking,
    updateBookingStatus
  } = useAppState();

  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [customApiKey, setCustomApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [aiSource, setAiSource] = useState('Gemini 2.5 Flash');

  // Proactive greeting on modal open
  useEffect(() => {
    if (isOpen && !aiResponse) {
      const greeting = currentRole === 'worker'
        ? `नमस्ते ${activeWorker.name.split(' ')[0]} जी! मैं सहकार जेमिनी एआई हूँ। आपकी उपलब्ध बैलेंस ₹${activeWorker.wallet.availableBalance} है। आप मुझसे कोई भी सवाल पूछ सकते हैं।`
        : `नमस्ते! मैं सहकार जेमिनी एआई हूँ। आप घरेलू समस्याओं, प्लंबर/इलेक्ट्रीशियन दरों या बुकिंग के बारे में कुछ भी पूछ सकते हैं।`;
      
      setAiResponse(greeting);
      speechService.speak(greeting, 'hi');
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 3500);
    }
  }, [isOpen, currentRole]);

  const handleStartListening = () => {
    setTranscript('');
    setIsListening(true);

    speechService.listen(
      (text, isFinal) => {
        setTranscript(text);
        if (isFinal) {
          setIsListening(false);
          handleProcessGeminiQuery(text);
        }
      },
      (error) => {
        setIsListening(false);
        setAiResponse('आवाज स्पष्ट नहीं आई। कृपया दोबारा बोलें या लिखकर पूछें।');
      },
      language === 'hi' ? 'hi' : 'en'
    );
  };

  const handleProcessGeminiQuery = async (queryText) => {
    if (!queryText.trim()) return;

    setIsLoadingAi(true);
    setTranscript(queryText);

    // Call Real Gemini API
    try {
      const { reply, source } = await askGemini(queryText, [], currentRole, customApiKey);
      setAiResponse(reply);
      setAiSource(source.includes('gemini') ? 'Google Gemini 2.5 Flash' : 'Smart Cooperative AI');
      
      // Auto switch portal if user asked for specific area
      const text = queryText.toLowerCase();
      if (text.includes('plumb') || text.includes('नल') || text.includes('पानी')) {
        setCurrentRole('customer');
        if (onSelectService) onSelectService('plumbing');
      } else if (text.includes('electr') || text.includes('बिजली') || text.includes('वायर')) {
        setCurrentRole('customer');
        if (onSelectService) onSelectService('electrical');
      } else if (text.includes('ac') || text.includes('कूल')) {
        setCurrentRole('customer');
        if (onSelectService) onSelectService('ac-repair');
      } else if (text.includes('wallet') || text.includes('कमाई') || text.includes('dividend')) {
        setCurrentRole('worker');
      } else if (text.includes('vote') || text.includes('वोट') || text.includes('coop')) {
        setCurrentRole('cooperative');
      } else if (text.includes('ministry') || text.includes('मंत्रालय')) {
        setCurrentRole('ministry');
      }

      // Voice output
      setIsSpeaking(true);
      speechService.speak(reply, language === 'en' ? 'en' : 'hi');
      setTimeout(() => setIsSpeaking(false), 4000);
    } catch (e) {
      setAiResponse('नमस्ते! आपकी सेवा के लिए कारीगर तैयार हैं। क्या आप बुकिंग करना चाहते हैं?');
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    const q = textInput;
    setTextInput('');
    handleProcessGeminiQuery(q);
  };

  return (
    <>
      {/* Floating Iridescent AI Trigger Orb */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group relative flex items-center gap-3 p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl transition-all duration-300 ${
            isOpen
              ? 'bg-slate-900 border border-slate-700 text-white'
              : 'bg-white border-2 border-emerald-300 text-slate-900 shadow-xl shadow-emerald-500/20 hover:scale-105'
          }`}
          title="Sahakar Gemini Voice AI"
        >
          {!isOpen && (
            <span className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping pointer-events-none" />
          )}

          {/* AI Glowing Orb Core */}
          <div className="relative w-8 h-8 rounded-full iridescent-orb flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4 text-white drop-shadow" />
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-black tracking-wide text-slate-900 flex items-center gap-1.5 font-['Outfit']">
              <span>Gemini AI Agent</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </span>
            <span className="text-[10px] text-emerald-700 font-bold">
              {isOpen ? 'Close Voice HUD' : 'Speak or Type (हिन्दी/EN)'}
            </span>
          </div>
        </button>
      </div>

      {/* Iridescent Light Voice Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-full max-w-sm sm:max-w-md bg-white border-2 border-emerald-300 rounded-3xl shadow-2xl p-6 animate-in fade-in slide-in-from-bottom-6 space-y-5">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl iridescent-orb flex items-center justify-center text-white font-bold text-lg shadow-md">
                ✨
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 font-['Outfit'] flex items-center gap-2">
                  <span>Sahakar Gemini AI</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-black border border-emerald-300">
                    {aiSource}
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">Bilingual Multimodal Voice Intelligence</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowKeyInput(!showKeyInput)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                title="Configure Gemini API Key (Optional)"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Optional API Key Drawer */}
          {showKeyInput && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2 animate-in fade-in">
              <label className="text-[11px] font-bold text-slate-700 block">
                Google Gemini API Key (Optional):
              </label>
              <input
                type="password"
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                placeholder="AIzaSy... (leave blank to use server key)"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 block">
                Directly connects to Gemini 2.5 Flash for conversational responses.
              </span>
            </div>
          )}

          {/* Central Neural Iridescent Soundwave Core */}
          <div className="relative py-6 flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 via-white to-emerald-50/50 rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
            
            {/* Iridescent Orb Center */}
            <div className="relative mb-3">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-gradient-to-tr from-rose-500 via-amber-400 to-emerald-400 scale-110 shadow-2xl shadow-rose-500/40 animate-pulse'
                  : isSpeaking
                  ? 'iridescent-orb scale-105 shadow-2xl shadow-emerald-500/30'
                  : isLoadingAi
                  ? 'bg-gradient-to-tr from-blue-500 to-purple-600 animate-spin'
                  : 'iridescent-orb shadow-xl shadow-emerald-500/20'
              }`}>
                <button
                  onClick={handleStartListening}
                  disabled={isLoadingAi}
                  className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-slate-900 border-2 border-white/80 hover:scale-95 transition shadow-inner"
                >
                  {isLoadingAi ? (
                    <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                  ) : (
                    <Mic className={`w-7 h-7 ${isListening ? 'text-rose-500 animate-bounce' : 'text-emerald-600'}`} />
                  )}
                </button>
              </div>

              {/* Sound Frequency Wave Bars */}
              {(isListening || isSpeaking) && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-emerald-300 shadow-md">
                  <div className="w-1 bg-emerald-500 rounded-full wave-bar-1" />
                  <div className="w-1 bg-teal-500 rounded-full wave-bar-2" />
                  <div className="w-1 bg-blue-500 rounded-full wave-bar-3" />
                  <div className="w-1 bg-amber-500 rounded-full wave-bar-4" />
                  <div className="w-1 bg-emerald-500 rounded-full wave-bar-5" />
                </div>
              )}
            </div>

            {/* Live Prompt Status */}
            <p className="text-xs font-black text-slate-900 text-center">
              {isListening
                ? '🎙️ Listening... बोलिए (जैसे: "नल से पानी टपक रहा है")'
                : isLoadingAi
                ? '⚡ Consulting Google Gemini Flash AI...'
                : isSpeaking
                ? '🔊 Sahakar AI Speaking...'
                : 'Tap Mic to Speak in Hindi or English'}
            </p>

            {transcript && (
              <p className="mt-2 text-xs text-amber-800 font-mono italic px-4 text-center bg-amber-50 rounded-lg py-1 border border-amber-200">
                "{transcript}"
              </p>
            )}
          </div>

          {/* AI Response Bubble */}
          {aiResponse && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-slate-700 shadow-sm">
              <Bot className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-black text-emerald-900 block">Gemini AI Response:</span>
                <p className="leading-relaxed font-medium">{aiResponse}</p>
              </div>
            </div>
          )}

          {/* Text Input Box for typing queries */}
          <form onSubmit={handleTextSubmit} className="flex gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Ask anything (e.g., 'AC gas charge price?', 'नल रिपेयर')"
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!textInput.trim() || isLoadingAi}
              className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md disabled:opacity-50 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Voice Questions */}
          <div className="space-y-2">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
              Quick Questions for Gemini:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleProcessGeminiQuery('नल से पानी टपक रहा है क्या करूं?')}
                className="text-left text-[11px] bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-slate-700 hover:text-emerald-900 p-2 rounded-xl transition flex items-center justify-between font-bold"
              >
                <span>💧 "नल से पानी टपक रहा है"</span>
                <ArrowRight className="w-3 h-3 text-emerald-600" />
              </button>

              <button
                onClick={() => handleProcessGeminiQuery('बिजली का बिल कैसे कम करें?')}
                className="text-left text-[11px] bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-slate-700 hover:text-emerald-900 p-2 rounded-xl transition flex items-center justify-between font-bold"
              >
                <span>⚡ "बिजली बचत टिप्स"</span>
                <ArrowRight className="w-3 h-3 text-emerald-600" />
              </button>

              <button
                onClick={() => handleProcessGeminiQuery('सहकारगिग में 88% मॉडल क्या है?')}
                className="text-left text-[11px] bg-slate-50 hover:bg-amber-50 border border-slate-200 text-slate-700 hover:text-amber-900 p-2 rounded-xl transition flex items-center justify-between font-bold"
              >
                <span>💰 "88% मॉडल क्या है?"</span>
                <ArrowRight className="w-3 h-3 text-amber-600" />
              </button>

              <button
                onClick={() => handleProcessGeminiQuery('प्लंबर बुक करो')}
                className="text-left text-[11px] bg-slate-50 hover:bg-purple-50 border border-slate-200 text-slate-700 hover:text-purple-900 p-2 rounded-xl transition flex items-center justify-between font-bold"
              >
                <span>🧰 "प्लंबर बुक करो"</span>
                <ArrowRight className="w-3 h-3 text-purple-600" />
              </button>
            </div>
          </div>

        </div>
      )}
    </>
  );
}
