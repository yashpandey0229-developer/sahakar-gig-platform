// Real Gemini AI Integration for Sahakar Voice & Text Agent (Gemini 2.5 Flash)

const SYSTEM_PROMPT = `
You are "Sahakar AI" (सहकार एआई), an intelligent, warm, and helpful conversational voice assistant for "SahakarGig" — a democratic, worker-owned cooperative platform for household gig services (electricians, plumbers, AC repair, home cleaning, carpentry, painting, caretaking).

Key Knowledge & Behavior:
1. Pricing & Fair Wages: 88% of customer payment goes directly to the worker's bank, 7% goes to the collective health & welfare fund, and only 5% covers platform IT costs.
2. Tone: Helpful, courteous, concise, natural (Indian context). You speak fluent natural Hindi and English (Hinglish supported).
3. Brevity for Voice: Keep responses concise (1 to 3 short spoken sentences) so they sound natural when spoken out loud.
4. Capabilities: You can diagnose home repair issues, suggest maintenance tips, explain fair cooperative pricing, check worker earnings, and help book verified artisans.
5. If the user wants to book a service (e.g. plumber, electrician, cleaning, AC), confirm warmly and encourage them to view the available artisans.

Output strictly plain text without markdown formatting or bullet points so it sounds natural in text-to-speech.
`;

export async function askGemini(prompt, history = [], userRole = 'customer', customApiKey = '') {
  try {
    // 1. Try Backend Proxy (/api/ai/chat) first
    const backendRes = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: prompt,
        history,
        role: userRole,
        apiKey: customApiKey
      })
    });

    if (backendRes.ok) {
      const data = await backendRes.json();
      if (data && data.reply) {
        return {
          reply: data.reply,
          source: 'gemini-api'
        };
      }
    }
  } catch (err) {
    console.warn('Backend Gemini proxy failed, attempting direct endpoint or smart response:', err.message);
  }

  // 2. Direct client endpoint if API key provided
  const apiKey = customApiKey || (typeof process !== 'undefined' ? process.env?.VITE_GEMINI_API_KEY : '');
  if (apiKey) {
    try {
      const directRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Question: ${prompt}` }]
              }
            ]
          })
        }
      );

      if (directRes.ok) {
        const json = await directRes.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return { reply: text.trim(), source: 'gemini-direct' };
        }
      }
    } catch (e) {
      console.warn('Direct Gemini API call error:', e.message);
    }
  }

  // 3. Resilient High-Intelligence Local Context Fallback
  return {
    reply: generateSmartFallbackReply(prompt, userRole),
    source: 'smart-fallback'
  };
}

function generateSmartFallbackReply(cmd, role) {
  const text = cmd.toLowerCase();

  if (text.includes('plumb') || text.includes('नल') || text.includes('प्लंबर') || text.includes('पानी') || text.includes('leak') || text.includes('drain')) {
    return 'नल या पाइप लीकेज के लिए हमारे पास कुशल प्लंबर तैयार हैं। न्यूनतम दर ₹349 है जिसमें से ₹307 सीधा कारीगर को मिलता है। क्या आप अभी बुक करना चाहते हैं?';
  }
  if (text.includes('electr') || text.includes('बिजली') || text.includes('पंखा') || text.includes('wire') || text.includes('mcb') || text.includes('switch') || text.includes('spark')) {
    return 'शॉर्ट सर्किट या वायरिंग समस्या के लिए प्रमाणित इलेक्ट्रीशियन 10 से 15 मिनट में आपके पास पहुंच सकते हैं। तुरंत सेवा के लिए ऊपर दिए गए इलेक्ट्रिकल कार्ड पर क्लिक करें।';
  }
  if (text.includes('ac') || text.includes('कूल') || text.includes('gas') || text.includes('filter')) {
    return 'एसी सर्विसिंग और गैस रीफिलिंग के लिए सहकारी तकनीशियन उपलब्ध हैं। इसमें फोम जेट वॉश और कॉइल डायग्नोस्टिक्स शामिल है।';
  }
  if (text.includes('clean') || text.includes('सफाई') || text.includes('झाड़ू') || text.includes('deep clean')) {
    return 'घर की संपूर्ण डीप क्लीनिंग के लिए महिला स्वावलंबन सहकारी टीम उपलब्ध है। इको-फ्रेंडली केमिकल और मशीनों से स्वच्छता की जाती है।';
  }
  if (text.includes('wallet') || text.includes('कमाई') || text.includes('पैसे') || text.includes('dividend') || text.includes('balance')) {
    return 'सहकारी वॉलेट में आपकी 88% प्रत्यक्ष कमाई तत्काल यूपीआई द्वारा निकाली जा सकती है और त्रैमासिक लाभांश अलग से सुरक्षित है।';
  }
  if (text.includes('sahakar') || text.includes('coop') || text.includes('who are you') || text.includes('क्या है')) {
    return 'नमस्ते! मैं सहकार एआई हूँ। सहकारगिग भारत का पहला सहकारी घरेलू सेवा मंच है जहाँ बिचौलियों का शोषण नहीं होता और 88% भुगतान सीधे कामगारों को जाता है।';
  }

  return `नमस्ते! मैंने आपकी बात समझी: "${cmd}"। आप घरेलू मरम्मत, पारदर्शी दरों या कारीगर बुकिंग से जुड़ा कोई भी सवाल पूछ सकते हैं।`;
}
