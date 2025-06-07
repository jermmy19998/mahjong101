// 牌型编码
const SUITS = [
  { name: '万', base: 1, class: 'wan' },
  { name: '条', base: 11, class: 'tiao' },
  { name: '筒', base: 21, class: 'tong' }
];
const FENGS = [
  { code: 31, name: '东', class: 'feng' },
  { code: 32, name: '南', class: 'feng' },
  { code: 33, name: '西', class: 'feng' },
  { code: 34, name: '北', class: 'feng' }
];
const LAIZI = { code: 0, name: '赖', class: 'laizi' };

// 生成一组更真实的混合手牌，只能胡数字夹张（4~8万/条/筒）
function generateHand() {
  // 夹张组合严格限定
  const validTriplets = [
    {a:3, b:5, ans:4},
    {a:4, b:6, ans:5},
    {a:5, b:7, ans:6},
    {a:6, b:8, ans:7},
    {a:7, b:9, ans:8}
  ];
  const suits = [
    { base: 1, name: 'w' }, // 万
    { base: 11, name: 't' }, // 条
    { base: 21, name: 'b' }  // 筒
  ];
  let hand, answer;
  while (true) {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const triplet = validTriplets[Math.floor(Math.random() * validTriplets.length)];
    const a = suit.base + triplet.a;
    const b = suit.base + triplet.b;
    answer = suit.base + triplet.ans;
    hand = [a, b];
    let used = {};
    used[a] = 1; used[b] = 1;

    // 生成其他牌，确保能组成合理的牌型
    const allCandidates = [];
    // 添加数字牌（万条筒）
    for (let i = 1; i <= 9; i++) {
      allCandidates.push(i, i + 10, i + 20);
    }
    // 添加风牌
    [31, 32, 33, 34].forEach(x => allCandidates.push(x));

    // 生成剩余的手牌
    while (hand.length < 13) {
      let n = allCandidates[Math.floor(Math.random() * allCandidates.length)];
      if (n === answer) continue;
      if ((used[n] || 0) < 4) {
        hand.push(n);
        used[n] = (used[n] || 0) + 1;
      }
    }

    // 确保手牌能组成合理的牌型
    hand.sort((a, b) => a - b);
    let testHand = hand.slice();
    testHand.push(answer);
    
    // 检查是否能组成有效的胡牌
    if (isValidTing(testHand)) {
      // 额外检查：确保不会出现过多的风牌
      const fengCount = hand.filter(n => n >= 31 && n <= 34).length;
      if (fengCount <= 4) { // 最多允许4张风牌
        break;
      }
    }
  }
  return { hand, answer };
}

// 牌号转文字
function tileToText(code) {
  if (code === 0) return '赖子';
  if (code >= 1 && code <= 9) return code + '万';
  if (code >= 11 && code <= 19) return (code - 10) + '条';
  if (code >= 21 && code <= 29) return (code - 20) + '筒';
  if (code === 31) return '东风';
  if (code === 32) return '南风';
  if (code === 33) return '西风';
  if (code === 34) return '北风';
  return '未知';
}

// 牌号转图片名
function codeToImgName(code) {
  if (code === 0) return 'laizi'; // 赖子
  if (code >= 1 && code <= 9) return code + 'w'; // 万
  if (code >= 11 && code <= 19) return (code - 10) + 't'; // 条
  if (code >= 21 && code <= 29) return (code - 20) + 'b'; // 筒
  if (code === 31) return 'dong';
  if (code === 32) return 'nan';
  if (code === 33) return 'xi';
  if (code === 34) return 'bei';
  if (code === 35) return 'zhong';
  if (code === 36) return 'fa';
  if (code === 37) return 'bai';
  return 'unknown';
}

// 牌号转HTML（用图片）
function createTile(code) {
  const div = document.createElement('div');
  div.className = 'mj-tile';
  const imgName = codeToImgName(code);
  div.innerHTML = `<img src="pics/${imgName}.png" alt="${imgName}" style="width:44px;height:60px;margin-top:2px;">`;
  return div;
}

