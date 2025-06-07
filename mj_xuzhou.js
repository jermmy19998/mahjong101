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

// 定义所有有效的数字牌代码 (1-9 万/条/筒)
const VALID_NUMERICAL_TILES = [];
for(let i = 1; i <= 9; i++) VALID_NUMERICAL_TILES.push(i); // 万
for(let i = 11; i <= 19; i++) VALID_NUMERICAL_TILES.push(i); // 条
for(let i = 21; i <= 29; i++) VALID_NUMERICAL_TILES.push(i); // 筒

// 获取牌的花色 (用于判断顺子是否同花色)
function getSuit(tile) {
    if (tile >= 1 && tile <= 9) return 'wan';
    if (tile >= 11 && tile <= 19) return 'tiao';
    if (tile >= 21 && tile <= 29) return 'tong';
    return null; // Not a numerical tile
}

// 生成一组严格的数字夹张听牌手牌（13张）及其对应的答案牌（1张），只包含1-9万/条/筒。
function generateHand() {
  // 夹张组合严格限定 {a, b, ans} 其中 a+1=ans, ans+1=b
  const validTriplets = [
    {a:3, b:5, ans:4},
    {a:4, b:6, ans:5},
    {a:5, b:7, ans:6},
    {a:6, b:8, ans:7},
    {a:7, b:9, ans:8}
  ];
  const suits = [
    { base: 1, name: '万', class: 'wan' },
    { base: 11, name: '条', class: 'tiao' },
    { base: 21, name: '筒', class: 'tong' }
  ];

  let hand13 = [];
  let answerTile = 0;

  while (true) {
      let temp14 = []; // Will build a 14-tile winning hand first
      let current14Counts = {};

      // 1. Select a jiazi triplet and suit, and add the 3 tiles to temp14
      const suit = suits[Math.floor(Math.random() * suits.length)];
      const triplet = validTriplets[Math.floor(Math.random() * validTriplets.length)];
      const a = suit.base + triplet.a; // e.g., 3万
      const b = suit.base + triplet.b; // e.g., 5万
      answerTile = suit.base + triplet.ans; // e.g., 4万

      // Ensure the selected jiazi tiles are valid numerical tiles (should be by definition of validTriplets and suits)
      temp14.push(a, answerTile, b);
      current14Counts[a] = (current14Counts[a] || 0) + 1;
      current14Counts[answerTile] = (current14Counts[answerTile] || 0) + 1;
      current14Counts[b] = (current14Counts[b] || 0) + 1;

      // 2. Generate a pair (将) - needs 2 identical tiles
      let pairTile = 0;
      let attempts = 0;
      while(attempts < 100) {
          // Pick a random valid numerical tile for the pair
          const candidatePairCode = VALID_NUMERICAL_TILES[Math.floor(Math.random() * VALID_NUMERICAL_TILES.length)];

          // Ensure the pair tile is not one of the jiazi tiles, and adding two won't exceed 4
          if (candidatePairCode !== a && candidatePairCode !== b && candidatePairCode !== answerTile && (current14Counts[candidatePairCode] || 0) <= 2) {
               temp14.push(candidatePairCode, candidatePairCode);
               current14Counts[candidatePairCode] = (current14Counts[candidatePairCode] || 0) + 2;
               pairTile = candidatePairCode;
               break; // Found a valid pair tile
          }
          attempts++;
      }
      if (pairTile === 0) continue; // Restart if failed to find a pair within attempts

      // 3. Generate 3 more melds (9 tiles total)
      let meldsGenerated = 0;
      attempts = 0;
      while(meldsGenerated < 3 && attempts < 500) { // Limit attempts for melds
          let meldTiles = [];
          let validMeld = false;

          if (Math.random() < 0.6) { // Bias towards sequences slightly
             // Try to generate a sequence (ABC)
             // Pick a random valid numerical tile as the potential first tile of the sequence
             const firstTile = VALID_NUMERICAL_TILES[Math.floor(Math.random() * VALID_NUMERICAL_TILES.length)];
             const secondTile = firstTile + 1;
             const thirdTile = firstTile + 2;

             // Check if the next two tiles are valid numerical tiles and in the same suit
             if (VALID_NUMERICAL_TILES.includes(secondTile) && VALID_NUMERICAL_TILES.includes(thirdTile) && getSuit(firstTile) === getSuit(secondTile) && getSuit(secondTile) === getSuit(thirdTile)) {
                 let candidateSeq = [firstTile, secondTile, thirdTile];
                 
                 // Check if adding these tiles would exceed 4 of any tile in current14Counts
                 let canAddMeld = true;
                 let tempProposedCounts = { ...current14Counts };
                 for(const tile of candidateSeq) {
                     tempProposedCounts[tile] = (tempProposedCounts[tile] || 0) + 1;
                     if (tempProposedCounts[tile] > 4) {
                         canAddMeld = false;
                         break;
                     }
                 }

                 if (canAddMeld) {
                     meldTiles = candidateSeq;
                     validMeld = true;
                 }
             }
          }
          
          if (!validMeld) { // If not a valid sequence or decided to try triplet
              // Try to generate a triplet (AAA)
              let candidateTripletTile = 0;
              let tripletAttempts = 0;
               while(tripletAttempts < 50) { // Limit triplet attempts
                    // Pick a random valid numerical tile for the triplet
                    let candidate = VALID_NUMERICAL_TILES[Math.floor(Math.random() * VALID_NUMERICAL_TILES.length)];

                     // Check if adding this triplet would exceed 4 of any tile in total
                     if ((current14Counts[candidate] || 0) <= 1) { 
                          candidateTripletTile = candidate;
                          break; // Found a valid triplet tile
                     }
                    tripletAttempts++;
               }
              if (candidateTripletTile !== 0) { // If a valid tile was found within attempts
                  meldTiles = [candidateTripletTile, candidateTripletTile, candidateTripletTile];
                  validMeld = true;
              }
          }

          if(validMeld) {
               temp14.push(...meldTiles);
               meldTiles.forEach(tile => current14Counts[tile] = (current14Counts[tile] || 0) + 1);
               meldsGenerated++;
          }
          attempts++;
      }
       if (meldsGenerated < 3) continue; // Restart hand generation if failed to generate 3 melds

      // We now have a valid 14-tile hand structure (4 melds + 1 pair) containing only valid numerical tiles.
      // Remove the answer tile to get the 13 hand tiles
      let answerIndex = temp14.indexOf(answerTile);
      if (answerIndex !== -1) {
          hand13 = temp14.slice();
          hand13.splice(answerIndex, 1);

          // Sort the 13-tile hand
          hand13.sort((a, b) => a - b);

          // Final Validation: Check if this 13-tile hand + answerTile is a valid winning hand using isValidTing
          // isValidTing should now only receive valid numerical tiles.
          let testHand = hand13.slice();
          testHand.push(answerTile);
          testHand.sort((a,b) => a - b);

          // Use isValidTing. If it returns true, we have a valid hand structure.
          // Since we generated a valid 14-tile hand structure from valid numerical tiles,
          // this should pass if isValidTing correctly handles numerical sets without Laizi/Feng/etc.
          if (isValidTing(testHand)) {
               // Success: Generated a valid hand that is designed around the jiazi and contains only valid numerical tiles.
              break; // Found a valid hand structure, exit loop
          }
      }
      // If generation or validation failed for some reason, the loop continues to generate a new hand.
  }

  // Return the 13-tile hand and the correct answer tile
  return { hand: hand13, answer: answerTile };
}

