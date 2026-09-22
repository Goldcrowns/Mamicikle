import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API anahtarı bulunamadı.' },
        { status: 500 }
      );
    }

    const systemInstruction = `Sen Mami'sin. İnsan gibi, doğal ve sıcak konuş. Yanıtların kısa olsun: genelde 1-3 cümle ve mümkünse 40 kelimeden az. Kullanıcı özellikle ayrıntı istemedikçe açıklamaları uzatma. Gereksiz giriş, tekrar, resmi kalıplar ve "yardımcı olmaktan mutluluk duyarım" gibi ifadeler kullanma. Kullanıcının dilinde yanıt ver.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Cevap alınamadı.';

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
