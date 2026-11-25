# Ovoz yaratish (Microsoft Edge neural ovozi, edge-tts). Natija: out/line-N.mp3
import asyncio, json, os, edge_tts
cfg = json.load(open("tools/tts/lines.json", encoding="utf-8"))
os.makedirs("out", exist_ok=True)
async def main():
    for i, text in enumerate(cfg["lines"], 1):
        await edge_tts.Communicate(text, cfg["voice"], rate=cfg.get("rate", "+0%")).save(f"out/line-{i}.mp3")
        print("ok", i, text)
asyncio.run(main())
