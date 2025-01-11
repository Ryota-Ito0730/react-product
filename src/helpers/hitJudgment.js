/**
 * 当たり判定用class
 */
const {log} = console;// 開発用
// IntersectionObserverをラッパークラスで囲い、動的生成した要素も常時監視できるようにする
class hitJudgment {
  constructor(el, argEnemyBottomValue,argRunFuncs) {
    log("el",el)
    log("argEnemyBottomValue",argEnemyBottomValue)
    // キャラクターの下側座標を更新しながら設定
    this.options = {
      root: null,
      rootMargin: `0px 0px -${argEnemyBottomValue}px`,// ここに敵の下側座標の常時更新値を設置
      threshold: 0,
    };
    // 弾を取得し、1つずつ監視
    this.elm = el;
    this.runFuncs = argRunFuncs;
    // 
  }
  //初期化
  
  _init() {
    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("entry",entry);
          console.log("this.elm",this.elm);
          console.log(this.runFuncs);
          // this.runFuncs();
          // testFunc();
          /*ヒット後の処理{
          音
          光
          キャラクターが大きくなる
          上記処理後にキャラクターの下側座標を再取得
          
          }
          
          
          
          */


        }
      });
    };
    const io = new IntersectionObserver(callback, this.options);

    io.observe(this.elm);
  }
}

export default hitJudgment;