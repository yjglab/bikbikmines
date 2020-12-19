const tbody = document.querySelector(".table tbody");
let dataset = [];
let stopFlag = false;

document.querySelector(".exec").addEventListener("click", () => {
  tbody.innerHTML = "";
  stopFlag = false;
  document.querySelector(".result").textContent = "";
  dataset = [];
  const hor = parseInt(document.querySelector(".hor").value);
  const ver = parseInt(document.querySelector(".ver").value);
  const mine = parseInt(document.querySelector(".mine").value);

  //---------- 지뢰 랜덤 위치에 생성
  let candidate = Array(hor * ver)
    .fill()
    .map((num, index) => {
      return index;
    });
  let mineIndexArr = []; // 지뢰를 심을 위치가 담긴 배열.
  while (candidate.length > 80) {
    let selectMineIndex = candidate.splice(
      Math.floor(Math.random() * candidate.length),
      1
    )[0];
    mineIndexArr.push(selectMineIndex);
  }
  //----------

  //---------- 테이블 생성
  for (let i = 0; i < ver; i++) {
    let arr = [];
    let tr = document.createElement("tr");
    dataset.push(arr);
    for (let j = 0; j < hor; j++) {
      arr.push(0);
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
        if (td.textContent === "" || td.textContent === "X") {
          td.textContent = "!";
        } else if (td.textContent === "!") {
          td.textContent = "?";
        } else if (td.textContent === "?") {
          td.textContent = "";
          if (dataset[TR][TD] === 1) {
            td.textContent = "";
          } else if (dataset[TR][TD] === "X") {
            td.textContent = "X";
          }
        }
      });
      //----------
      //---------- 클릭 시 이벤트
      td.addEventListener("click", (e) => {
        if (stopFlag) {
          return;
        }
        let PARENT_TR = e.currentTarget.parentNode;
        let PARENT_TBODY = e.currentTarget.parentNode.parentNode;
        let TD = Array.prototype.indexOf.call(PARENT_TR.children, td);
        let TR = Array.prototype.indexOf.call(PARENT_TBODY.children, PARENT_TR);

        td.classList.add("opened");

        if (dataset[TR][TD] === "X") {
          td.textContent = "펑";
          document.querySelector(".result").textContent = "실패!";
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
            return v === "X"; // 주변 지뢰 개수 감지.
          }).length;
          td.textContent = aroundMinesNum || "";
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
                if (dataset[sideTR][sideTD] !== 1) {
                  side.click();
                }
              });
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
    let verIndex = Math.floor(mineIndexArr[k] / 10);
    let horIndex = mineIndexArr[k] % 10;
    tbody.children[verIndex].children[horIndex].textContent = "X";
    dataset[verIndex][horIndex] = "X";
  }
  console.log(dataset);
});
