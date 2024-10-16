import { useState,createContext,useEffect,useRef } from 'react';
import Start from "./pages/start/Start";
import StageSelect from "./pages/stage-select/StageSelect";
import PlayStart from "./pages/play-start/PlayStart";

// 各画面で使用する音源を非同期で全て読み込み
import topBgm from "./assets/audio/top/top.mp3";
import pushBtnSe from "./assets/audio/push-button/push-button.mp3";
import charaSelectSe from './assets/audio/stage-select/chara_select.mp3';
import stageSelectBgm from './assets/audio/stage-select/stage-select.mp3';
import catStageBgm from './assets/audio/play/cat_stage.mp3';
import dogStageBgm from './assets/audio/play/dog_stage.mp3';
import polarBearStageBgm from './assets/audio/play/polarbear_stage.mp3';
import axolotStageBgm from './assets/audio/play/axolot_stage.mp3';
import hitSe from './assets/audio/play/hit.mp3';
import shotSe from './assets/audio/play/shot.mp3';
import endingBgm from './assets/audio/ending/ending.mp3';

export const SoundProvider = createContext();

let isPlay = false;

function App() {
  const [loadingState, setLoadingState] = useState(false);// ローディング画面用変数

  const topBgmRef = useRef();// 音源管理 TopBgm
  const playAudioRef = useRef();// 音源再生関数の管理(再生用)
  const stopAudioRef = useRef({});// 音源再生関数の管理(停止用)
  // 各種音声のゲイン
  const gainref01 = useRef();
  const gainref02 = useRef();
  const gainref03 = useRef();
  const gainref04 = useRef();
  const gainref05 = useRef();
  const gainref06 = useRef();
  const gainref07 = useRef();
  const gainref08 = useRef();
  const gainref09 = useRef();
  const gainref10 = useRef();
  const gainref11 = useRef();

  // 20240817 Android Chromeで音声処理が意図した結果とならないため対策追記 useEffect内で処理をまとめる
  // 音声読み込みに関する全ての設定を下記hook内でまとめる
  useEffect(()=>{
    topBgmRef.current = new AudioContext();

    gainref01.current = topBgmRef.current.createGain();
    gainref02.current = topBgmRef.current.createGain();
    gainref03.current = topBgmRef.current.createGain();
    gainref04.current = topBgmRef.current.createGain();
    gainref05.current = topBgmRef.current.createGain();
    gainref06.current = topBgmRef.current.createGain();
    gainref07.current = topBgmRef.current.createGain();
    gainref08.current = topBgmRef.current.createGain();
    gainref09.current = topBgmRef.current.createGain();
    gainref10.current = topBgmRef.current.createGain();
    gainref11.current = topBgmRef.current.createGain();

    // 予め使用する音源のpathを全て下記オブジェクトにセット
    const audioFiles = {
      topbgm : topBgm, // top画面用BGM
      pushbtnse01 : pushBtnSe, // ボタン押下時のSE
      charaselectse : charaSelectSe, // ステージセレクト画面内:キャラクタセレクトse
      stageselectbgm : stageSelectBgm, // ステージセレクト画面用BBGM
      catstagebgm : catStageBgm, // キャラクタAステージBGM
      dogstagebgm : dogStageBgm, // 各ステージごとのBGM
      polarbearstagebgm : polarBearStageBgm, // 各ステージごとのBGM
      axolotstagebgm : axolotStageBgm, // 各ステージごとのBGM
      hitse : hitSe,  // 弾がヒット時の音
      shotse : shotSe, // 弾発射時の音
      endingbgm : endingBgm, // エンディング画面の音
    };

    // プロパティ毎にオブジェクトにして配列として取得
    const entries = Object.entries(audioFiles);

    // 音源の読み込み
    function playSound() {
      /*=========================
      *音源を読み込みから再生 ここから
      */
      const fetchedDataWrapper = async () => {
        const promises = [];    // 読み込み完了通知用
        const buffers = {};        // オーディオバッファ格納用
        entries.forEach((entry) => {
          
          const promise = new Promise( async (resolve) => {

            const [name, url] = entry;    //プロパティ名、ファイルのURLに分割
            // console.log(`${name}[${url}] 読み込み開始...`);
  
            // TOP BGMの再生と停止
            const fetchedData = async () => {
              const res = await fetch(`${url}`);
              return res.arrayBuffer();// arrayBufferオブジェクトに変換
            }
            const audioData = await fetchedData();
            const funcAudioBuffer = async (arrayBuffer) => {
                const decodedArrayBuffer = await topBgmRef.current.decodeAudioData(arrayBuffer, function (audioBuffer) {
                  buffers[name] = audioBuffer;
                  // console.log(`audioBuffers["${name}"] loaded. オーディオバッファに格納完了！`);
                  resolve();    // 読み込み完了通知をpromiseに送る
                });// デコード(ArrayBufferをAudioBufferに変換する) 
                playAudioRef.current = decodedArrayBuffer;
                return decodedArrayBuffer;
            }
            await funcAudioBuffer(audioData);

          });
          promises.push(promise);
        });
        await Promise.all(promises);    // 全ての音声ソース読み込みが完了してから
        playAudioRef.current = buffers;// 再生音源自体を管理するrefに格納
        // ここでローディング画面を解除
        setLoadingState(true);

      }// fetchedDataWrapper
      fetchedDataWrapper();      

    }// playSound()
    playSound();
  
  },[]);

  // 各画面で音声ありプレイとするか無音プレイとするかを管理する
  // 20240816 useStateからuseRefで書き換え
  const isAudioOnRef = useRef(false);  
  const handleIsAudioRef = (argIsAudioOnRef) => {
    isAudioOnRef.current = argIsAudioOnRef;
  }
  
  const playAudio = (audioName) => {
    if(topBgmRef.current && playAudioRef.current) {
      const source = topBgmRef.current.createBufferSource();
      switch (audioName) {
        case "topbgm":
          if(isPlay) return;
          source.buffer = playAudioRef.current[`${audioName}`];
          source.loop = true;
          stopAudioRef.current[`${audioName}`] = source;// 停止処理時に参照する
          gainref01.current.connect(topBgmRef.current.destination);
          gainref01.current.gain.value = 0.3;
          source.connect(gainref01.current);// 出力先を設定          
          source.start(0);// 再生開始
          isPlay = true;
        break;
        case "pushbtnse01":
          source.buffer = playAudioRef.current[`${audioName}`];
          source.loop = false;
          gainref02.current.connect(topBgmRef.current.destination);
          gainref02.current.gain.value = 0.2;
          source.connect(gainref02.current);// 出力先を設定          
          source.start(0);// 再生開始
        break;
        case "charaselectse":
          source.buffer = playAudioRef.current[`${audioName}`];
          source.loop = false;
          gainref03.current.connect(topBgmRef.current.destination);
          gainref03.current.gain.value = 0.1;
          source.connect(gainref03.current);// 出力先を設定        
          source.start(0);// 再生開始
        break;
        case "hitse":
          source.buffer = playAudioRef.current[`${audioName}`];
          source.loop = false;
          gainref04.current.connect(topBgmRef.current.destination);
          gainref04.current.gain.value = 0.1;
          source.connect(gainref04.current);// 出力先を設定        
          source.start(0);// 再生開始
        break;
        case "shotse":
          source.buffer = playAudioRef.current[`${audioName}`];
          source.loop = false;
          gainref05.current.connect(topBgmRef.current.destination);
          gainref05.current.gain.value = 0.07;
          source.connect(gainref05.current);// 出力先を設定        
          source.start(0);// 再生開始
        break;
        case "stageselectbgm":
          if(isPlay) return;
          source.buffer = playAudioRef.current[`${audioName}`];
          source.loop = true;
          stopAudioRef.current[`${audioName}`] = source;// 停止処理時に参照する
          gainref06.current.connect(topBgmRef.current.destination);
          gainref06.current.gain.value = 0.15;
          source.connect(gainref06.current);// 出力先を設定        
          source.start(0);// 再生開始
          isPlay = true;
        break;
        case "catstagebgm":
          if(isPlay) return;
          source.buffer = playAudioRef.current[`${audioName}`];
          source.loop = true;
          stopAudioRef.current[`${audioName}`] = source;// 停止処理時に参照する
          gainref07.current.connect(topBgmRef.current.destination);
          gainref07.current.gain.value = 0.3;
          source.connect(gainref07.current);// 出力先を設定        
          source.start(0);// 再生開始
          isPlay = true;
        break;
        case "dogstagebgm":
          if(isPlay) return;
          source.buffer = playAudioRef.current[`${audioName}`];
          source.loop = true;
          stopAudioRef.current[`${audioName}`] = source;// 停止処理時に参照する
          gainref08.current.connect(topBgmRef.current.destination);
          gainref08.current.gain.value = 0.3;
          source.connect(gainref08.current);// 出力先を設定        
          source.start(0);// 再生開始
          isPlay = true;
        break;
        case "polarbearstagebgm":
          if(isPlay) return;
          source.buffer = playAudioRef.current[`${audioName}`];
          source.loop = true;
          stopAudioRef.current[`${audioName}`] = source;// 停止処理時に参照する
          gainref09.current.connect(topBgmRef.current.destination);
          gainref09.current.gain.value = 0.3;
          source.connect(gainref09.current);// 出力先を設定        
          source.start(0);// 再生開始
          isPlay = true;
        break;
        case "axolotstagebgm":
          if(isPlay) return;
          source.buffer = playAudioRef.current[`${audioName}`];
          source.loop = true;
          stopAudioRef.current[`${audioName}`] = source;// 停止処理時に参照する
          gainref10.current.connect(topBgmRef.current.destination);
          gainref10.current.gain.value = 0.3;
          source.connect(gainref10.current);// 出力先を設定        
          source.start(0);// 再生開始
          isPlay = true;
        break;
        case "endingbgm":
          source.buffer = playAudioRef.current[`${audioName}`];
          source.loop = true;
          stopAudioRef.current[`${audioName}`] = source;// 停止処理時に参照する
          gainref11.current.connect(topBgmRef.current.destination);
          gainref11.current.gain.value = 0.2;
          source.connect(gainref11.current);// 出力先を設定        
          source.start(0);// 再生開始
        break;
        default:
          console.error("error from App.js");
      } 
    }
    
  }// const playAudioBufferFunc
  
  const stopAudio = (audioName) => {
    if (stopAudioRef.current) {
      switch (audioName) {
        case "topbgm":
          stopAudioRef.current[`${audioName}`].stop(0);// 停止
          isPlay = false;
        break;
        case "stageselectbgm":
          stopAudioRef.current[`${audioName}`].stop(0);// 停止
          isPlay = false;
        break;
        case "catstagebgm":
          stopAudioRef.current[`${audioName}`].stop(0);// 停止
          isPlay = false;
        break;
        case "dogstagebgm":
          stopAudioRef.current[`${audioName}`].stop(0);// 停止
          isPlay = false;
        break;
        case "polarbearstagebgm":
          stopAudioRef.current[`${audioName}`].stop(0);// 停止
          isPlay = false;
        break;
        case "axolotstagebgm":
          stopAudioRef.current[`${audioName}`].stop(0);// 停止
          isPlay = false;
        break;
        case "endingbgm":
          stopAudioRef.current[`${audioName}`].stop(0);// 停止
          isPlay = false;
        break;
        default:
          console.error("error from App.js");
      } 
    }
  }
  
  // 各コンポーネントをレンダリングするためのstate変数
  const [nextView, setNextView] = useState("Start");
  const selectNextView = (argNextView) => {
    setNextView(argNextView);
  }
  // ステージセレクト画面で選択されたキャラ情報を元にキャラクタの表示内容を変更する
  const [currentCharacter, setCurrentCharacter] = useState("");
  const selectCharacter = (argCharacter) => {
    setCurrentCharacter(argCharacter);
  }
    
  return (
    <div className="App">
    <div className={`loading${loadingState?" is_end":""}`}>LOADING...</div>
    <SoundProvider.Provider value={isAudioOnRef}>
      {nextView === "Start" ? <Start handleView={selectNextView} argHandleIsAudioRef={handleIsAudioRef} argHandleAudioPlay={playAudio} argHandleAudioStop={stopAudio}/> : ""}
      {nextView === "StageSelect" ? <StageSelect handleView={selectNextView} handleSelectCharacter={selectCharacter} argHandleIsAudioRef={handleIsAudioRef} argHandleAudioPlay={playAudio} argHandleAudioStop={stopAudio}/>: ""}
      {nextView === "PlayStart" ? <PlayStart handleView={selectNextView} stateCharacter={currentCharacter} argHandleAudioPlay={playAudio} argHandleAudioStop={stopAudio}/> : ""}
    </SoundProvider.Provider>
    </div>
  );
}

export default App;
