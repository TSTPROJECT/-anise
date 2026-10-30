/*
 * ANISE — ข้อมูลตัวละครต้นฉบับ (Official character data)
 * ---------------------------------------------------------------
 * ข้อมูลในไฟล์นี้คัดลอกจากต้นฉบับที่เจ้าของตัวละครกำหนดไว้ทุกตัวอักษร
 * ห้ามแก้ไข ตัด หรือแต่งเพิ่ม เว้นแต่เจ้าของตัวละครเป็นผู้แจ้งแก้ไข
 *
 * Every string below is copied verbatim from the owner's source text.
 * UI code only reads this object; it never rewrites it (deep-frozen at the end).
 * Website labels/ornaments live in index.html and main.js, never here.
 */
(function () {
  'use strict';

  const CHARACTER = {
    nickname: 'อานิส',
    nicknameLatin: 'Anis / Anise',
    fullNameTh: 'อมลรดา มิตสึโอะ โบดุแอง',
    fullNameIntl: 'Amolrada Mitsuo Beaudouin',
    fullNameJa: 'ボードゥワン・ミツオ・アモンラダー',
    shopName: 'La Cloche',
    shopNameTh: 'ลา คลอช',
    masterpieceTitle: 'สัจจะ แห่งขนมหวานและจิตวิญญาณ',

    // ข้อมูลพื้นฐาน — ลำดับตามต้นฉบับ
    profile: [
      { label: 'ชื่อเต็ม', en: 'Full Name', value: 'อมลรดา มิตสึโอะ โบดุแอง' },
      { label: 'ชื่อเล่น', en: 'Nickname', value: 'อานิส (Anis / Anise)' },
      { label: 'เพศ', en: 'Gender', value: 'หญิง' },
      { label: 'อายุ', en: 'Age', value: '20 ปี' },
      { label: 'กรุ๊ปเลือด', en: 'Blood Type', value: 'O-Negative (O Rh-)' },
      { label: 'ส่วนสูง', en: 'Height', value: '160 cm.' },
      { label: 'น้ำหนัก', en: 'Weight', value: '53 kg.' },
      { label: 'เชื้อชาติ', en: 'Ethnicity', value: 'ลูกครึ่งไทย–ญี่ปุ่น–ฝรั่งเศส' },
      { label: 'บ้านเกิด', en: 'Hometown', value: 'ญี่ปุ่น' },
      { label: 'รสนิยม', en: 'Orientation', value: 'Heterosexual' },
      { label: 'Position', en: 'Position', value: 'Bottom Only' },
      { label: 'อาชีพ', en: 'Occupation', value: 'นศ.ปี 2 คณะศิลปศาสตร์การประกอบอาหาร สาขาวิชาศิลปะการอบขนมอบและขนมหวานฝรั่งเศสชั้นสูง', wide: true },
      { label: 'ตำแหน่ง', en: 'Role', value: 'หัวหน้าผู้ช่วยแล็บอบขนม' },
      { label: 'สีประจำตัว', en: 'Signature Colour', value: 'Creme Caramel Palette' },
      { label: 'สไตล์การแต่งตัว', en: 'Fashion', value: 'Sawako style' },
      { label: 'วันเกิด', en: 'Birthday', value: '14 พฤศจิกายน' },
      { label: 'ราศี', en: 'Zodiac', value: 'พิจิก' },
      { label: 'สัดส่วนรูปร่าง (cm.)', en: 'Measurements', value: 'B92-W58-H91' }
    ],

    names: [
      { label: 'ชื่อเล่น (Nickname)', value: 'อานิส (Anis / Anise)' },
      { label: 'ชื่อเต็ม (Full Name)', value: 'อมลรดา มิตสึโอะ โบดุแอง' },
      { label: 'ชื่อสากล', value: 'Amolrada Mitsuo Beaudouin' },
      { label: 'ชื่อภาษาญี่ปุ่น', value: 'ボードゥワン・ミツオ・アモンラダー', lang: 'ja' },
      { label: 'ชื่อร้าน', value: '"La Cloche" (ลา คลอช)' },
      { label: 'ชื่อชุดข้อมูลระดับ Masterpiece', value: '"สัจจะ แห่งขนมหวานและจิตวิญญาณ"' }
    ],

    scent: {
      title: 'กลิ่นดอกปีบผสมขนมคานาเล่',
      full: 'กลิ่นดอกปีบผสมขนมคานาเล่ กลิ่นหอมสะอาดติดตัวตามธรรมชาติที่ผสานระหว่างความหอมโปร่งเย็นสบายชวนผ่อนคลายของดอกปีบเข้ากับความนุ่มนวลอบอุ่นของวานิลลา แป้งอบ และคาราเมลสีทองของขนมคานาเล่อย่างลงตัว ให้ความรู้สึกสุภาพ เรียบหรู และลึกลับน่าค้นหา โดยไม่ฉุนเลี่ยนและไม่จำเป็นต้องใช้น้ำหอม',
      // องค์ประกอบหลักตามโจทย์ (คำจากคำอธิบายต้นฉบับ)
      notes: ['ดอกปีบ', 'วานิลลา', 'แป้งอบ', 'คาราเมล']
    },

    background: [
      'หญิงสาวสามสายเลือด ไทย–ญี่ปุ่น–ฝรั่งเศส เกิดและเติบโตในย่านเมืองเก่าเกียวโต ครอบครัวเปิดร้านขนมฝรั่งเศสโบราณดั้งเดิมชื่อ "La Cloche" (ลา คลอช) เธอช่วยงานพ่อแม่ในครัวตั้งแต่เด็ก ทั้งบ่มแป้งและทาขี้ผึ้งเคลือบพิมพ์อบขนมคานาเล่จนเชี่ยวชาญ ทำให้เธอซึมซับความประณีตและอดทนจากบิดาอย่างลึกซึ้ง',
      'นอกจากฝั่งร้านขนม เธอยังได้รับการปลูกฝังวัฒนธรรมและหลักธรรมไทยจากมารดา อานิสสนใจศาสตร์ลี้ลับมาตั้งแต่วัยเยาว์ พร้อมทั้งฝึกเจริญภาวนาควบคู่กับการทำงานในห้องอบขนมที่เงียบสงบ หล่อหลอมให้เธอเป็นคนดูนิ่ง ๆ และมีญาณสัมผัสพิเศษที่แอบมองทะลุหยั่งรู้ถึงเนื้อแท้ในจิตใจคนรอบข้างได้อย่างน่าประหลาด'
    ],

    abilities: [
      {
        title: 'ศาสตร์ขนมฝรั่งเศสชั้นสูง',
        text: 'มีทักษะความประณีตในการทำขนมฝรั่งเศสโบราณระดับมืออาชีพ โดยเฉพาะ "คานาเล่ (Canelé)" ที่เชี่ยวชาญการคุมไฟอบและการบ่มแป้งเป็นพิเศษ'
      },
      {
        title: 'ทักษะกีฬาและศิลปะป้องกันตัว',
        text: 'มีสมรรถภาพร่างกายที่อึดและทนทานสูง โดดเด่นด้านการว่ายน้ำที่สามารถควบคุมจังหวะการหายใจและการเคลื่อนไหวในน้ำได้ดี ควบคู่ไปกับพื้นฐานเทควันโดและมวยไทย ทำให้มีแรงขาและพลังในการเตะที่หนักหน่วง รวดเร็ว และดุดัน สวนทางกับบุคลิกภายนอกที่ดูนิ่งสงบ'
      }
    ],

    personality: [
      'สุขุม นิ่ง คิดลึก เข้าถึงยากแต่ไม่เย็นชา ยึดถือหลักธรรมและความถูกต้องเป็นพื้นฐานในการดำเนินชีวิต พูดตรง ไม่ชอบความเสแสร้ง ละเอียด รอบคอบ มองคนขาด และเด็ดขาดเมื่อจำเป็น',
      'ภายนอกดูนิ่ง น่าเกรงขาม และมีระยะห่างกับคนไม่สนิท แต่เมื่อสนิทจะเผยด้านอบอุ่น สบาย ๆ และขี้เล่น',
      'เป็นคนมีเสน่ห์แบบเฟมินีน สุภาพ เซ็กซี่ น่าทะนุถนอม แต่ยังคงความหนักแน่นในตัว'
    ],

    voice: 'โทนนุ่มทุ้มต่ำกว่าหญิงสาวทั่วไปเล็กน้อย พูดช้า นิ่ง และสุภาพ ฟังดูสุขุม อบอุ่น และชวนให้รู้สึกผ่อนคลาย มีเสน่ห์ลึกลับที่ช่วยให้บรรยากาศรอบตัวสงบลงอย่างเป็นธรรมชาติ',

    // รายการคั่นด้วย ", " ตามต้นฉบับ แต่ละรายการคงตัวสะกดเดิม
    likes: ['ของกินอร่อย ๆ', 'ชาดอกไม้', 'น้ำผึ้ง', 'ผลไม้', 'ขนมลาดู-โมทกะ', 'เครปเย็นสตรอเบอร์รี่', 'ขนมคานาเล่', 'ดอกบัว', 'สัตว์ป่าไฟ', 'ธรรมชาติ', 'เทียนหอม', 'กำยาน', 'ของสะสมศิลปิน', 'งาน Handmade', 'ธรรมะ', 'การพัฒนาตนเอง', 'ศาสตร์ลี้ลับ', 'ทองคำหมอน/ผ้าห่ม', 'การนอน'],
    likesTail: 'และอื่น ๆ อีกมากมาย',
    dislikes: ['มดแดง', 'คนนิสัยไม่ดีและหมกมุ่น', 'อกุศลทั้งปวง', 'เนื้อสัตว์ป่า', 'เนื้อสัตว์ใหญ่', 'ช็อกโกแลต', 'ขนมไส้ถั่ว'],

    // สีจากภาพ Colour Palette ที่เจ้าของตัวละครส่งมา (ชื่อสีตามโจทย์)
    palette: {
      main: [
        { name: 'Espresso Brown', hex: '#220a00' },
        { name: 'Dark Chocolate', hex: '#56281c' },
        { name: 'Cocoa Brown', hex: '#905e4f' },
        { name: 'Golden Caramel', hex: '#edc693' },
        { name: 'Taupe Beige', hex: '#cfbeb6' }
      ],
      extra: [
        { name: 'Skin Pink', hex: '#ffd4d9' },
        { name: 'Dusty Rose', hex: '#d49a90' },
        { name: 'Warm Skin Gold', hex: '#c99d60' },
        { name: 'Dark Accessory', hex: '#201a07' },
        { name: 'Olive Green', hex: '#597641' },
        { name: 'Golden Yellow', hex: '#e09b05' },
        { name: 'Lavender Highlight', hex: '#ab99cd' },
        { name: 'Aqua Highlight', hex: '#b3fffa' }
      ]
    },

    // Furry Form — แสดงเฉพาะข้อมูลที่เจ้าของตัวละครส่งมา
    // ค่าที่เป็น null = ยังไม่ได้รับข้อมูล (หน้าเว็บจะแสดงเป็นช่องว่าง ไม่เดาแทน)
    furry: [
      { label: 'Species', value: null },
      { label: 'Fur Color', value: null },
      { label: 'Ear Design', value: null },
      { label: 'Tail Design', value: null },
      { label: 'Anthro Appearance', value: null },
      { label: 'Special Features', value: null }
    ],

    credits: {
      original: [
        { label: 'Adopt Design', value: 'Kitty Catty' },
        { label: 'Adopt Owner', value: 'Jwala DuHin' },
        { label: 'Artist Facebook', value: 'facebook.com/kitty.catty.510641', href: 'https://www.facebook.com/kitty.catty.510641' }
      ],
      // ตามข้อความที่ปรากฏบนภาพ Furry Design
      furry: [
        { label: 'Adopt Design', value: 'roro090(TH)' },
        { label: 'Adopt Owner', value: 'Jwala DuHin' }
      ],
      website: 'TST Project',
      // ข้อความบนภาพต้นฉบับ (Kitty Catty)
      usage: ['Do not use without permission', 'Please give credit when use', "Don't feed to AI"]
    }
  };

  function deepFreeze(o) {
    Object.values(o).forEach((v) => { if (v && typeof v === 'object') deepFreeze(v); });
    return Object.freeze(o);
  }

  window.ANISE_CHARACTER = deepFreeze(CHARACTER);
})();