// 牌号转文字
function tileToText(code) {
  // Simplified to only handle 1-9 numerical tiles per suit
  if (code >= 1 && code <= 9) return code + '万';
  if (code >= 11 && code <= 19) return (code - 10) + '条';
  if (code >= 21 && code <= 29) return (code - 20) + '筒';
  // Fallback for unexpected codes (should not be reached if generation is correct)
  console.warn("tileToText received unexpected code: " + code); // Use warn instead of error here
  return '未知'; 
}

// 牌号转图片名
function codeToImgName(code) {
  // Simplified to only handle 1-9 numerical tiles per suit, and original special codes as fallback
  if (code >= 1 && code <= 9) return code + 'w'; // 万
  if (code >= 11 && code <= 19) return (code - 10) + 't'; // 条
  if (code >= 21 && code <= 29) return (code - 20) + 'b'; // 筒
  // Keep mappings for other codes in case they are needed elsewhere or for other exercise types
  if (code === 0) return 'laizi'; 
  if (code === 31) return 'dong'; 
  if (code === 32) return 'nan';
  if (code === 33) return 'xi';
  if (code === 34) return 'bei';
   if (code === 35) return 'zhong';
  if (code === 36) return 'fa';
  if (code === 37) return 'bai';

  console.error("Unknown tile code received by codeToImgName: " + code); // Keep logging for errors
  return 'unknown'; // Fallback
}

// 牌号转HTML（用图片）
function createTile(code) {
  const div = document.createElement('div');
  div.className = 'mj-tile';
  const imgName = codeToImgName(code);
  div.innerHTML = `<img src="pics/${imgName}.png" alt="${imgName}" style="width:44px;height:60px;margin-top:2px;">`;
  return div;
}

