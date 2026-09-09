import { useState, useEffect, useRef } from "react";
import { IconVolume, IconVolumeOff } from "../components/icons"; // ou use qualquer ícone que já tenhas

interface BotaoLerTextoProps {
  texto: string;
  idioma?: string; // "pt-PT" | "pt-BR" | "en-US"
}

export default function BotaoLerTexto({ texto, idioma = "pt-PT" }: BotaoLerTextoProps) {
  const [lendo, setLendo] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Para a leitura se o componente for desmontado (ex: trocar de sistema)
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const alternarLeitura = () => {
    if (lendo) {
      window.speechSynthesis.cancel();
      setLendo(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = idioma;
    utterance.rate = 1; // velocidade
    utterance.onend = () => setLendo(false);
    utterance.onerror = () => setLendo(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.cancel(); // garante que não sobrepõe outra leitura
    window.speechSynthesis.speak(utterance);
    setLendo(true);
  };

  return (
    <button
      onClick={alternarLeitura}
      title={lendo ? "Parar leitura" : "Ouvir descrição"}
      className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
    >
      {lendo ? <IconVolumeOff className="w-4 h-4" /> : <IconVolume className="w-4 h-4" />}
    </button>
  );
}