// 生成5个选项，答案只会是数字夹张，干扰项可为风、赖子或其他夹张
function generateOptions(answer) {
  let options = [answer];
  while (options.length < 5) {
    let n;
    // 1/2概率是干扰项（风、赖子），1/2概率是其他数字夹张
    if (Math.random() < 0.5) {
      // 风或赖子
      const pool = [31, 32, 33, 34, 0];
      n = pool[Math.floor(Math.random() * pool.length)];
    } else {
      // 其他夹张
      const suits = [1, 11, 21];
      const suit = suits[Math.floor(Math.random() * suits.length)];
      const idx = Math.floor(Math.random() * 5) + 3; // 3~7
      n = suit + idx;
    }
    if (options.includes(n)) continue;
    options.push(n);
  }
  // 洗牌
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}

let current = null;
let selected = null;

function renderHand(hand) {
  const handDiv = document.getElementById('hand');
  handDiv.innerHTML = '';
  hand.forEach(n => {
    handDiv.appendChild(createTile(n));
  });
}

function renderOptions(options, answer) {
  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = '';
  options.forEach(code => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<img src="pics/${codeToImgName(code)}.png" alt="${codeToImgName(code)}"><div class='option-label'></div>`;
    btn.onclick = function() {
      selected = code;
      showResult(options, answer);
    };
    optionsDiv.appendChild(btn);
  });
}

function showResult(options, answer) {
  const btns = document.querySelectorAll('.option-btn');
  btns.forEach((btn, idx) => {
    const code = options[idx];
    btn.classList.remove('selected', 'wrong', 'correct');
    if (code === selected) {
      if (code === answer) {
        btn.classList.add('correct');
        document.getElementById('answer').textContent = 'Correct!';
        showZimoEffect();
      } else {
        btn.classList.add('wrong');
        document.getElementById('answer').textContent = 'Wrong! The correct answer is: ' + tileToText(answer);
      }
    } else if (code === answer) {
      btn.classList.add('correct');
    }
    btn.disabled = true;
  });
}

function showZimoEffect() {
  var zimo = document.getElementById('zimoEffect');
  var imgs = ['pics/zimo.png', 'pics/hu.png'];
  var pick = imgs[Math.floor(Math.random() * imgs.length)];
  zimo.innerHTML = `<img src="${pick}" alt="effect" style="width:180px;height:auto;filter:drop-shadow(0 4px 16px #388e3c88);">`;
  zimo.style.display = 'block';
  zimo.style.animation = 'none';
  void zimo.offsetWidth;
  zimo.style.animation = '';
  setTimeout(function() {
    zimo.style.display = 'none';
  }, 1000);
}

function askQuestion() {
  current = generateHand();
  selected = null;
  renderHand(current.hand);
  const options = generateOptions(current.answer);
  renderOptions(options, current.answer);
  document.getElementById('answer').textContent = '';
}

// 判断14张牌能否胡牌（只判断数字牌，风和赖子不参与）
function isValidTing(tiles) {
  // 只保留数字牌
  let nums = tiles.filter(n => (n >= 1 && n <= 9) || (n >= 11 && n <= 19) || (n >= 21 && n <= 29));
  // 赖子和风牌不计入判断
  if (nums.length % 3 !== 2) return false;
  nums.sort((a, b) => a - b);
  
  // 枚举所有对子
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] === nums[i + 1]) {
      let left = nums.slice();
      left.splice(i, 2);
      if (canFormMelds(left)) return true;
    }
  }
  return false;
}

function canFormMelds(arr) {
  if (arr.length === 0) return true;
  
  // 刻子
  for (let i = 0; i < arr.length - 2; i++) {
    if (arr[i] === arr[i + 1] && arr[i] === arr[i + 2]) {
      let left = arr.slice();
      left.splice(i, 3);
      if (canFormMelds(left)) return true;
    }
  }
  
  // 顺子（只允许数字牌）
  for (let i = 0; i < arr.length; i++) {
    let a = arr[i], b = a + 1, c = a + 2;
    // 只允许万/条/筒的顺子
    if (
      ((a >= 1 && a <= 7) || (a >= 11 && a <= 17) || (a >= 21 && a <= 27)) &&
      arr.includes(b) && arr.includes(c)
    ) {
      let left = arr.slice();
      left.splice(left.indexOf(a), 1);
      left.splice(left.indexOf(b), 1);
      left.splice(left.indexOf(c), 1);
      if (canFormMelds(left)) return true;
    }
  }
  return false;
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  askQuestion();
}); 