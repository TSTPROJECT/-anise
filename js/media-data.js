/*
 * ANISE — รายการภาพ (Gallery / artwork list)
 * ---------------------------------------------------------------
 * ภาพทุกไฟล์เป็นต้นฉบับที่ได้รับมา ไม่ได้ลบลายน้ำหรือแก้ไขภาพ
 * ไฟล์ "-960.webp" เป็นสำเนาย่อขนาดสำหรับแสดงในหน้าเว็บเท่านั้น
 *
 * เพิ่มภาพใหม่: วางไฟล์ไว้ใน assets/images/<original|furry>/ แล้วเพิ่ม 1 รายการในกลุ่มที่ตรงกับเวอร์ชัน
 *   { src: 'ไฟล์เต็ม', thumb: 'ไฟล์ย่อ (ไม่ใส่ก็ได้)', w, h, title, kind, credit: 'original' | 'furry' }
 * ห้ามใส่ภาพของอีกเวอร์ชันปนในกลุ่มนี้
 */
(function () {
  'use strict';

  const IMG = 'assets/images/';

  const MEDIA = {
    original: {
      label: 'Original Form',
      // ภาพหลักในหน้า Welcome: ใช้ character sheet ทั้งไฟล์ จัดกรอบด้วย CSS (ไม่ได้ตัดไฟล์)
      hero: { src: IMG + 'original/character-sheet.webp', w: 2000, h: 1415, focus: '68% 40%', alt: 'Anise ร่าง Original — ภาพเต็มตัวจาก Character Sheet' },
      portrait: { src: IMG + 'original/chibi-adoptable-960.webp', full: IMG + 'original/chibi-adoptable.webp', w: 679, h: 960, alt: 'Anise ร่าง Original — ภาพ Chibi Adoptable' },
      gallery: [
        { src: IMG + 'original/character-sheet.webp', thumb: IMG + 'original/character-sheet-960.webp', w: 2000, h: 1415, title: 'Character Sheet', kind: 'ภาพหลัก · ภาพเต็มตัว · Chibi', credit: 'original' },
        { src: IMG + 'original/chibi-adoptable.webp', thumb: IMG + 'original/chibi-adoptable-960.webp', w: 1415, h: 2000, title: 'Adoptable — Chibi', kind: 'ภาพ Chibi', credit: 'original' },
        { src: IMG + 'palette/colour-palette.png', thumb: IMG + 'palette/colour-palette-960.webp', w: 1414, h: 2000, title: 'Colour Palette', kind: 'ภาพ Colour Palette', credit: 'palette' }
      ]
    },
    furry: {
      label: 'Furry Form',
      hero: { src: IMG + 'furry/furry-design.webp', w: 1500, h: 2000, focus: '50% 45%', alt: 'Anise ร่าง Furry — ภาพ Furry Design' },
      portrait: { src: IMG + 'furry/furry-design-960.webp', full: IMG + 'furry/furry-design.webp', w: 720, h: 960, alt: 'Anise ร่าง Furry — ภาพ Furry Design' },
      gallery: [
        { src: IMG + 'furry/furry-design.webp', thumb: IMG + 'furry/furry-design-960.webp', w: 1500, h: 2000, title: 'Furry Design', kind: 'ภาพ Furry Design', credit: 'furry' }
        // ภาพเต็มตัว / Chibi / ภาพรายละเอียดของ Furry Form — เพิ่มที่นี่เมื่อได้รับจากเจ้าของตัวละคร
      ]
    }
  };

  window.ANISE_MEDIA = MEDIA;
})();
