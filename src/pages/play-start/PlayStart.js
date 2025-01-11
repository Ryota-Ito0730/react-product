import { useEffect, useState, useContext, useRef, useCallback } from "react";
import PlayEnd from "../play-end/PlayEnd";
import Ending from "../ending/Ending";
import {SoundProvider} from '../../App'

import hitJudgment from "../../helpers/hitJudgment";// 当たり判定用関数をインポート

import '../../reset.css';
import '../../common.css';
import './play-start.css';
// ステージの各キャラクター
import imgCat from '../../assets/images/play-start/cat.webp';
import imgDog from '../../assets/images/play-start/dog.webp';
import imgPolarBear from '../../assets/images/play-start/polar-bear.webp';
import imgAxolot from '../../assets/images/play-start/axolot.webp';
import imgFriedEgg from '../../assets/images/play-start/fried-egg.webp';

function PlayStart({stateCharacter,handleView,argHandleAudioPlay,argHandleAudioStop}) {
  const selectedCharaRef = useRef(null);
  const charaImgRef = useRef(null);
  const selectedStageBgmRef = useRef(null);
  selectedCharaRef.current = stateCharacter;
  
  const isAudioOn = useContext(SoundProvider);
  // プレイ時間
  const playTime = 60;// TODO : リリース時には60に変更する
  const [time,setTime] = useState(playTime);
  // おしまいテキストを表示タイミングを管理
  const [isActive,setIsActive] = useState(false);

  // Ending画面への切り替えタイミングを管理
  // おしまいテキスト/カウンター/タイムの画面外への移動も兼ねる
  const [isEndingState, setIsEndingState] = useState(false);
  
  // キャラクタの横幅を取得し成長度の計算に使用する(初期値は30px)
  const [characterWidth, setCharacterWidth] = useState(30);
  // ending画面表示後に音声切り替え
  const startEndingBgm = () => {
    if(isAudioOn.current){
      argHandleAudioStop(`${selectedStageBgmRef.current}`);
      argHandleAudioPlay("endingbgm");
    }
  }
  useEffect(()=>{
      const visibleEnding = () => {
        let tempCharaWidth = 30;
        if(document.getElementsByClassName("character-image")[0]){
          tempCharaWidth = document.getElementsByClassName("character-image")[0].offsetWidth;
        }
        setCharacterWidth(tempCharaWidth);// 成長度計算用のwidth
        setIsEndingState(true);// Ending画面へ一斉切り替えのためのclass付与
      }
      let id = setTimeout(()=>{setTime(time - 1);},1000);
      if(time === 0){
        clearTimeout(id);
        setIsDisabled(true);// 目玉焼きボタンの押下を無効化
        // PlayEndコンポーネント(おしまい!テキスト)を呼び出す
        setIsActive(true);
        // おしまいテキスト表示完了後から、2秒後に一気にEnding画面に切り替え
        setTimeout(visibleEnding,2500);
      }
    }
  ,[time]);// useEffect

  // 目玉焼きボタンの伸縮
  const [isClick,setIsClick] = useState(false);
  // 目玉焼きボタンの想定以上の連打を防止(1クリックの挙動が完了後に次のクリックができるようにする)
  // アニメーションエンドの後、isDisabledをfalseに戻す
  const [isDisabled,setIsDisabled] = useState(false);
  // 表示されるタイミング = 目玉焼きボタン1クリックごと
  // 弾にkeyを割当て
  const [bulletKey,setBulletKey] = useState(0);
  // 目玉焼きボタンへの関数をまとめる
  // クリック時
  const handleClick = () => {
    setIsClick(true);// 伸縮クラスの付けはずし
    setIsDisabled(true);// 連打防止
    // 目玉焼きの弾に関する処理まとめ
    handleFriedEggBullet();
  }
  // アニメーションエンドを検知時
  const handleAnimationEnd = () => {
    setIsClick(false);// 伸縮クラスの付けはずし
    setIsDisabled(false);// 連打防止
  }
  // 目玉焼きの弾の処理
  const handleFriedEggBullet = () => {
    // 各弾へのkey
    setBulletKey(bulletKey + 1);
    // 各弾のkeyが生成されるたびに配列に追加し管理(当たり判定が有効となった要素のみ削除する)
    addBulletNums();
    shotSePlay();
  }
  // 弾に割り当てるkeyを生成
  const [bulletNums, setBulletNums] = useState([]);
  const addBulletNums = () => {
    setBulletNums([...bulletNums,bulletKey]);
  }

  /**
   * 初回レンダーおよびヒット時:弾の飛距離を計測しtranslateYの値として付与
   * 変数: bulletMoveState を更新していく
   * 
   */
  const [bulletMoveState, setbulletMoveState] = useState(0);
  const calcBulletMoveDistance = () => {
    // 弾が必要な移動距離 = キャラクターの下側座標と目玉焼きボタンの上側座標の差分
    const targetElement = document.getElementsByClassName("character-image")[0];
    const targetElementBottom = targetElement.getBoundingClientRect().bottom;
    // 弾の発射前の上側座標を取得する(目玉焼きボタンラッパー要素の上部座標)
    const buttonWrapper = document.getElementsByClassName("fried-egg-button-wrapper")[0];
    const buttonWrapperTop = buttonWrapper.getBoundingClientRect().top;
    setbulletMoveState(buttonWrapperTop - targetElementBottom);
  }
  useEffect(() => {
    calcBulletMoveDistance();
  },[bulletMoveState]);


  // animationEndのタイミングでたべた数を更新(キャラのヒットタイミング)
  const [ateEggState, setAteEggState] = useState(0);
  const hitSePlay = useCallback(() => {
    if(isAudioOn.current){
      argHandleAudioPlay("hitse");
    }
  },[isAudioOn, argHandleAudioPlay])
  
  const shotSePlay = () => {
    if(isAudioOn.current){
      argHandleAudioPlay("shotse");
    }
  }
  
  // キャラクタと弾の衝突時のフラッシュ効果を管理
  const [collisionState, setCollisionState] = useState(false);
  const handleCollisionAnimEnd = () => {
    setCollisionState(!collisionState);// キャラクタのフラッシュ終了
  }

  // ヒット時の効果を集約
  const handleBulletAnimationEnd = useCallback(() => {
    bulletNums.shift();
    setBulletNums([...bulletNums]);
    setAteEggState(ateEggState + 1)
    setCollisionState(!collisionState);// キャラクタのフラッシュスタート
    // ヒット時の音声
    hitSePlay();

    // ヒット後の処理で弾の移動距離を再計算
    calcBulletMoveDistance();
  }, [bulletNums,ateEggState,collisionState,hitSePlay]);
  

  
  // ★20250111 IntersectionObserverの処理に置き換え ここから ===============
  const {log} = console;
  log("bulletNums",bulletNums)
  const balletsRef = useRef(null);
  function getMap() {
    if (!balletsRef.current) {
      balletsRef.current = new Map();
    }
    return balletsRef.current;
  }
  
  
  const [currentBulletNum, setCurrentBulletNum] = useState(0);
  const currentBullet = useRef(null);
  useEffect(() => {
    // 目玉焼きの弾と、キャラクターの下側座標の更新値を取得し当たり判定用classに渡す
    console.log("if外 : balletsRef.current",balletsRef.current);
    
    if (balletsRef.current) {
      const targetElement = document.getElementsByClassName("character-image")[0];
      const targetElementBottom = targetElement.getBoundingClientRect().bottom;
      
      currentBullet.current = balletsRef.current.get(currentBulletNum);
      
      if (currentBullet.current) {
        const myIo = new hitJudgment(
          currentBullet.current,
          targetElementBottom,
          handleBulletAnimationEnd
        );
        myIo._init();

        setCurrentBulletNum(currentBulletNum => currentBulletNum + 1);
      }


    }
  }, [bulletNums, handleBulletAnimationEnd, currentBulletNum]);
  
  // ★20250111 IntersectionObserverの処理に置き換え ここまで ===============
  
  // useStateで降りてきたキャラクタ属性値を元に、case文を使ってキャラクタ画像をセット
  useEffect(() => {
      switch (selectedCharaRef.current) {
        case "cat":
          charaImgRef.current = imgCat;
          if(isAudioOn.current){
            argHandleAudioPlay("catstagebgm");
            selectedStageBgmRef.current = "catstagebgm";// エンディング開始時に停止するステージBGM名を指定
          }
        break;
        case "dog":
          charaImgRef.current = imgDog;
          if(isAudioOn.current){
            argHandleAudioPlay("dogstagebgm");
            selectedStageBgmRef.current = "dogstagebgm";// エンディング開始時に停止するステージBGM名を指定
          }
        break;
        case "polar-bear":
          charaImgRef.current = imgPolarBear;
          if(isAudioOn.current){
            argHandleAudioPlay("polarbearstagebgm");
            selectedStageBgmRef.current = "polarbearstagebgm";// エンディング開始時に停止するステージBGM名を指定
          }
        break;
        case "axolot":
          charaImgRef.current = imgAxolot;
          if(isAudioOn.current){
            argHandleAudioPlay("axolotstagebgm");
            selectedStageBgmRef.current = "axolotstagebgm";// エンディング開始時に停止するステージBGM名を指定
          }
        break;
        default:
          console.error("error from PlayStart.js");
      }
  },[argHandleAudioPlay, isAudioOn]);
  

  return (
    <>
    <div className="play-start">
      <style>
      {`@keyframes bulletMove {
        0% {transform: translate(-50%, 0);}
        100% {transform: translate(-50%, -${bulletMoveState}px);}`}
      </style>
      <div className="play-start__inner app__inner">
        <div className={`counter-wrapper${isEndingState?" is_ending-active":""}`}>
          <div className="counter-wrapper__inner">
            <div className="time-counter">
              <div className="time-counter__text">TIME あと</div>
              <div className="time-counter__time">{String(time).padStart(2, "0")}</div>
            </div>
            <div className="fried-egg-counter">
                <div className="fried-egg-counter__image-wrapper">
                  <img className="fried-egg-counter__image" src={imgFriedEgg} alt=""/>
                </div>
                <div className="fried-egg-counter__count">{String(ateEggState).padStart(5, "0")}</div>
            </div>
          </div>{/* counter-wrapper__inner */}
        </div>{/* counter-wrapper */}

        <div className="character-area">{/* 余白調整 */}
          <div 
            className={`character-image__wrapper${collisionState ? " is_collision" : ""}`}
            onAnimationEnd={handleCollisionAnimEnd}
            style={{width:`${30 + ateEggState}px `}}
            >
              <img 
                className="character-image"
                src={charaImgRef.current}
                alt=""
              />
          </div>
        </div>
        <div 
        className={`fried-egg-button-wrapper${isEndingState?" is_ending-active":""}`}
        >
          <button
            disabled={isDisabled}
            className={`fried-egg-button${isClick?" btn-scale-anim":""}`}
            onClick={handleClick}
            onAnimationEnd={time > 0 ? handleAnimationEnd : undefined}        
          >
            <img className="fried-egg-button__image" src={imgFriedEgg} alt="" />
          </button>
          {bulletNums.map((bulletNum) => 
            <img 
              key={`bullet${bulletNum}`} 
              ref={(el) => {
                const map = getMap();
                if(el) {
                  map.set(bulletNum, el);
                } else {
                  map.delete(bulletNum);
                }
              }}
              className="fried-egg-bullet fried-egg-bullet-is-active" 
              src={imgFriedEgg}
              // onAnimationEnd={handleBulletAnimationEnd}
              alt=""   
            />
          )}
        </div>

      </div>{/* play-start__inner */}

    </div>{/* // play-start */}
    <PlayEnd isActive={isActive} isEndingActive={isEndingState}/>
    <Ending 
    isEndingActive={isEndingState}
    bulletCount={ateEggState}
    selectedChara={charaImgRef.current}
    characterWidth={characterWidth}
    handleView={{handleView:handleView,argHandleAudioStop:argHandleAudioStop}}
    handleTransionEnd={startEndingBgm}
    argHandleAudioPlay={argHandleAudioPlay}
    />
    </>
  );
}

export default PlayStart;
