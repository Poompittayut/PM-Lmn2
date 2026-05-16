PM LMN2 — Vercel deploy package
================================

วิธี deploy บน Vercel (5 ขั้นตอน):

1. สมัคร / login ที่ https://vercel.com
2. ไปที่ https://vercel.com/new
3. ที่หน้านี้ มองหาปุ่ม "Import Third-Party Git Repository" หรือ "Deploy"
   ทางที่ง่ายที่สุดสำหรับไฟล์เดี่ยว:
     - กดปุ่ม "Add New" -> "Project"
     - หรือไป https://vercel.com/new/clone
4. ที่ตัวเลือก "Deploy" ลากโฟลเดอร์นี้ทั้งโฟลเดอร์ (vercel-deploy/) เข้าไป
   *** สำคัญ: ลากทั้งโฟลเดอร์ ไม่ใช่แค่ไฟล์ index.html ***
5. กด Deploy รอ ~30 วินาที จะได้ URL เช่น https://pm-lmn2-xxx.vercel.app

หมายเหตุ:
- ถ้า drag-drop ใน vercel.com ใหม่ๆ ไม่มี ให้ใช้ Vercel CLI แทน:
    npm i -g vercel
    cd vercel-deploy
    vercel
  (ตอบ Y ทุกข้อ ถ้าถามว่า link/setup what dir)
- เมื่อ deploy แล้ว URL จะถาวร แชร์ให้ทีมเปิดบน iPad/มือถือใช้ได้เลย

ภายในโฟลเดอร์มี:
- index.html  : ไฟล์เว็บแอป (PM LMN2 ปรับฟอนต์แล้ว)
- vercel.json : ค่า config สำหรับปิด cache (ให้แก้ทีหลังเห็นผลทันที)
- README.txt  : ไฟล์นี้
