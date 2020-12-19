document.querySelector(".exec").addEventListener("click", () => {
  const hor = parseInt(document.querySelector(".hor").value);
  const ver = parseInt(document.querySelector(".ver").value);
  const mine = parseInt(document.querySelector(".mine").value);

  //---------- 지뢰 랜덤 위치에 생성
  let candidate = Array(hor * ver)
    .fill()
    .map((num, index) => {
      return index + 1;
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
  let dataset = [];
  let tbody = document.querySelector(".table tbody");
  for (let i = 0; i < ver; i++) {
    let arr = [];
    let tr = document.createElement("tr");
    dataset.push(arr);
    for (let j = 0; j < hor; j++) {
      arr.push(1);
      let td = document.createElement("td");
      tr.appendChild(td);
      td.textContent = 1;
    }
    tbody.appendChild(tr);
  }
  //----------

  //---------- 지뢰 심기
  for (let k = 0; k < mineIndexArr.length; k++) {
    let verIndex = Math.floor(mineIndexArr[k] / 10) + 1;
    let horIndex = mineIndexArr[k] % 10;
    tbody.children[ver].children[hor] = "X";
  }
});
