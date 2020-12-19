const handleStartAudio = new Audio("audio/bik.mp3");
const handleBikSound = () => {
  document.querySelector(".bikSound").play();
};
const handleVictorySound = () => {
  document.querySelector(".victorySound").play();
};
const handleFailSound = () => {
  document.querySelector(".failSound").play();
};

const tbody = document.querySelector(".table tbody");
let dataset = [];
let stopFlag = false;
let opened = 0; // 열은 칸.
const codeChart = {
  cOpened: -1,
  cQst: -2,
  cFlag: -3,
  cFlagMine: -4,
  cQstMine: -5,
  cMine: 1,
  cTD: 0,
};
document.querySelector(".exec").addEventListener("click", () => {
  document.querySelector(".exec").textContent = "REPLAY";
  tbody.innerHTML = "";
  stopFlag = false;
  document.querySelector(".result").textContent = "";
  dataset = [];
  opened = 0;
  const hor = parseInt(document.querySelector(".hor").value);
  const ver = parseInt(document.querySelector(".ver").value);
  const mine = parseInt(document.querySelector(".mine").value);
  if (hor * ver < mine) {
    document.querySelector(".result").textContent = "지뢰의 수가 너무 많아요!";
    return;
  } else {
    document.querySelector(".result").textContent = "";
  }
  //---------- 지뢰 랜덤 위치에 생성
  let candidate = Array(hor * ver)
    .fill()
    .map((num, index) => {
      return index;
    });
  let mineIndexArr = []; // 지뢰를 심을 위치가 담긴 배열.
  while (candidate.length > hor * ver - mine) {
    let selectMineIndex = candidate.splice(
      Math.floor(Math.random() * candidate.length),
      1
    )[0];
    mineIndexArr.push(selectMineIndex);
  }
  //----------

  //---------- 테이블 생성
  if (hor !== ver) {
    document.querySelector(
      ".result"
    ).textContent = `가로와 세로의 칸 수를 같게 입력하세요`;
    return;
  } else {
    document.querySelector(".result").textContent = "";
  }
  for (let i = 0; i < ver; i++) {
    let arr = [];
    let tr = document.createElement("tr");
    dataset.push(arr);
    for (let j = 0; j < hor; j++) {
      arr.push(codeChart.cTD);
      let td = document.createElement("td");

      //---------- 깃발, 물음표 생성
      td.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (stopFlag) {
          return;
        }
        let PARENT_TR = e.currentTarget.parentNode;
        let PARENT_TBODY = e.currentTarget.parentNode.parentNode;
        let TD = Array.prototype.indexOf.call(PARENT_TR.children, td);
        let TR = Array.prototype.indexOf.call(PARENT_TBODY.children, PARENT_TR);
        if (td.textContent === "" || td.textContent === "◎") {
          td.textContent = "🚩";
          td.classList.add("flag");
          if (dataset[TR][TD] === codeChart.cMine) {
            dataset[TR][TD] = codeChart.cFlagMine;
          } else {
            dataset[TR][TD] = codeChart.cFlag;
          }
        } else if (td.textContent === "🚩") {
          td.textContent = "❔";
          td.classList.remove("flag");
          td.classList.add("question");

          if (dataset[TR][TD] === codeChart.cFlagMine) {
            dataset[TR][TD] = codeChart.cQstMine;
          } else {
            dataset[TR][TD] = codeChart.cQst;
          }
        } else if (td.textContent === "❔") {
          td.classList.remove("question");

          if (dataset[TR][TD] === codeChart.cQstMine) {
            td.textContent = "◎";
            dataset[TR][TD] = codeChart.cMine;
          } else {
            td.textContent = "";
            dataset[TR][TD] = codeChart.cTD;
          }
        }
      });
      //----------
      //---------- 클릭 시 이벤트
      td.addEventListener("click", (e) => {
        if (stopFlag) {
          return;
        }
        handleBikSound();

        let PARENT_TR = e.currentTarget.parentNode;
        let PARENT_TBODY = e.currentTarget.parentNode.parentNode;
        let TD = Array.prototype.indexOf.call(PARENT_TR.children, td);
        let TR = Array.prototype.indexOf.call(PARENT_TBODY.children, PARENT_TR);
        if (
          [
            codeChart.cOpened,
            codeChart.cFlag,
            codeChart.cFlagMine,
            codeChart.cQstMine,
            codeChart.cQst,
          ].includes(dataset[TR][TD])
        ) {
          return;
        }
        td.classList.add("opened");
        opened++;

        if (dataset[TR][TD] === codeChart.cMine) {
          const handleBoomSound = () => {
            document.querySelector(".boomSound").play();
          };
          handleBoomSound();
          td.classList.remove("mine");

          td.textContent = "💥"; // boom
          handleFailSound();
          document.querySelector(".result").textContent = "정말 못하시네요ㅋ";
          stopFlag = true;
        } else {
          dataset[TR][TD] = 1;
          let around = [dataset[TR][TD - 1], dataset[TR][TD + 1]];
          if (dataset[TR - 1]) {
            around = around.concat(
              dataset[TR - 1][TD - 1],
              dataset[TR - 1][TD],
              dataset[TR - 1][TD + 1]
            );
          }
          if (dataset[TR + 1]) {
            around = around.concat(
              dataset[TR + 1][TD - 1],
              dataset[TR + 1][TD],
              dataset[TR + 1][TD + 1]
            );
          }
          let aroundMinesNum = around.filter((v) => {
            return [
              codeChart.cMine,
              codeChart.cFlagMine,
              codeChart.cQstMine,
            ].includes(v); // 주변 지뢰 개수 감지.
          }).length;
          td.textContent = aroundMinesNum || "";
          dataset[TR][TD] = codeChart.cOpened;
          if (aroundMinesNum === 0) {
            let aroundTD = [];
            if (tbody.children[TR - 1]) {
              aroundTD = aroundTD.concat(
                tbody.children[TR - 1].children[TD - 1],
                tbody.children[TR - 1].children[TD],
                tbody.children[TR - 1].children[TD + 1]
              );
            }
            aroundTD = aroundTD.concat(
              tbody.children[TR].children[TD - 1],
              tbody.children[TR].children[TD + 1]
            );
            if (tbody.children[TR + 1]) {
              aroundTD = aroundTD.concat(
                tbody.children[TR + 1].children[TD - 1],
                tbody.children[TR + 1].children[TD],
                tbody.children[TR + 1].children[TD + 1]
              );
            }
            aroundTD // falsy 값들(0) 모두 클릭.
              .filter((v) => !!v)
              .forEach((side) => {
                let PARENT_TR = side.parentNode;
                let PARENT_TBODY = side.parentNode.parentNode;
                let sideTD = Array.prototype.indexOf.call(
                  PARENT_TR.children,
                  side
                );
                let sideTR = Array.prototype.indexOf.call(
                  PARENT_TBODY.children,
                  PARENT_TR
                );
                if (dataset[sideTR][sideTD] !== codeChart.cOpened) {
                  side.click();
                }
              });
          }
          if (opened === hor * ver - mine) {
            stopFlag = true;
            handleVictorySound();
            document.querySelector(".result").textContent =
              "정말 대단하시네요!";
          }
        }
      });
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  //----------

  //---------- 지뢰 심기
  for (let k = 0; k < mineIndexArr.length; k++) {
    let verIndex = Math.floor(mineIndexArr[k] / ver);
    let horIndex = mineIndexArr[k] % ver; // 변동금지
    tbody.children[verIndex].children[horIndex].textContent = "◎";
    tbody.children[verIndex].children[horIndex].classList.add("mine");
    dataset[verIndex][horIndex] = codeChart.cMine;
  }
});