// 生成5个选项，答案只会是数字夹张，干扰项只包含1-9万/条/筒的其他数字牌（夹张形式或其他有效数字牌）
function generateOptions(answer) {
  let options = [answer];
  
  // Use the predefined list of all valid numerical tile codes
  const availableInterferenceTiles = VALID_NUMERICAL_TILES.filter(tile => tile !== answer); // Exclude the correct answer

  while (options.length < 5) {
    let n;
    let isValidOption = false;
    while (!isValidOption) { // Loop until a valid numerical option is generated
        // Pick a random tile from the available interference tiles
        n = availableInterferenceTiles[Math.floor(Math.random() * availableInterferenceTiles.length)];
        // Since we pick from VALID_NUMERICAL_TILES, 'n' is guaranteed to be a valid numerical tile code.
        isValidOption = true;
    }

    // Ensure generated option is not already in options (answer already excluded)
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

// 判断14张牌能否胡牌 (支持赖子和跑配)
function isValidTing(tiles) {
  if (tiles.length !== 14) return false; // 胡牌必须是14张

  let tileCounts = {};
  let laiziCount = 0;
  let normalTiles = []; // Non-Laizi tiles

  // Count tiles and separate Laizi
  for (const tile of tiles) {
    if (tile === 0) { // LAIZI.code is 0
      laiziCount++;
    } else {
      tileCounts[tile] = (tileCounts[tile] || 0) + 1;
      normalTiles.push(tile);
    }
  }

  // Sort non-Laizi tiles for consistent processing
  normalTiles.sort((a, b) => a - b);

  // --- Check for 跑配 (Pao Pei) condition ---
  // 跑配: Exactly 2 Laizi. Remaining 12 non-Laizi tiles form a pair and 3 melds (without using Laizi).
  // Note: isValidTing checks if the *hand* is valid for listening. The winning tile condition (4-8) is handled outside this function.
  if (laiziCount === 2) {
    // Check if the 12 normal tiles can form a pair + 3 melds WITHOUT Laizi
    let remaining12 = normalTiles.slice();
    
    // Try every possible pair among the 12 tiles
    let uniqueNormalTiles = Array.from(new Set(remaining12));
    for (const pairTile of uniqueNormalTiles) {
        if (tileCounts[pairTile] >= 2) {
            let tempTiles = remaining12.slice();
            // Remove the pair
            let firstIndex = tempTiles.indexOf(pairTile);
            let secondIndex = tempTiles.indexOf(pairTile, firstIndex + 1);
            tempTiles.splice(secondIndex, 1);
            tempTiles.splice(firstIndex, 1);

            // Check if the remaining 10 tiles can form 3 melds using canFormMeldsRecursive (with 0 laizi)
            if (canFormMeldsRecursive(tempTiles, 0)) {
                return true; // Found a valid Pao Pei structure
            }
        }
    }
  }
  
  // --- Check for standard winning hand (4 melds + 1 pair) ---
  // Iterate through all possible tiles that could form the pair (将)
  let allTiles = tiles.slice(); // Use the 14 tiles including Laizi for standard check
  let uniqueTilesInHand = Array.from(new Set(allTiles));

  for (const pairTile of uniqueTilesInHand) {
      let currentLaizi = laiziCount;
      let tempTiles = allTiles.slice();
      let pairFound = false;

      // Try to form the pair (将) using the pairTile and possibly Laizi
      if (pairTile === 0) { // If Laizi is the pair
          if (currentLaizi >= 2) {
              currentLaizi -= 2;
              pairFound = true;
          }
      } else { // If a normal tile is the pair
          let tileIndex1 = tempTiles.indexOf(pairTile);
          if (tileIndex1 !== -1) {
             let tileIndex2 = tempTiles.indexOf(pairTile, tileIndex1 + 1);
             if (tileIndex2 !== -1) { // Found two of the tile
                 tempTiles.splice(tileIndex2, 1);
                 tempTiles.splice(tileIndex1, 1);
                 pairFound = true;
             } else if (currentLaizi >= 1) { // Found one, use one Laizi
                 tempTiles.splice(tileIndex1, 1);
                 currentLaizi--;
                 pairFound = true;
             }
          }
      }
      
      if (pairFound) {
          // Remove remaining Laizi from tempTiles to pass only normal tiles to recursive function
          let remainingNormalTiles = tempTiles.filter(tile => tile !== 0);
           
          // Check if remaining tiles can form 4 melds using the remaining Laizi
          if (canFormMeldsRecursive(remainingNormalTiles, currentLaizi)) {
              return true;
          }
      }
  }

  return false; // Cannot form any winning hand structure
}

// Recursive function: Checks if the given tiles can form melds using Laizi
// Parameters: tiles - remaining non-Laizi tiles (sorted)
//             laizi - remaining Laizi count
function canFormMeldsRecursive(tiles, laizi) {
  // Base cases
  if (tiles.length === 0) {
    return laizi % 3 === 0; // All remaining Laizi must form triplets
  }

  // If remaining tiles + Laizi cannot form complete melds (groups of 3)
  if ((tiles.length + laizi) % 3 !== 0) return false;

  // --- Try to form a Triplet (AAA) ---
  // Option 1: Three identical tiles
  if (tiles.length >= 3 && tiles[0] === tiles[1] && tiles[1] === tiles[2]) {
    let remaining = tiles.slice(3);
    if (canFormMeldsRecursive(remaining, laizi)) {
      return true;
    }
  }

  // Option 2: Two identical tiles + one Laizi (AA + Laizi)
   if (tiles.length >= 2 && tiles[0] === tiles[1] && laizi >= 1) {
       let remaining = tiles.slice(2);
       if (canFormMeldsRecursive(remaining, laizi - 1)) {
           return true;
       }
   }

  // Option 3: One tile + two Laizi (A + 2 Laizi)
   if (tiles.length >= 1 && laizi >= 2) {
       let remaining = tiles.slice(1);
       if (canFormMeldsRecursive(remaining, laizi - 2)) {
           return true;
       }
   }

  // --- Try to form a Sequence (ABC) ---
  // Only applies to numerical tiles (Wan, Tiao, Tong)
  const isNumerical = (tile) => (tile >= 1 && tile <= 29 && (tile % 10 !== 0));
  const getSuit = (tile) => Math.floor((tile - 1) / 10);

  if (isNumerical(tiles[0])) {
      let tileA = tiles[0];
      let suitA = getSuit(tileA);

      // Try to find B (A+1) and C (A+2) in the same suit using remaining tiles and Laizi
      for (let bUseLaizi = 0; bUseLaizi <= Math.min(laizi, 1); bUseLaizi++) {
          let tileB = tileA + 1;
          if (!isNumerical(tileB) || getSuit(tileB) !== suitA) continue; // Must be numerical and same suit

          let bIndex = tiles.indexOf(tileB, 1); // Search for B after the first tile

          if (bIndex !== -1 || bUseLaizi === 1) { // Found B or can use Laizi for B
              for (let cUseLaizi = 0; cUseLaizi <= Math.min(laizi - bUseLaizi, 1); cUseLaizi++) {
                  let tileC = tileA + 2;
                   if (!isNumerical(tileC) || getSuit(tileC) !== suitA) continue; // Must be numerical and same suit

                  let cIndex = tiles.indexOf(tileC, bIndex !== -1 ? bIndex + 1 : 1); // Search for C after B (if B is found)

                   if (cIndex !== -1 || cUseLaizi === 1) { // Found C or can use Laizi for C
                       let remaining = tiles.slice();
                       let currentLaizi = laizi;

                       // Remove A (always the first tile in this branch)
                       remaining.splice(0, 1);

                       // Remove B (if not using Laizi) and update Laizi count if used
                       if (bUseLaizi === 0) {
                           let bActualIndex = remaining.indexOf(tileB);
                           if (bActualIndex !== -1) {
                               remaining.splice(bActualIndex, 1);
                           } else { continue; } // Should not happen if bIndex was found
                       } else {
                           currentLaizi--;
                       }

                       // Remove C (if not using Laizi) and update Laizi count if used
                        if (cUseLaizi === 0) {
                            let cActualIndex = remaining.indexOf(tileC);
                            if (cActualIndex !== -1) {
                                remaining.splice(cActualIndex, 1);
                            } else { continue; } // Should not happen if cIndex was found
                       } else {
                           currentLaizi--;
                       }
                        // After removing A, B, C (or using laizi), the remaining array is no longer guaranteed to be sorted correctly from the perspective of the next recursive call starting at index 0.
                        // Sorting here is inefficient. A better approach is to pass counts or use a more sophisticated recursion that handles indices carefully.
                        // For simplicity in this edit, let's re-sort, though it's not ideal performance-wise.
                        remaining.sort((a,b) => a - b);

                      if (canFormMeldsRecursive(remaining, currentLaizi)) {
                          return true;
                      }
                  }
              }
          }
      }
  }

  // If no meld can be formed starting with the first tile, and no melds can be formed with only Laizi
  // This first tile must be part of a meld. If we can't form one using the first tile, it's impossible for this branch.
  return false; // If we reach here, we cannot form a meld starting with tiles[0] using available laizi
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  askQuestion();
}); 