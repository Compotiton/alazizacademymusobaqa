export const itJavaScriptQuestions = [
  {
    text: "Natija nima?\nlet x = 5;\nif (x++ === 5) {\n  x += 2;\n}\nconsole.log(x);",
    options: ["8","7","6","5"],
    answer: "A",
  },
  {
    text: "Natija nima?\nlet arr = [1, 2, 3, 4];\nlet result = arr.filter(x => x % 2 === 0).map(x => x * 3);\nconsole.log(result);",
    options: ["[1, 2, 3, 4]","[3, 9]","[2, 4]","[6, 12]"],
    answer: "D",
  },
  {
    text: "Natija nima?\nlet a = 10;\nlet b = \"10\";\nconsole.log(a == b);\nconsole.log(a === b);",
    options: ["true false","false true","true true","false false"],
    answer: "A",
  },
  {
    text: "Natija nima?\nfunction test(x) {\n  if (x > 5) return x * 2;\n  return x + 2;\n}\nconsole.log(test(4));",
    options: ["10","6","8","4"],
    answer: "B",
  },
  {
    text: "Natija nima?\nlet sum = 0;\nfor (let i = 1; i <= 5; i++) {\n  if (i % 2 === 0) sum += i;\n}\nconsole.log(sum);",
    options: ["15","9","10","6"],
    answer: "D",
  },
  {
    text: "Natija nima?\nlet x = 10;\nlet y = x > 5 ? 20 : 30;\nconsole.log(y);",
    options: ["undefined","20","30","10"],
    answer: "B",
  },
  {
    text: "Natija nima?\nlet arr = [10, 20, 30];\nconsole.log(arr.pop());\nconsole.log(arr.length);",
    options: ["10 va 2","20 va 2","30 va 2","30 va 3"],
    answer: "C",
  },
  {
    text: "Natija nima?\nlet x = 0;\nwhile (x < 3) {\n  x++;\n}\nconsole.log(x);",
    options: ["0","4","2","3"],
    answer: "D",
  },
  {
    text: "Natija nima?\nconsole.log(!false && true);",
    options: ["null","true","undefined","false"],
    answer: "B",
  },
  {
    text: "Natija nima?\nlet nums = [1, 2, 3];\nlet result = nums.map(x => x + 1);\nconsole.log(nums);\nconsole.log(result);",
    options: ["[1,2,3] va [2,3,4]","[2,3,4] va [1,2,3]","[1,2,3] va [1,2,3]","[2,3,4] va [2,3,4]"],
    answer: "A",
  },
  {
    text: "Natija nima?\nfunction add(a = 2, b = 3) {\n  return a + b;\n}\nconsole.log(add(5));",
    options: ["undefined","8","7","5"],
    answer: "B",
  },
  {
    text: "Natija nima?\nlet x = null;\nconsole.log(typeof x);",
    options: ["string","undefined","object","null"],
    answer: "C",
  },
  {
    text: "Natija nima?\nlet arr = [1, 2, 3, 4, 5];\nconsole.log(arr.slice(1, 4));",
    options: ["[1,2,3,4]","[2,3,4]","[2,3,4,5]","[1,2,3]"],
    answer: "B",
  },
  {
    text: "Natija nima?\nlet x = 5;\nlet y = 10;\nconsole.log(x > 3 && y < 5 || y === 10);",
    options: ["true","undefined","5","false"],
    answer: "A",
  },
  {
    text: "Natija nima?\nlet a = 1;\nfor (let i = 0; i < 3; i++) {\n  a *= 2;\n}\nconsole.log(a);",
    options: ["16","6","4","8"],
    answer: "D",
  },
  {
    text: "Natija nima?\nlet text = \"JavaScript\";\nconsole.log(text.includes(\"Script\"));",
    options: ["true","undefined","Script","false"],
    answer: "A",
  },
  {
    text: "Natija nima?\nlet arr = [1, 2, 3];\narr.push(4);\narr.shift();\nconsole.log(arr);",
    options: ["[2,3]","[2,3,4]","[1,2,3]","[1,2,3,4]"],
    answer: "B",
  },
  {
    text: "Natija nima?\nlet x = 10;\nif (x > 5) {\n  if (x < 15) console.log(\"A\");\n  else console.log(\"B\");\n}",
    options: ["Error","10","B","A"],
    answer: "D",
  },
  {
    text: "Natija nima?\nlet result = [1, 2, 3, 4].filter(x => x > 2);\nconsole.log(result.length);",
    options: ["4","3","2","1"],
    answer: "C",
  },
  {
    text: "Natija nima?\nfunction check(x) {\n  return x % 2 === 0 ? \"juft\" : \"toq\";\n}\nconsole.log(check(7));",
    options: ["toq","false","7","juft"],
    answer: "A",
  },
  {
    text: "Natija nima?\nlet a = 5;\nlet b = ++a;\nconsole.log(a, b);",
    options: ["5 5","6 5","6 6","5 6"],
    answer: "C",
  },
  {
    text: "Natija nima?\nlet a = 5;\nlet b = a++;\nconsole.log(a, b);",
    options: ["5 5","6 5","6 6","5 6"],
    answer: "B",
  },
  {
    text: "Natija nima?\nconsole.log(0 || \"Salom\");",
    options: ["undefined","false","Salom","0"],
    answer: "C",
  },
  {
    text: "Natija nima?\nconsole.log(\"\" || 25);",
    options: ["undefined","false","\"\"","25"],
    answer: "D",
  },
  {
    text: "Natija nima?\nlet arr = [2, 4, 6];\nconsole.log(arr.includes(4));",
    options: ["2","4","true","false"],
    answer: "C",
  },
  {
    text: "Natija nima?\nlet x = 3;\nswitch (x) {\n  case 1: console.log(\"A\"); break;\n  case 2: console.log(\"B\"); break;\n  case 3: console.log(\"C\"); break;\n  default: console.log(\"D\");\n}",
    options: ["D","C","B","A"],
    answer: "B",
  },
  {
    text: "Natija nima?\nlet sum = 0;\nfor (let i = 0; i < 5; i++) {\n  if (i === 3) continue;\n  sum += i;\n}\nconsole.log(sum);",
    options: ["3","6","10","7"],
    answer: "D",
  },
  {
    text: "Natija nima?\nlet arr = [1, 2, 3];\nlet result = arr.map(x => x * x).filter(x => x > 4);\nconsole.log(result);",
    options: ["[9]","[1,9]","[4,9]","[1,4,9]"],
    answer: "A",
  },
  {
    text: "Natija nima?\nfunction test() {\n  let x = 10;\n  return x > 5 && x < 20;\n}\nconsole.log(test());",
    options: ["undefined","false","true","10"],
    answer: "C",
  },
  {
    text: "Natija nima?\nlet arr = [1, 2, 3];\nlet x = arr.pop();\narr.unshift(x);\nconsole.log(arr);",
    options: ["[3,1,2]","[3,2,1]","[2,3,1]","[1,2,3]"],
    answer: "A",
  },
]
