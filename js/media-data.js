/*
 * ANISE — รายการภาพ (Gallery / artwork list)
 * ---------------------------------------------------------------
 * ภาพทุกไฟล์เป็นต้นฉบับที่ได้รับมา ไม่ได้ลบลายน้ำหรือแก้ไขภาพ
 * ไฟล์ "-960.webp" เป็นสำเนาย่อขนาดสำหรับแสดงในหน้าเว็บเท่านั้น
 *
 * เพิ่มภาพใหม่: วางไฟล์ไว้ใน assets/images/<original|furry>/ แล้วเพิ่ม 1 รายการในกลุ่มที่ตรงกับเวอร์ชัน
 *   { src: 'ไฟล์เต็ม', thumb: 'ไฟล์ย่อ (ไม่ใส่ก็ได้)', w, h, title, kind, credit: 'original' | 'furry' | 'ข้อความเครดิต' }
 * ห้ามใส่ภาพของอีกเวอร์ชันปนในกลุ่มนี้
 */
(function () {
  'use strict';

  const IMG = 'assets/images/';

  const MEDIA = {
    original: {
      label: 'Original Form',
      // ภาพหลักในหน้า Welcome: ภาพเต็มตัว (จัดกรอบด้วย CSS ไม่ได้ตัดไฟล์)
      hero: { src: IMG + 'original/full-body.jpg', w: 1230, h: 1500, focus: '50% 18%', alt: 'Anise ร่าง Original — ภาพเต็มตัว' },
      portrait: { src: IMG + 'original/chibi-canele-960.webp', full: IMG + 'original/chibi-canele.jpg', w: 787, h: 960, alt: 'Anise ร่าง Original — ภาพ Chibi กับขนมคานาเล่' },
      // credit: 'original' = เครดิต Adopt Design / Owner, ข้อความอื่น = แสดงตามนั้นในหน้าดูภาพ
      gallery: [
        { src: IMG + 'original/full-body.jpg', thumb: IMG + 'original/full-body-960.webp', w: 1230, h: 1500, title: 'Full Body', kind: 'ภาพเต็มตัว', credit: 'original' },
        { src: IMG + 'original/chibi-canele.jpg', thumb: IMG + 'original/chibi-canele-960.webp', w: 1230, h: 1500, title: 'Chibi — Canelé', kind: 'ภาพ Chibi', credit: 'original' },
        { src: IMG + 'original/moodboard.jpg', thumb: IMG + 'original/moodboard-960.webp', w: 1500, h: 1500, title: 'Moodboard — Dark Brown & Cream', kind: 'Moodboard', credit: 'template © sakkyokukanojo ✦ illust © Jwala DuHin' },
        { src: IMG + 'original/chibi-doll.jpg', thumb: IMG + 'original/chibi-doll-960.webp', w: 1386, h: 1500, title: 'Chibi', kind: 'ภาพ Chibi', credit: 'นักวาด: ดูรายชื่อในส่วนเครดิต' },
        { src: IMG + 'original/sketch.jpg', thumb: IMG + 'original/sketch-960.webp', w: 1061, h: 1500, title: 'Sketch', kind: 'ภาพสเก็ตช์', credit: 'Oc by Jwa Jwala · Artist: Back Doll (ตามลายเซ็นบนภาพ)' },
        { src: IMG + 'original/chibi-bat.jpg', thumb: IMG + 'original/chibi-bat-960.webp', w: 1500, h: 1500, title: 'Chibi', kind: 'ภาพ Chibi', credit: 'นักวาด: ดูรายชื่อในส่วนเครดิต' }
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
